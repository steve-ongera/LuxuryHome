/**
 * LuxuryHome API Utility
 * Centralised Axios instance with JWT handling, interceptors,
 * and typed endpoint helpers for every backend resource.
 */

import axios from 'axios'

// ── Base Instance ─────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Token Helpers ─────────────────────────────────────────
export const tokenStorage = {
  getAccess:    () => localStorage.getItem('lh_access'),
  getRefresh:   () => localStorage.getItem('lh_refresh'),
  setAccess:    (t) => localStorage.setItem('lh_access', t),
  setRefresh:   (t) => localStorage.setItem('lh_refresh', t),
  setTokens:    (a, r) => { tokenStorage.setAccess(a); tokenStorage.setRefresh(r) },
  clear:        () => { localStorage.removeItem('lh_access'); localStorage.removeItem('lh_refresh') },
}

// ── Request Interceptor – attach JWT ──────────────────────
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccess()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor – refresh JWT on 401 ─────────────
let isRefreshing = false
let pendingQueue = []

const processQueue = (error, token = null) => {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  pendingQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      const refreshToken = tokenStorage.getRefresh()
      if (!refreshToken) {
        tokenStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`
              resolve(api(original))
            },
            reject,
          })
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        })
        tokenStorage.setAccess(data.access)
        api.defaults.headers.common.Authorization = `Bearer ${data.access}`
        processQueue(null, data.access)
        return api(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        tokenStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// ── Utility ───────────────────────────────────────────────
const extractError = (err) => {
  const data = err.response?.data
  if (!data) return err.message || 'An error occurred'
  if (typeof data === 'string') return data
  const first = Object.values(data)[0]
  return Array.isArray(first) ? first[0] : String(first)
}

// ─────────────────────────────────────────────────────────
// AUTH ENDPOINTS
// ─────────────────────────────────────────────────────────
export const authAPI = {
  register: (payload) => api.post('/auth/register/', payload),
  login: (email, password) => api.post('/auth/login/', { email, password }),
  refreshToken: (refresh) => api.post('/auth/token/refresh/', { refresh }),
  googleLogin: (token) => api.post('/auth/google/', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password/', { email }),
  resetPassword: (uid, token, password) =>
    api.post('/auth/reset-password/', { uid, token, new_password: password }),
  verifyEmail: (token) => api.post('/auth/verify-email/', { token }),
  me: () => api.get('/auth/me/'),
  updateProfile: (data) => api.patch('/auth/me/', data),
  changePassword: (old_password, new_password) =>
    api.post('/auth/change-password/', { old_password, new_password }),
  logout: (refresh) => api.post('/auth/logout/', { refresh }),
}

// ─────────────────────────────────────────────────────────
// PROPERTY ENDPOINTS
// ─────────────────────────────────────────────────────────
export const propertiesAPI = {
  /**
   * List / search properties.
   * @param {Object} params - { type, city, country, min_price, max_price,
   *                           bedrooms, bathrooms, status, featured, page }
   */
  list: (params = {}) => api.get('/properties/', { params }),
  detail: (slug) => api.get(`/properties/${slug}/`),
  featured: () => api.get('/properties/featured/'),
  trending: () => api.get('/properties/trending/'),
  recent: () => api.get('/properties/recent/'),
  search: (query, params = {}) => api.get('/properties/', { params: { search: query, ...params } }),

  // Agent / Admin
  create: (formData) =>
    api.post('/properties/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (slug, formData) =>
    api.patch(`/properties/${slug}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (slug) => api.delete(`/properties/${slug}/`),
  approve: (id) => api.post(`/properties/${id}/approve/`),

  // User interactions
  toggleFavorite: (slug) => api.post(`/properties/${slug}/favorite/`),
  favorites: () => api.get('/properties/favorites/'),
  compare: (slugs) => api.post('/properties/compare/', { slugs }),
  addReview: (slug, data) => api.post(`/properties/${slug}/reviews/`, data),
  reviews: (slug) => api.get(`/properties/${slug}/reviews/`),
  trackView: (slug) => api.post(`/properties/${slug}/view/`),

  // SEO
  seoData: (slug) => api.get(`/properties/${slug}/seo/`),
}

// ─────────────────────────────────────────────────────────
// QUOTE REQUEST ENDPOINTS  (no auth required for POST)
// ─────────────────────────────────────────────────────────
export const quotesAPI = {
  /**
   * Submit a quotation request — NO authentication required.
   * @param {Object} payload
   * @param {string} payload.property   - property slug or id
   * @param {string} payload.full_name
   * @param {string} payload.email
   * @param {string} payload.phone
   * @param {string} payload.budget
   * @param {string} payload.message
   * @param {string} [payload.viewing_date]
   * @param {string} [payload.inquiry_type] - 'quote'|'viewing'|'financing'
   */
  submit: (payload) => api.post('/quotes/', payload),

  // Agent / Admin
  list: (params = {}) => api.get('/quotes/', { params }),
  detail: (id) => api.get(`/quotes/${id}/`),
  update: (id, data) => api.patch(`/quotes/${id}/`, data),
  respond: (id, message) => api.post(`/quotes/${id}/respond/`, { message }),
  myQuotes: () => api.get('/quotes/mine/'),
}

// ─────────────────────────────────────────────────────────
// HOTEL ENDPOINTS
// ─────────────────────────────────────────────────────────
export const hotelsAPI = {
  list: (params = {}) => api.get('/hotels/', { params }),
  detail: (slug) => api.get(`/hotels/${slug}/`),
  featured: () => api.get('/hotels/featured/'),
  rooms: (slug) => api.get(`/hotels/${slug}/rooms/`),
  checkAvailability: (slug, params) => api.get(`/hotels/${slug}/availability/`, { params }),
  book: (slug, data) => api.post(`/hotels/${slug}/book/`, data),
  myBookings: () => api.get('/hotels/bookings/mine/'),
  addReview: (slug, data) => api.post(`/hotels/${slug}/reviews/`, data),

  // Hotel Owner
  create: (formData) =>
    api.post('/hotels/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (slug, formData) =>
    api.patch(`/hotels/${slug}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updatePricing: (slug, pricing) => api.post(`/hotels/${slug}/pricing/`, pricing),
}

// ─────────────────────────────────────────────────────────
// ADMIN ENDPOINTS
// ─────────────────────────────────────────────────────────
export const adminAPI = {
  analytics: (params = {}) => api.get('/admin/analytics/', { params }),
  users: (params = {}) => api.get('/admin/users/', { params }),
  userDetail: (id) => api.get(`/admin/users/${id}/`),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/`, { role }),
  deactivateUser: (id) => api.post(`/admin/users/${id}/deactivate/`),
  pendingProperties: () => api.get('/admin/properties/pending/'),
  approveProperty: (id) => api.post(`/admin/properties/${id}/approve/`),
  rejectProperty: (id, reason) => api.post(`/admin/properties/${id}/reject/`, { reason }),
  seoSettings: () => api.get('/admin/seo/'),
  updateSeoSettings: (data) => api.patch('/admin/seo/', data),
  sitemap: () => api.get('/admin/sitemap/generate/'),
  revenue: (params = {}) => api.get('/admin/revenue/', { params }),
}

// ─────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────
export const notificationsAPI = {
  list: () => api.get('/notifications/'),
  markRead: (id) => api.patch(`/notifications/${id}/`, { read: true }),
  markAllRead: () => api.post('/notifications/mark-all-read/'),
  unreadCount: () => api.get('/notifications/unread-count/'),
}

// ─────────────────────────────────────────────────────────
// MISC / UTILITY
// ─────────────────────────────────────────────────────────
export const utilsAPI = {
  countries: () => api.get('/utils/countries/'),
  cities: (country) => api.get('/utils/cities/', { params: { country } }),
  propertyTypes: () => api.get('/utils/property-types/'),
  amenities: () => api.get('/utils/amenities/'),
  testimonials: () => api.get('/utils/testimonials/'),
  partners: () => api.get('/utils/partners/'),
  contactMessage: (data) => api.post('/utils/contact/', data),
  mortgageCalc: (data) => api.post('/utils/mortgage-calculator/', data),

  // M-Pesa payment
  mpesaSTKPush: (data) => api.post('/payments/mpesa/stk-push/', data),
  mpesaStatus: (checkoutRequestId) =>
    api.get(`/payments/mpesa/status/${checkoutRequestId}/`),
}

// ─────────────────────────────────────────────────────────
// AGENT ENDPOINTS
// ─────────────────────────────────────────────────────────
export const agentAPI = {
  myListings: (params = {}) => api.get('/agent/properties/', { params }),
  analytics: () => api.get('/agent/analytics/'),
  inquiries: () => api.get('/agent/inquiries/'),
  appointments: () => api.get('/agent/appointments/'),
  scheduleAppointment: (data) => api.post('/agent/appointments/', data),
  profile: () => api.get('/agent/profile/'),
  updateProfile: (data) => api.patch('/agent/profile/', data),
}

// ─────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────
export { extractError }
export default api