import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Star, MapPin, Wifi, Car, Waves, Utensils, MessageSquare, ChevronLeft, Calendar, Users, Coffee } from 'lucide-react'
import { hotelsAPI } from '../utils/api.js'
import QuoteForm from '../components/quote/QuoteForm.jsx'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80'

const AMENITY_ICONS = {
  wifi: Wifi, 
  parking: Car, 
  pool: Waves, 
  restaurant: Utensils,
  spa: Coffee,
  gym: Coffee,
  '24-hour': Calendar,
  '24 hour': Calendar,
}

function StarRating({ rating = 0, size = 16, showLabel = false }) {
  return (
    <div className="star-rating" style={{ 
      display: 'flex', 
      gap: '2px', 
      alignItems: 'center',
    }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star 
          key={s} 
          size={size} 
          fill={s <= rating ? 'var(--primary-red)' : 'none'} 
          color="var(--primary-red)"
          style={{ 
            transition: 'all var(--duration-fast) var(--ease-smooth)',
          }}
        />
      ))}
      {showLabel && (
        <span style={{ 
          fontSize: 'var(--text-sm)', 
          color: 'var(--text-secondary)',
          marginLeft: 'var(--spacing-2)',
          fontWeight: 500,
        }}>
          {rating}.0 / 5.0
        </span>
      )}
    </div>
  )
}

