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
  sale:   { bg: 'var(--primary-red)', color: 'var(--white)', label: 'For Sale' },
  rent:   { bg: '#2563EB', color: 'var(--white)', label: 'For Rent' },
  sold:   { bg: 'var(--text-muted)', color: 'var(--white)', label: 'Sold' },
  leased: { bg: 'var(--gray-600)', color: 'var(--white)', label: 'Leased' },
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
    <Link to={`/properties/${slug}`} className="property-card-link" style={{ display: 'block' }}>
      <article className="property-card">
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
            className="badge badge-primary"
            style={{ 
              background: statusConfig.bg, 
              color: statusConfig.color,
              border: 'none',
            }}
          >
            {statusConfig.label}
          </span>

          {/* Featured Badge */}
          {is_featured && (
            <span
              className="badge"
              style={{
                position: 'absolute',
                top: 'var(--spacing-3)',
                right: 'calc(3.5rem + var(--spacing-2))',
                background: 'var(--text-primary)',
                color: 'var(--primary-red)',
                border: '1px solid var(--primary-red)',
                padding: 'var(--spacing-1) var(--spacing-2)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              ★ Featured
            </span>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            disabled={favoriteLoading}
            className="favorite-btn"
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            style={{
              position: 'absolute',
              top: 'var(--spacing-3)',
              right: 'var(--spacing-3)',
              width: '36px',
              height: '36px',
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: favorited ? 'var(--primary-red)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: 'var(--radius-full)',
              transition: 'all var(--duration-fast) var(--ease-smooth)',
              padding: 0,
              zIndex: 'var(--z-above)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <Heart 
              size={16} 
              fill={favorited ? 'currentColor' : 'none'} 
              style={{ transition: 'all var(--duration-fast) var(--ease-smooth)' }}
            />
          </button>
        </div>

        {/* Body */}
        <div className="card-body">
          {/* Property Type */}
          <div className="property-type" style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--primary-red)',
            marginBottom: 'var(--spacing-2)',
          }}>
            {property_type?.replace('_', ' ')}
          </div>

          {/* Price */}
          <div className="card-price">{formatPrice(price, currency)}</div>
          
          {/* Title */}
          <h3 className="card-title">{title}</h3>

          {/* Location */}
          <div className="card-location flex" style={{ 
            alignItems: 'center', 
            gap: 'var(--spacing-1)',
            marginBottom: 'var(--spacing-3)',
          }}>
            <MapPin size={14} className="location-icon" style={{ color: 'var(--text-muted)' }} />
            <span>{city}{country ? `, ${country}` : ''}</span>
          </div>

          {/* Meta Information */}
          {!compact && (
            <div className="card-meta">
              {bedrooms != null && (
                <span className="meta-item">
                  <BedDouble size={14} className="meta-icon" />
                  {bedrooms} Beds
                </span>
              )}
              {bathrooms != null && (
                <span className="meta-item">
                  <Bath size={14} className="meta-icon" />
                  {bathrooms} Baths
                </span>
              )}
              {size_sqft && (
                <span className="meta-item">
                  <Maximize size={14} className="meta-icon" />
                  {Number(size_sqft).toLocaleString()} ft²
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}