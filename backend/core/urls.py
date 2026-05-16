"""
LuxuryHome – core/urls.py
Single file containing every URL pattern for the platform.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    # Auth
    RegisterView, LoginView, LogoutView, MeView,
    ChangePasswordView, ForgotPasswordView, ResetPasswordView,
    VerifyEmailView, GoogleAuthView,

    # Properties
    PropertyListCreateView, PropertyDetailView,
    FeaturedPropertiesView, TrendingPropertiesView, RecentPropertiesView,
    PropertyToggleFavoriteView, PropertyFavoritesView,
    PropertyTrackViewView, PropertyApproveView, PropertyRejectView,
    PropertyReviewListCreateView, PropertyCompareView, PropertySEOView,

    # Quotes
    QuoteRequestListCreateView, QuoteRequestDetailView,
    QuoteRespondView, MyQuotesView,

    # Hotels
    HotelListCreateView, HotelDetailView, HotelFeaturedView,
    HotelRoomListView, HotelAvailabilityView,
    HotelBookingListCreateView, MyHotelBookingsView,
    HotelReviewListCreateView,

    # Appointments
    AppointmentListCreateView, AppointmentDetailView,

    # Notifications
    NotificationListView, NotificationDetailView,
    NotificationMarkAllReadView, NotificationUnreadCountView,

    # Payments
    MpesaSTKPushView, MpesaCallbackView, MpesaStatusView,

    # Admin
    AdminAnalyticsView, AdminUserListView, AdminUserDetailView,
    AdminDeactivateUserView, AdminPendingPropertiesView,
    AdminSiteSettingsView, AdminRevenueView,

    # Agent
    AgentAnalyticsView, AgentListingsView, AgentInquiriesView,

    # Utils / CMS
    AmenityListView, PropertyTypeListView,
    TestimonialListView, PartnerListView,
    ContactMessageView, CountryListView, CityListView,
    MortgageCalculatorView, SitemapDataView,
)

# ─────────────────────────────────────────────────────────────
# AUTH
# ─────────────────────────────────────────────────────────────
auth_patterns = [
    path("auth/register/",         RegisterView.as_view(),        name="auth-register"),
    path("auth/login/",            LoginView.as_view(),           name="auth-login"),
    path("auth/logout/",           LogoutView.as_view(),          name="auth-logout"),
    path("auth/token/refresh/",    TokenRefreshView.as_view(),    name="auth-token-refresh"),
    path("auth/me/",               MeView.as_view(),              name="auth-me"),
    path("auth/change-password/",  ChangePasswordView.as_view(),  name="auth-change-password"),
    path("auth/forgot-password/",  ForgotPasswordView.as_view(),  name="auth-forgot-password"),
    path("auth/reset-password/",   ResetPasswordView.as_view(),   name="auth-reset-password"),
    path("auth/verify-email/",     VerifyEmailView.as_view(),     name="auth-verify-email"),
    path("auth/google/",           GoogleAuthView.as_view(),      name="auth-google"),
]

# ─────────────────────────────────────────────────────────────
# PROPERTIES
# ─────────────────────────────────────────────────────────────
property_patterns = [
    path("properties/",                      PropertyListCreateView.as_view(),      name="property-list"),
    path("properties/featured/",             FeaturedPropertiesView.as_view(),      name="property-featured"),
    path("properties/trending/",             TrendingPropertiesView.as_view(),      name="property-trending"),
    path("properties/recent/",               RecentPropertiesView.as_view(),        name="property-recent"),
    path("properties/favorites/",            PropertyFavoritesView.as_view(),       name="property-favorites"),
    path("properties/compare/",              PropertyCompareView.as_view(),         name="property-compare"),

    # Slug-based detail routes
    path("properties/<slug:slug>/",          PropertyDetailView.as_view(),          name="property-detail"),
    path("properties/<slug:slug>/favorite/", PropertyToggleFavoriteView.as_view(),  name="property-favorite"),
    path("properties/<slug:slug>/view/",     PropertyTrackViewView.as_view(),       name="property-track-view"),
    path("properties/<slug:slug>/reviews/",  PropertyReviewListCreateView.as_view(),name="property-reviews"),
    path("properties/<slug:slug>/seo/",      PropertySEOView.as_view(),             name="property-seo"),

    # ID-based admin actions
    path("properties/<uuid:pk>/approve/",    PropertyApproveView.as_view(),         name="property-approve"),
    path("properties/<uuid:pk>/reject/",     PropertyRejectView.as_view(),          name="property-reject"),
]

# ─────────────────────────────────────────────────────────────
# QUOTES
# ─────────────────────────────────────────────────────────────
quote_patterns = [
    path("quotes/",                 QuoteRequestListCreateView.as_view(), name="quote-list"),
    path("quotes/mine/",            MyQuotesView.as_view(),               name="quote-mine"),
    path("quotes/<uuid:pk>/",       QuoteRequestDetailView.as_view(),     name="quote-detail"),
    path("quotes/<uuid:pk>/respond/", QuoteRespondView.as_view(),         name="quote-respond"),
]

# ─────────────────────────────────────────────────────────────
# HOTELS
# ─────────────────────────────────────────────────────────────
hotel_patterns = [
    path("hotels/",                           HotelListCreateView.as_view(),      name="hotel-list"),
    path("hotels/featured/",                  HotelFeaturedView.as_view(),        name="hotel-featured"),
    path("hotels/bookings/mine/",             MyHotelBookingsView.as_view(),      name="hotel-my-bookings"),
    path("hotels/<slug:slug>/",               HotelDetailView.as_view(),          name="hotel-detail"),
    path("hotels/<slug:slug>/rooms/",         HotelRoomListView.as_view(),        name="hotel-rooms"),
    path("hotels/<slug:slug>/availability/",  HotelAvailabilityView.as_view(),    name="hotel-availability"),
    path("hotels/<slug:slug>/book/",          HotelBookingListCreateView.as_view(), name="hotel-book"),
    path("hotels/<slug:slug>/reviews/",       HotelReviewListCreateView.as_view(), name="hotel-reviews"),
]

# ─────────────────────────────────────────────────────────────
# APPOINTMENTS
# ─────────────────────────────────────────────────────────────
appointment_patterns = [
    path("agent/appointments/",         AppointmentListCreateView.as_view(), name="appointment-list"),
    path("agent/appointments/<uuid:pk>/", AppointmentDetailView.as_view(),   name="appointment-detail"),
]

# ─────────────────────────────────────────────────────────────
# NOTIFICATIONS
# ─────────────────────────────────────────────────────────────
notification_patterns = [
    path("notifications/",                   NotificationListView.as_view(),         name="notification-list"),
    path("notifications/mark-all-read/",     NotificationMarkAllReadView.as_view(),  name="notification-mark-all"),
    path("notifications/unread-count/",      NotificationUnreadCountView.as_view(),  name="notification-unread-count"),
    path("notifications/<uuid:pk>/",         NotificationDetailView.as_view(),       name="notification-detail"),
]

# ─────────────────────────────────────────────────────────────
# PAYMENTS
# ─────────────────────────────────────────────────────────────
payment_patterns = [
    path("payments/mpesa/stk-push/",          MpesaSTKPushView.as_view(),  name="mpesa-stk-push"),
    path("payments/mpesa/callback/",          MpesaCallbackView.as_view(), name="mpesa-callback"),
    path("payments/mpesa/status/<str:checkout_request_id>/",
                                              MpesaStatusView.as_view(),   name="mpesa-status"),
]

# ─────────────────────────────────────────────────────────────
# ADMIN
# ─────────────────────────────────────────────────────────────
admin_patterns = [
    path("admin/analytics/",              AdminAnalyticsView.as_view(),       name="admin-analytics"),
    path("admin/revenue/",                AdminRevenueView.as_view(),         name="admin-revenue"),
    path("admin/users/",                  AdminUserListView.as_view(),        name="admin-users"),
    path("admin/users/<uuid:pk>/",        AdminUserDetailView.as_view(),      name="admin-user-detail"),
    path("admin/users/<uuid:pk>/deactivate/", AdminDeactivateUserView.as_view(), name="admin-user-deactivate"),
    path("admin/properties/pending/",     AdminPendingPropertiesView.as_view(), name="admin-pending-props"),
    path("admin/seo/",                    AdminSiteSettingsView.as_view(),    name="admin-seo"),
]

# ─────────────────────────────────────────────────────────────
# AGENT
# ─────────────────────────────────────────────────────────────
agent_patterns = [
    path("agent/analytics/",    AgentAnalyticsView.as_view(),  name="agent-analytics"),
    path("agent/properties/",   AgentListingsView.as_view(),   name="agent-listings"),
    path("agent/inquiries/",    AgentInquiriesView.as_view(),  name="agent-inquiries"),
]

# ─────────────────────────────────────────────────────────────
# UTILS / CMS
# ─────────────────────────────────────────────────────────────
utils_patterns = [
    path("utils/amenities/",             AmenityListView.as_view(),         name="amenity-list"),
    path("utils/property-types/",        PropertyTypeListView.as_view(),    name="property-types"),
    path("utils/testimonials/",          TestimonialListView.as_view(),     name="testimonials"),
    path("utils/partners/",              PartnerListView.as_view(),         name="partners"),
    path("utils/contact/",               ContactMessageView.as_view(),      name="contact"),
    path("utils/countries/",             CountryListView.as_view(),         name="countries"),
    path("utils/cities/",                CityListView.as_view(),            name="cities"),
    path("utils/mortgage-calculator/",   MortgageCalculatorView.as_view(),  name="mortgage-calc"),
    path("utils/sitemap/",               SitemapDataView.as_view(),         name="sitemap-data"),
]

# ─────────────────────────────────────────────────────────────
# COMBINED urlpatterns
# ─────────────────────────────────────────────────────────────
urlpatterns = (
    auth_patterns
    + property_patterns
    + quote_patterns
    + hotel_patterns
    + appointment_patterns
    + notification_patterns
    + payment_patterns
    + admin_patterns
    + agent_patterns
    + utils_patterns
)