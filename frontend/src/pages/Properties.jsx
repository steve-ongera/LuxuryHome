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
      <div style={{
        paddingTop: '8rem',
        paddingBottom: '3rem',
        background: 'var(--dark)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="container">
          <div className="section-label">Premium Selection</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
                Luxury Properties
              </h1>
              <p style={{ color: 'var(--gray-mid)', fontSize: '0.9rem' }}>
                {loading ? 'Loading…' : `${totalCount.toLocaleString()} properties found`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <select
                value={filters.ordering}
                onChange={(e) => handleFilter('ordering', e.target.value)}
                className="form-select"
                style={{ width: 'auto', fontSize: '0.82rem' }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                style={{ background: 'var(--dark-3)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--gray-mid)', padding: '0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {viewMode === 'grid' ? <List size={16} /> : <Grid3X3 size={16} />}
              </button>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="btn btn-ghost btn-sm"
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
              >
                <SlidersHorizontal size={14} />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem clamp(1rem,4vw,2.5rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem', alignItems: 'start' }}>

          {/* ── Sidebar Filters (desktop) ── */}
          <aside className="filter-sidebar" style={{ display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                Filters
              </span>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} style={{ background: 'transparent', border: 'none', color: 'var(--gray-muted)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
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
                style={{ marginBottom: '0.75rem' }}
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {BEDROOM_OPTIONS.map((b) => (
                  <button
                    key={b}
                    onClick={() => handleFilter('bedrooms', b === 'Any' ? '' : b.replace('+', ''))}
                    style={{
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.78rem',
                      background: filters.bedrooms === (b === 'Any' ? '' : b.replace('+', ''))
                        ? 'var(--gold)' : 'var(--dark-3)',
                      color: filters.bedrooms === (b === 'Any' ? '' : b.replace('+', ''))
                        ? 'var(--black)' : 'var(--gray-mid)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured */}
            <div className="filter-group">
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
              <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--warm-white)', marginBottom: '0.75rem' }}>
                  No properties found
                </p>
                <p style={{ color: 'var(--gray-muted)', marginBottom: '2rem' }}>
                  Try adjusting your filters or search terms.
                </p>
                <button onClick={clearFilters} className="btn btn-outline">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' ? 'grid-3' : ''} style={viewMode === 'list' ? { display: 'flex', flexDirection: 'column', gap: '1rem' } : {}}>
                  {properties.map((p) => (
                    <PropertyCard key={p.id} property={p} compact={viewMode === 'list'} />
                  ))}
                </div>

                {hasNext && (
                  <div style={{ textAlign: 'center', marginTop: '3rem' }}>
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

      <style>{`
        @media (max-width: 900px) {
          .filter-sidebar { display: none !important; }
          [style*="grid-template-columns: 260px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}