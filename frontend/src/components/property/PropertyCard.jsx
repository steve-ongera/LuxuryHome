import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Heart, BedDouble, Bath, Maximize, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { propertiesAPI } from '../../utils/api.js'
import { toast } from 'react-toastify'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'

const formatPrice = (price, currency = 'KES') => {
  if (!price) return 'Price on request'
  const num = parseFloat(price)
  if (num >= 1_000_000) return `${currency} ${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${currency} ${(num / 1_000).toFixed(0)}K`
  return `${currency} ${num.toLocaleString()}`
}

const STATUS_COLORS = {
  sale:   { bg: 'var(--gold)', color: 'var(--black)', label: 'For Sale' },
  rent:   { bg: '#4C9EE8', color: '#fff', label: 'For Rent' },
  sold:   { bg: '#666', color: '#fff', label: 'Sold' },
  leased: { bg: '#888', color: '#fff', label: 'Leased' },
}

export default function PropertyCard({ property, compact = false }) {
  const { isAuthenticated } = useAuth()
  const [favorited, setFavorited] = useState(property?.is_favorited || false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  if (!property) return null

  const {
    slug, title, price, currency, status,
    featured_image, property_type,
    city, country, bedrooms, bathrooms, size_sqft,
    is_featured,
  } = property

  const statusConfig = STATUS_COLORS[status] || STATUS_COLORS.sale

  const handleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.info('Sign in to save favorites')
      return
    }
    setFavoriteLoading(true)
    try {
      await propertiesAPI.toggleFavorite(slug)
      setFavorited((f) => !f)
      toast.success(favorited ? 'Removed from favorites' : 'Saved to favorites')
    } catch {
      toast.error('Could not update favorites')
    } finally {
      setFavoriteLoading(false)
    }
  }

  return (
    <Link to={`/properties/${slug}`} style={{ display: 'block' }}>
      <article className="card property-card">
        {/* Image */}
        <div className="card-image">
          <img
            src={featured_image || PLACEHOLDER}
            alt={title}
            loading="lazy"
            onError={(e) => { e.target.src = PLACEHOLDER }}
          />

          {/* Status Badge */}
          <span
            className="card-badge"
            style={{ background: statusConfig.bg, color: statusConfig.color }}
          >
            {statusConfig.label}
          </span>

          {/* Featured */}
          {is_featured && (
            <span
              style={{
                position: 'absolute',
                top: '1rem',
                right: '3.5rem',
                background: 'var(--dark)',
                color: 'var(--gold)',
                border: '1px solid var(--gold)',
                padding: '0.25rem 0.6rem',
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              ★ Featured
            </span>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            disabled={favoriteLoading}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              width: '36px',
              height: '36px',
              background: 'rgba(10,10,10,0.7)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: favorited ? 'var(--gold)' : 'var(--gray-mid)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s',
            }}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={15} fill={favorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Body */}
        <div className="card-body">
          {/* Type label */}
          <div style={{
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '0.5rem',
          }}>
            {property_type?.replace('_', ' ')}
          </div>

          <div className="card-price">{formatPrice(price, currency)}</div>
          <h3 className="card-title">{title}</h3>

          <div className="card-location flex gap-1" style={{ alignItems: 'center' }}>
            <MapPin size={12} />
            {city}{country ? `, ${country}` : ''}
          </div>

          {!compact && (
            <div className="card-meta">
              {bedrooms != null && (
                <span><BedDouble size={13} /> {bedrooms} Beds</span>
              )}
              {bathrooms != null && (
                <span><Bath size={13} /> {bathrooms} Baths</span>
              )}
              {size_sqft && (
                <span><Maximize size={13} /> {Number(size_sqft).toLocaleString()} ft²</span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}