import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MapPin, Wifi, Car, Waves, Utensils, Clock, Coffee } from 'lucide-react'
import { hotelsAPI } from '../utils/api.js'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80'

const AMENITY_ICONS = {
  wifi: Wifi, 
  parking: Car, 
  pool: Waves, 
  restaurant: Utensils,
  spa: Coffee,
  gym: Coffee,
  '24-hour': Clock,
  '24 hour': Clock,
}

function StarRating({ rating = 0 }) {
  return (
    <div className="star-rating" style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star 
          key={s} 
          size={14} 
          fill={s <= rating ? 'var(--primary-red)' : 'none'} 
          color="var(--primary-red)" 
          style={{ 
            transition: 'all var(--duration-fast) var(--ease-smooth)',
          }}
        />
      ))}
      <span style={{ 
        fontSize: 'var(--text-xs)', 
        color: 'var(--text-muted)',
        marginLeft: 'var(--spacing-1)',
        fontWeight: 500,
      }}>
        ({rating})
      </span>
    </div>
  )
}

function HotelCard({ hotel }) {
  const { 
    slug, name, city, country, star_rating, price_per_night, 
    currency = 'KES', featured_image, amenities = [], total_rooms 
  } = hotel

  return (
    <Link to={`/hotels/${slug}`} className="hotel-card-link" style={{ display: 'block' }}>
      <article className="property-card hotel-card">
        <div className="card-image">
          <img 
            src={featured_image || PLACEHOLDER} 
            alt={name} 
            loading="lazy"
            onError={(e) => { e.target.src = PLACEHOLDER }} 
          />
          <span className="card-badge badge badge-primary">Hotel & Resort</span>
          <span className="hotel-rating-badge" style={{
            position: 'absolute',
            top: 'var(--spacing-3)',
            right: 'var(--spacing-3)',
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: 'var(--spacing-1) var(--spacing-2)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            gap: '2px',
            alignItems: 'center',
          }}>
            <StarRating rating={star_rating} />
          </span>
        </div>
        <div className="card-body">
          <div className="hotel-type" style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--primary-red)',
            marginBottom: 'var(--spacing-2)',
          }}>
            {star_rating}-Star Resort
          </div>
          <h3 className="card-title">{name}</h3>
          <div className="card-location flex" style={{ 
            alignItems: 'center', 
            gap: 'var(--spacing-1)',
            marginBottom: 'var(--spacing-3)',
          }}>
            <MapPin size={14} className="location-icon" style={{ color: 'var(--text-muted)' }} />
            <span>{city}{country ? `, ${country}` : ''}</span>
          </div>
          
          {/* Amenities */}
          <div className="hotel-amenities" style={{ 
            display: 'flex', 
            gap: 'var(--spacing-2)', 
            flexWrap: 'wrap', 
            marginBottom: 'var(--spacing-4)' 
          }}>
            {amenities.slice(0, 4).map((a) => {
              const amenityName = typeof a === 'object' ? a.name : a
              const Icon = AMENITY_ICONS[amenityName?.toLowerCase()] || Wifi
              return (
                <span
                  key={a.id ?? amenityName}
                  className="amenity-tag"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-1)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    background: 'var(--gray-50)',
                    padding: 'var(--spacing-1) var(--spacing-2)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <Icon size={12} /> {amenityName}
                </span>
              )
            })}
          </div>
          
          <div className="hotel-footer" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            paddingTop: 'var(--spacing-4)',
            borderTop: '1px solid var(--border)',
          }}>
            <div className="hotel-price">
              <span className="price-amount" style={{ 
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-xl)',
                fontWeight: 700,
                color: 'var(--primary-red)',
              }}>
                {currency} {Number(price_per_night).toLocaleString()}
              </span>
              <span className="price-period" style={{ 
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                marginLeft: 'var(--spacing-1)',
              }}>/night</span>
            </div>
            {total_rooms && (
              <span className="room-count" style={{ 
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}>
                {total_rooms} rooms
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

const DEMO_HOTELS = [
  { id: 1, slug: 'sarova-whitesands-mombasa', name: 'Sarova Whitesands Beach Resort', city: 'Mombasa', country: 'Kenya', star_rating: 5, price_per_night: 45000, currency: 'KES', total_rooms: 340, amenities: ['Pool', 'WiFi', 'Restaurant', 'Parking', 'Spa'], featured_image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80' },
  { id: 2, slug: 'hemingways-nairobi', name: "Hemingways Nairobi", city: 'Karen', country: 'Kenya', star_rating: 5, price_per_night: 85000, currency: 'KES', total_rooms: 45, amenities: ['Pool', 'WiFi', 'Restaurant', 'Spa', 'Gym'], featured_image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80' },
  { id: 3, slug: 'lake-naivasha-resort', name: 'Lake Naivasha Sopa Resort', city: 'Naivasha', country: 'Kenya', star_rating: 4, price_per_night: 28000, currency: 'KES', total_rooms: 82, amenities: ['Pool', 'WiFi', 'Restaurant', '24-hour'], featured_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80' },
  { id: 4, slug: 'alfajiri-diani', name: 'Alfajiri Cliff Villa', city: 'Diani Beach', country: 'Kenya', star_rating: 5, price_per_night: 120000, currency: 'KES', total_rooms: 3, amenities: ['Pool', 'WiFi', 'Parking', 'Restaurant'], featured_image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80' },
  { id: 5, slug: 'giraffe-manor-karen', name: 'The Giraffe Manor', city: 'Karen', country: 'Kenya', star_rating: 5, price_per_night: 180000, currency: 'KES', total_rooms: 12, amenities: ['WiFi', 'Restaurant', 'Spa'], featured_image: 'https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=800&q=80' },
  { id: 6, slug: 'majlis-lamu', name: 'The Majlis Resort Lamu', city: 'Lamu', country: 'Kenya', star_rating: 4, price_per_night: 35000, currency: 'KES', total_rooms: 25, amenities: ['Pool', 'WiFi', 'Restaurant', 'Spa', 'Gym'], featured_image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80' },
]

export default function Hotels() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [starFilter, setStarFilter] = useState(0)
  const [cityFilter, setCityFilter] = useState('')

  useEffect(() => {
    hotelsAPI.list()
      .then(({ data }) => setHotels(data?.results || data || []))
      .catch(() => setHotels(DEMO_HOTELS))
      .finally(() => setLoading(false))
  }, [])

  const displayHotels = (hotels.length > 0 ? hotels : DEMO_HOTELS).filter((h) => {
    if (starFilter > 0 && h.star_rating !== starFilter) return false
    if (cityFilter && !h.city.toLowerCase().includes(cityFilter.toLowerCase())) return false
    return true
  })

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.08, 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      } 
    }),
  }

  return (
    <>
      <Helmet>
        <title>Luxury Hotels & Resorts | LuxuryHome</title>
        <meta name="description" content="Discover Kenya's finest luxury hotels and beach resorts. From Diani Beach to Karen. Book your stay or request a quotation today." />
      </Helmet>

      {/* Header */}
      <header className="hotels-header" style={{
        paddingTop: 'calc(var(--nav-h) + var(--topbar-h) + var(--spacing-12))',
        paddingBottom: 'var(--spacing-16)',
        background: 'var(--text-primary)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <div className="section-label" style={{ color: 'var(--primary-red)' }}>
              Handpicked Stays
            </div>
            <h1 style={{ 
              fontFamily: 'var(--font-family)',
              fontSize: 'clamp(2rem, 5vw, var(--text-5xl))',
              color: 'var(--white)',
              marginBottom: 'var(--spacing-3)',
              fontWeight: 700,
            }}>
              Luxury Hotels & Resorts
            </h1>
            <p style={{ 
              color: 'rgba(255,255,255,0.7)', 
              maxWidth: '520px',
              fontSize: 'var(--text-lg)',
              lineHeight: 1.7,
            }}>
              From intimate boutique properties to grand beachfront resorts — 
              discover Kenya's most exceptional places to stay.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="hotels-filters" style={{ 
            display: 'flex', 
            gap: 'var(--spacing-4)', 
            marginTop: 'var(--spacing-10)', 
            flexWrap: 'wrap', 
            alignItems: 'center' 
          }}>
            <input
              className="form-input"
              style={{ 
                maxWidth: '240px',
                background: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'var(--white)',
              }}
              placeholder="Search by city…"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
            <div className="star-filters" style={{ 
              display: 'flex', 
              gap: 'var(--spacing-2)',
              alignItems: 'center',
            }}>
              <span style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 500,
              }}>
                Stars:
              </span>
              {[0, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setStarFilter(s)}
                  className={`badge ${starFilter === s ? 'badge-primary' : 'badge-secondary'}`}
                  style={{
                    cursor: 'pointer',
                    transition: 'all var(--duration-fast) var(--ease-smooth)',
                    fontSize: 'var(--text-sm)',
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    background: starFilter === s ? 'var(--primary-red)' : 'rgba(255,255,255,0.05)',
                    color: starFilter === s ? 'var(--white)' : 'rgba(255,255,255,0.7)',
                    border: starFilter === s ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {s === 0 ? 'All' : `${s}★`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Grid */}
      <section className="section hotels-grid-section" style={{ 
        background: 'var(--white)',
        padding: 'var(--spacing-16) 0',
      }}>
        <div className="container">
          {loading ? (
            <div className="loader-wrap" style={{ minHeight: '400px' }}>
              <div className="loader-ring" />
            </div>
          ) : displayHotels.length === 0 ? (
            <div className="empty-state" style={{ 
              textAlign: 'center', 
              padding: 'var(--spacing-20) var(--spacing-8)' 
            }}>
              <h3 style={{ 
                fontSize: 'var(--text-2xl)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-3)',
              }}>
                No hotels found
              </h3>
              <p style={{ 
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-6)',
              }}>
                Try adjusting your filters.
              </p>
              <button 
                onClick={() => {
                  setStarFilter(0)
                  setCityFilter('')
                }}
                className="btn btn-outline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="hotels-grid grid-3">
                {displayHotels.map((hotel, i) => (
                  <motion.div 
                    key={hotel.id} 
                    custom={i} 
                    variants={fadeUp} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true }}
                    className="hotel-grid-item"
                  >
                    <HotelCard hotel={hotel} />
                  </motion.div>
                ))}
              </div>
              
              {/* Results count */}
              <div className="results-count" style={{
                textAlign: 'center',
                marginTop: 'var(--spacing-8)',
                color: 'var(--text-muted)',
                fontSize: 'var(--text-sm)',
              }}>
                Showing {displayHotels.length} {displayHotels.length === 1 ? 'hotel' : 'hotels'}
              </div>
            </>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 1023px) {
          .hotels-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 767px) {
          .hotels-header {
            padding-top: calc(var(--nav-h) + var(--spacing-8)) !important;
            padding-bottom: var(--spacing-8) !important;
          }
          
          .hotels-filters {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          .hotels-filters input {
            max-width: 100% !important;
          }
          
          .star-filters {
            justify-content: center !important;
          }
          
          .hotels-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 599px) {
          .hotels-header h1 {
            font-size: var(--text-2xl) !important;
          }
          
          .hotels-header p {
            font-size: var(--text-base) !important;
          }
          
          .section {
            padding: var(--spacing-8) 0 !important;
          }
        }

        /* Hotel card hover effects */
        .hotel-card:hover .amenity-tag {
          background: var(--red-tint) !important;
          border-color: var(--primary-red) !important;
          color: var(--primary-red) !important;
        }
        
        .hotel-card .star-rating svg {
          transition: transform var(--duration-fast) var(--ease-smooth);
        }
        
        .hotel-card:hover .star-rating svg {
          transform: scale(1.1);
        }
        
        .hotel-card .price-amount {
          transition: color var(--duration-fast) var(--ease-smooth);
        }
        
        .hotel-card:hover .price-amount {
          color: var(--dark-red) !important;
        }
      `}</style>
    </>
  )
}