export default function HotelDetail() {
  const { slug } = useParams()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    hotelsAPI.detail(slug)
      .then(({ data }) => setHotel(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="loader-wrap" style={{ 
      minHeight: '100vh', 
      paddingTop: 'calc(var(--nav-h) + var(--topbar-h) + var(--spacing-8))' 
    }}>
      <div className="loader-ring" />
    </div>
  )

  if (!hotel) return (
    <div style={{ 
      paddingTop: 'calc(var(--nav-h) + var(--topbar-h) + var(--spacing-12))', 
      textAlign: 'center' 
    }}>
      <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Hotel Not Found</h2>
      <Link to="/hotels" className="btn btn-outline" style={{ display: 'inline-flex' }}>
        <ChevronLeft size={16} /> Back to Hotels
      </Link>
    </div>
  )

  const {
    name, description, star_rating, city, country,
    price_per_night, currency = 'KES',
    featured_image, gallery_images = [], amenities = [],
    total_rooms, seo_title, seo_description,
  } = hotel

  const allImages = [featured_image, ...gallery_images.map(g => g?.image || g)].filter(Boolean)

  return (
    <>
      <Helmet>
        <title>{seo_title || `${name} | LuxuryHome Hotels`}</title>
        <meta name="description" content={seo_description || description?.substring(0, 160)} />
        <meta property="og:title" content={seo_title || name} />
        <meta property="og:image" content={featured_image || PLACEHOLDER} />
        <link rel="canonical" href={`https://luxuryhome.com/hotels/${slug}`} />
      </Helmet>

      {/* Hero Section */}
      <section className="hotel-hero" style={{
        paddingTop: 'calc(var(--nav-h) + var(--topbar-h))',
        position: 'relative',
        height: '60vh',
        minHeight: '400px',
        overflow: 'hidden',
        background: 'var(--text-primary)',
      }}>
        <img
          src={featured_image || PLACEHOLDER}
          alt={name}
          className="hotel-hero-image"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            opacity: 0.75,
          }}
          onError={(e) => { e.target.src = PLACEHOLDER }}
        />
        <div className="hotel-hero-overlay" style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 50%, rgba(10,10,10,0.3) 100%)',
        }} />
        
        <div className="container" style={{
          position: 'absolute',
          bottom: 'var(--spacing-10)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
        }}>
          <div className="hotel-hero-content">
            <div className="hotel-hero-rating" style={{ marginBottom: 'var(--spacing-3)' }}>
              <StarRating rating={star_rating || 5} size={20} />
            </div>
            <h1 className="hotel-hero-title" style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'clamp(2rem, 5vw, var(--text-5xl))',
              color: 'var(--white)',
              marginBottom: 'var(--spacing-2)',
              fontWeight: 700,
              maxWidth: '80%',
            }}>
              {name}
            </h1>
            <div className="hotel-hero-location" style={{
              display: 'flex',
              gap: 'var(--spacing-2)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: 'var(--text-base)',
              alignItems: 'center',
            }}>
              <MapPin size={16} color="var(--primary-red)" />
              <span>{city}, {country}</span>
              {total_rooms && (
                <>
                  <span className="hero-divider" style={{
                    width: '1px',
                    height: '20px',
                    background: 'rgba(255,255,255,0.2)',
                    margin: '0 var(--spacing-2)',
                  }} />
                  <span>{total_rooms} rooms</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container" style={{ 
        padding: 'var(--spacing-12) clamp(var(--spacing-4), 4vw, var(--spacing-10))' 
      }}>
        <div className="hotel-detail-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 360px', 
          gap: 'var(--spacing-12)', 
          alignItems: 'start' 
        }}>

          {/* Left Column */}
          <div className="hotel-detail-content">
            {/* Description */}
            <div className="hotel-description" style={{ marginBottom: 'var(--spacing-10)' }}>
              <h2 className="hotel-section-title" style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 600,
                marginBottom: 'var(--spacing-4)',
              }}>
                About the Property
              </h2>
              <div className="gold-divider" />
              <p className="hotel-description-text" style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.9,
                fontSize: 'var(--text-base)',
                marginTop: 'var(--spacing-4)',
              }}>
                {description || 'An exceptional luxury resort offering world-class hospitality and unmatched amenities. Contact us for room availability and special rates.'}
              </p>
            </div>

            {/* Gallery */}
            {allImages.length > 1 && (
              <div className="hotel-gallery" style={{ marginBottom: 'var(--spacing-10)' }}>
                <h3 className="hotel-section-title" style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 600,
                  marginBottom: 'var(--spacing-4)',
                }}>
                  Gallery
                </h3>
                <div className="gold-divider" />
                <div className="gallery-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: 'var(--spacing-2)',
                  marginTop: 'var(--spacing-4)',
                }}>
                  {allImages.slice(1, 7).map((img, i) => (
                    <img
                      key={i}
                      src={img || PLACEHOLDER}
                      alt={`${name} gallery ${i + 1}`}
                      className="gallery-thumbnail"
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-base)',
                        transition: 'transform var(--duration-slow) var(--ease-smooth)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      onError={(e) => { e.target.src = PLACEHOLDER }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="hotel-amenities-section">
                <h3 className="hotel-section-title" style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 600,
                  marginBottom: 'var(--spacing-4)',
                }}>
                  Amenities & Services
                </h3>
                <div className="gold-divider" />
                <div className="amenities-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: 'var(--spacing-2)',
                  marginTop: 'var(--spacing-4)',
                }}>
                  {amenities.map((a) => {
                    const amenityName = typeof a === 'object' ? a.name : a
                    const Icon = AMENITY_ICONS[amenityName?.toLowerCase()] || Wifi
                    return (
                      <div
                        key={a.id ?? amenityName}
                        className="amenity-item"
                        style={{
                          display: 'flex',
                          gap: 'var(--spacing-2)',
                          alignItems: 'center',
                          padding: 'var(--spacing-3) var(--spacing-4)',
                          background: 'var(--gray-50)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-base)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-secondary)',
                          transition: 'all var(--duration-fast) var(--ease-smooth)',
                        }}
                      >
                        <Icon size={16} color="var(--primary-red)" style={{ flexShrink: 0 }} />
                        <span>{amenityName}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <aside className="hotel-detail-sidebar" style={{
            position: 'sticky',
            top: 'calc(var(--nav-h) + var(--topbar-h) + var(--spacing-4))',
          }}>
            {/* Pricing Card */}
            <div className="pricing-card" style={{
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-6)',
              marginBottom: 'var(--spacing-6)',
              boxShadow: 'var(--shadow-card)',
            }}>
              <div className="price-display" style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 700,
                color: 'var(--primary-red)',
                marginBottom: 'var(--spacing-1)',
              }}>
                {currency} {Number(price_per_night).toLocaleString()}
              </div>
              <div className="price-period" style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                marginBottom: 'var(--spacing-4)',
                letterSpacing: '0.05em',
              }}>
                per night · {total_rooms || 0} rooms available
              </div>
              
              <div className="hotel-rating" style={{ marginBottom: 'var(--spacing-4)' }}>
                <StarRating rating={star_rating || 5} size={14} />
              </div>
              
              <button className="btn btn-primary w-full" style={{ 
                marginBottom: 'var(--spacing-3)',
                justifyContent: 'center',
              }}>
                <Calendar size={16} /> Check Availability
              </button>
              
              <Link
                to="/contact"
                className="btn btn-outline w-full"
                style={{ justifyContent: 'center', display: 'flex' }}
              >
                <Users size={16} /> Contact Hotel
              </Link>
            </div>

            {/* Quote Form Card */}
            <div className="quote-card" style={{
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-6)',
              boxShadow: 'var(--shadow-card)',
            }}>
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-2)',
                alignItems: 'center',
                marginBottom: 'var(--spacing-4)',
              }}>
                <MessageSquare size={16} color="var(--primary-red)" />
                <h3 style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                }}>
                  Enquire Now
                </h3>
              </div>
              <QuoteForm property={{ ...hotel, title: name }} />
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .hotel-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .hotel-detail-sidebar {
            position: static !important;
          }
          .hotel-hero {
            height: 50vh !important;
            min-height: 350px !important;
          }
        }

        @media (max-width: 767px) {
          .hotel-hero {
            height: 40vh !important;
            min-height: 300px !important;
          }
          .hotel-hero-title {
            max-width: 100% !important;
            font-size: var(--text-2xl) !important;
          }
          .hotel-hero-location {
            font-size: var(--text-sm) !important;
            flex-wrap: wrap !important;
          }
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .amenities-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .container {
            padding: var(--spacing-6) var(--spacing-4) !important;
          }
        }

        @media (max-width: 599px) {
          .hotel-hero {
            height: 35vh !important;
            min-height: 250px !important;
          }
          .hotel-hero-title {
            font-size: var(--text-xl) !important;
          }
          .amenities-grid {
            grid-template-columns: 1fr !important;
          }
          .gallery-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .gallery-thumbnail {
            height: 100px !important;
          }
          .pricing-card {
            padding: var(--spacing-4) !important;
          }
          .quote-card {
            padding: var(--spacing-4) !important;
          }
        }

        /* Hover Effects */
        .amenity-item:hover {
          background: var(--red-tint) !important;
          border-color: var(--primary-red) !important;
          transform: translateX(4px);
        }

        .gallery-thumbnail:hover {
          box-shadow: var(--shadow-md);
        }

        .hotel-hero-image {
          transition: transform var(--duration-slow) var(--ease-smooth);
        }

        .hotel-hero:hover .hotel-hero-image {
          transform: scale(1.02);
        }

        /* Star rating animation */
        .star-rating svg {
          transition: all var(--duration-fast) var(--ease-smooth);
        }

        .star-rating:hover svg {
          transform: scale(1.1);
        }

        /* Pricing card hover */
        .pricing-card:hover {
          box-shadow: var(--shadow-lg) !important;
          transform: translateY(-2px);
          transition: all var(--duration-normal) var(--ease-smooth);
        }

        /* Quote card hover */
        .quote-card:hover {
          box-shadow: var(--shadow-lg) !important;
          transition: all var(--duration-normal) var(--ease-smooth);
        }
      `}</style>
    </>
  )
}