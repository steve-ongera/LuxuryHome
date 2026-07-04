import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SlidersHorizontal, X, Grid3X3, List } from 'lucide-react'
import PropertyCard from '../components/property/PropertyCard.jsx'
import { propertiesAPI } from '../utils/api.js'

const PROPERTY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'mansion', label: 'Mansion' },
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'land', label: 'Land' },
  { value: 'hotel', label: 'Hotel/Resort' },
  { value: 'beach', label: 'Beach Property' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'investment', label: 'Investment' },
]

const STATUSES = [
  { value: '', label: 'Any Status' },
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
]

const BEDROOM_OPTIONS = ['Any', '1', '2', '3', '4', '5', '6+']
const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-is_featured', label: 'Featured First' },
]

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    status: searchParams.get('status') || '',
    search: searchParams.get('search') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    featured: searchParams.get('featured') || '',
    ordering: '-created_at',
  })

  const fetchProperties = useCallback(async (resetPage = true) => {
    setLoading(true)
    const currentPage = resetPage ? 1 : page
    try {
      const params = { ...filters, page: currentPage }
      Object.keys(params).forEach((k) => !params[k] && delete params[k])
      const { data } = await propertiesAPI.list(params)
      const results = data?.results || data || []
      setProperties(resetPage ? results : (prev) => [...prev, ...results])
      setTotalCount(data?.count || results.length)
      setHasNext(!!data?.next)
      if (resetPage) setPage(1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => {
    fetchProperties(true)
    // Sync to URL
    const params = {}
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
    setSearchParams(params, { replace: true })
  }, [filters])

  const handleFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ type: '', status: '', search: '', min_price: '', max_price: '', bedrooms: '', featured: '', ordering: '-created_at' })
  }

  const activeFilterCount = [filters.type, filters.status, filters.min_price, filters.max_price, filters.bedrooms].filter(Boolean).length

  return (
    <>
      <Helmet>
        <title>Luxury Properties – Mansions, Villas & Land | LuxuryHome</title>
        <meta name="description" content="Browse premium luxury properties in Kenya. Filter by type, price, location and more. Request free quotations on any listing." />
      </Helmet>

      {/* Header */}
      <section className="properties-header" style={{
        paddingTop: 'calc(var(--nav-h) + var(--topbar-h) + var(--spacing-8))',
        paddingBottom: 'var(--spacing-12)',
        background: 'var(--text-primary)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="container">
          <div className="section-label" style={{ color: 'var(--primary-red)' }}>
            Premium Selection
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: 'var(--spacing-4)' 
          }}>
            <div>
              <h1 style={{ 
                fontSize: 'clamp(2rem, 4vw, 3rem)', 
                color: 'var(--white)',
                marginBottom: 'var(--spacing-2)',
              }}>
                Luxury Properties
              </h1>
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: 'var(--text-sm)',
              }}>
                {loading ? 'Loading…' : `${totalCount.toLocaleString()} properties found`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
              <select
                value={filters.ordering}
                onChange={(e) => handleFilter('ordering', e.target.value)}
                className="form-select"
                style={{ 
                  width: 'auto', 
                  fontSize: 'var(--text-sm)',
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'var(--white)',
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="btn btn-ghost btn-sm"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'var(--white)',
                }}
              >
                {viewMode === 'grid' ? <List size={16} /> : <Grid3X3 size={16} />}
              </button>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="btn btn-ghost btn-sm"
                style={{
                  display: 'flex',
                  gap: 'var(--spacing-2)',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'var(--white)',
                }}
              >
                <SlidersHorizontal size={14} />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ 
        padding: 'var(--spacing-12) clamp(var(--spacing-4), 4vw, var(--spacing-10))' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '280px 1fr', 
          gap: 'var(--spacing-10)', 
          alignItems: 'start' 
        }}>

          {/* ── Sidebar Filters (desktop) ── */}
          <aside className="filter-sidebar">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 'var(--spacing-6)' 
            }}>
              <span style={{ 
                fontSize: 'var(--text-xs)', 
                fontWeight: 700, 
                letterSpacing: '0.15em', 
                textTransform: 'uppercase', 
                color: 'var(--primary-red)' 
              }}>
                Filters
              </span>
              {activeFilterCount > 0 && (
                <button 
                  onClick={clearFilters} 
                  className="flex"
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--text-muted)', 
                    cursor: 'pointer', 
                    fontSize: 'var(--text-sm)', 
                    gap: 'var(--spacing-1)',
                    alignItems: 'center',
                    transition: 'color var(--duration-fast) var(--ease-smooth)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <X size={12} /> Clear all
                </button>
              )}
            </div>

            {/* Search */}
            <div className="filter-group">
              <div className="filter-group-title">Keyword</div>
              <input
                className="form-input"
                type="text"
                placeholder="City, area, property name…"
                value={filters.search}
                onChange={(e) => handleFilter('search', e.target.value)}
              />
            </div>

            {/* Type */}
            <div className="filter-group">
              <div className="filter-group-title">Property Type</div>
              {PROPERTY_TYPES.map((t) => (
                <label key={t.value} className="luxury-checkbox">
                  <input
                    type="radio"
                    name="type"
                    checked={filters.type === t.value}
                    onChange={() => handleFilter('type', t.value)}
                  />
                  {t.label}
                </label>
              ))}
            </div>

            {/* Status */}
            <div className="filter-group">
              <div className="filter-group-title">Listing Status</div>
              {STATUSES.map((s) => (
                <label key={s.value} className="luxury-checkbox">
                  <input
                    type="radio"
                    name="status"
                    checked={filters.status === s.value}
                    onChange={() => handleFilter('status', s.value)}
                  />
                  {s.label}
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <div className="filter-group-title">Price Range (KES)</div>
              <input
                className="form-input"
                type="number"
                placeholder="Min price"
                value={filters.min_price}
                onChange={(e) => handleFilter('min_price', e.target.value)}
                style={{ marginBottom: 'var(--spacing-3)' }}
              />
              <input
                className="form-input"
                type="number"
                placeholder="Max price"
                value={filters.max_price}
                onChange={(e) => handleFilter('max_price', e.target.value)}
              />
            </div>

            {/* Bedrooms */}
            <div className="filter-group">
              <div className="filter-group-title">Bedrooms</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {BEDROOM_OPTIONS.map((b) => {
                  const value = b === 'Any' ? '' : b.replace('+', '')
                  const isActive = filters.bedrooms === value
                  return (
                    <button
                      key={b}
                      onClick={() => handleFilter('bedrooms', value)}
                      className={`badge ${isActive ? 'badge-primary' : 'badge-secondary'}`}
                      style={{
                        cursor: 'pointer',
                        transition: 'all var(--duration-fast) var(--ease-smooth)',
                        fontSize: 'var(--text-sm)',
                        padding: 'var(--spacing-2) var(--spacing-3)',
                        background: isActive ? 'var(--primary-red)' : 'var(--gray-50)',
                        color: isActive ? 'var(--white)' : 'var(--text-secondary)',
                        border: isActive ? 'none' : '1px solid var(--border)',
                      }}
                    >
                      {b}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Featured */}
            <div className="filter-group" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
              <label className="luxury-checkbox">
                <input
                  type="checkbox"
                  checked={filters.featured === 'true'}
                  onChange={(e) => handleFilter('featured', e.target.checked ? 'true' : '')}
                />
                Featured Only
              </label>
            </div>
          </aside>

          {/* ── Results ── */}
          <div>
            {loading && properties.length === 0 ? (
              <div className="loader-wrap" style={{ minHeight: '400px' }}>
                <div className="loader-ring" />
              </div>
            ) : properties.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: 'var(--spacing-20) var(--spacing-8)' 
              }}>
                <h3 style={{ 
                  fontSize: 'var(--text-2xl)', 
                  color: 'var(--text-primary)', 
                  marginBottom: 'var(--spacing-3)' 
                }}>
                  No properties found
                </h3>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  marginBottom: 'var(--spacing-6)' 
                }}>
                  Try adjusting your filters or search terms.
                </p>
                <button onClick={clearFilters} className="btn btn-outline">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' ? 'grid-3' : ''} style={
                  viewMode === 'list' ? { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' } : {}
                }>
                  {properties.map((p) => (
                    <PropertyCard key={p.id} property={p} compact={viewMode === 'list'} />
                  ))}
                </div>

                {hasNext && (
                  <div style={{ textAlign: 'center', marginTop: 'var(--spacing-12)' }}>
                    <button
                      className="btn btn-outline"
                      onClick={() => { setPage((p) => p + 1); fetchProperties(false) }}
                      disabled={loading}
                    >
                      {loading ? 'Loading…' : 'Load More Properties'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="modal-overlay" onClick={() => setMobileFiltersOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>
                Filters
              </h3>
              <button 
                className="modal-close" 
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              {/* Mobile filter content - duplicate of sidebar filters */}
              <div className="filter-sidebar" style={{ position: 'static', border: 'none', padding: 0 }}>
                {/* Search */}
                <div className="filter-group">
                  <div className="filter-group-title">Keyword</div>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="City, area, property name…"
                    value={filters.search}
                    onChange={(e) => handleFilter('search', e.target.value)}
                  />
                </div>

                {/* Type */}
                <div className="filter-group">
                  <div className="filter-group-title">Property Type</div>
                  {PROPERTY_TYPES.map((t) => (
                    <label key={t.value} className="luxury-checkbox">
                      <input
                        type="radio"
                        name="type-mobile"
                        checked={filters.type === t.value}
                        onChange={() => handleFilter('type', t.value)}
                      />
                      {t.label}
                    </label>
                  ))}
                </div>

                {/* Status */}
                <div className="filter-group">
                  <div className="filter-group-title">Listing Status</div>
                  {STATUSES.map((s) => (
                    <label key={s.value} className="luxury-checkbox">
                      <input
                        type="radio"
                        name="status-mobile"
                        checked={filters.status === s.value}
                        onChange={() => handleFilter('status', s.value)}
                      />
                      {s.label}
                    </label>
                  ))}
                </div>

                {/* Price Range */}
                <div className="filter-group">
                  <div className="filter-group-title">Price Range (KES)</div>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="Min price"
                    value={filters.min_price}
                    onChange={(e) => handleFilter('min_price', e.target.value)}
                    style={{ marginBottom: 'var(--spacing-3)' }}
                  />
                  <input
                    className="form-input"
                    type="number"
                    placeholder="Max price"
                    value={filters.max_price}
                    onChange={(e) => handleFilter('max_price', e.target.value)}
                  />
                </div>

                {/* Bedrooms */}
                <div className="filter-group">
                  <div className="filter-group-title">Bedrooms</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                    {BEDROOM_OPTIONS.map((b) => {
                      const value = b === 'Any' ? '' : b.replace('+', '')
                      const isActive = filters.bedrooms === value
                      return (
                        <button
                          key={b}
                          onClick={() => handleFilter('bedrooms', value)}
                          className={`badge ${isActive ? 'badge-primary' : 'badge-secondary'}`}
                          style={{
                            cursor: 'pointer',
                            transition: 'all var(--duration-fast) var(--ease-smooth)',
                            fontSize: 'var(--text-sm)',
                            padding: 'var(--spacing-2) var(--spacing-3)',
                            background: isActive ? 'var(--primary-red)' : 'var(--gray-50)',
                            color: isActive ? 'var(--white)' : 'var(--text-secondary)',
                            border: isActive ? 'none' : '1px solid var(--border)',
                          }}
                        >
                          {b}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Featured */}
                <div className="filter-group" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                  <label className="luxury-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.featured === 'true'}
                      onChange={(e) => handleFilter('featured', e.target.checked ? 'true' : '')}
                    />
                    Featured Only
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-ghost" 
                onClick={() => {
                  clearFilters()
                  setMobileFiltersOpen(false)
                }}
              >
                Clear All
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => setMobileFiltersOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .filter-sidebar { display: none !important; }
          [style*="grid-template-columns: 280px"] { grid-template-columns: 1fr !important; }
        }
        
        @media (max-width: 599px) {
          .properties-header {
            padding-top: calc(var(--nav-h) + var(--spacing-6)) !important;
            padding-bottom: var(--spacing-6) !important;
          }
        }
        
        /* Mobile filter modal fixes */
        .modal-body .filter-sidebar {
          display: block !important;
        }
      `}</style>
    </>
  )
}