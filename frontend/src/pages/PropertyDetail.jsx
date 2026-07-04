import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  BedDouble, Bath, Maximize, MapPin, Calendar,
  Share2, Heart, MessageSquare, ChevronLeft, CheckCircle,
} from 'lucide-react'
import { propertiesAPI } from '../utils/api.js'
import QuoteForm from '../components/quote/QuoteForm.jsx'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80'

export default function PropertyDetail() {
  const { slug } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [quoteOpen, setQuoteOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    propertiesAPI.detail(slug)
      .then(({ data }) => { setProperty(data); propertiesAPI.trackView(slug).catch(() => {}) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="loader-wrap" style={{ minHeight: '100vh', paddingTop: 'calc(var(--nav-h) + var(--topbar-h) + var(--spacing-8))' }}>
      <div className="loader-ring" />
    </div>
  )

  if (!property) return (
    <div style={{ 
      paddingTop: 'calc(var(--nav-h) + var(--topbar-h) + var(--spacing-12))', 
      textAlign: 'center' 
    }}>
      <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Property Not Found</h2>
      <Link to="/properties" className="btn btn-outline" style={{ display: 'inline-flex' }}>
        <ChevronLeft size={16} /> Back to Listings
      </Link>
    </div>
  )

  const {
    title, price, currency = 'KES', status, description,
    property_type, city, country, exact_location,
    bedrooms, bathrooms, size_sqft, size_acres,
    amenities = [], featured_image, gallery_images = [],
    seo_title, seo_description, agent,
    created_at, is_featured,
  } = property

  const allImages = [featured_image, ...gallery_images.map(g => g?.image || g)].filter(Boolean)

  const formatPrice = (p) => {
    if (!p) return 'Price on request'
    const n = parseFloat(p)
    return `${currency} ${n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + 'M' : n.toLocaleString()}`
  }

  return (
    <>
      <Helmet>
        <title>{seo_title || `${title} | LuxuryHome`}</title>
        <meta name="description" content={seo_description || description?.substring(0, 160)} />
        <meta property="og:title" content={seo_title || title} />
        <meta property="og:image" content={featured_image || PLACEHOLDER} />
        <link rel="canonical" href={`https://luxuryhome.com/properties/${slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          "name": title,
          "description": description,
          "url": `https://luxuryhome.com/properties/${slug}`,
          "image": featured_image,
          "address": { "@type": "PostalAddress", "addressLocality": city, "addressCountry": country },
        })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <div className="breadcrumb-section" style={{ 
        paddingTop: 'calc(var(--nav-h) + var(--topbar-h) + var(--spacing-4))',
        paddingBottom: 'var(--spacing-6)',
        background: 'var(--text-primary)',
      }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-2)', 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-muted)', 
            alignItems: 'center', 
            flexWrap: 'wrap' 
          }}>
            <Link to="/" style={{ color: 'var(--text-muted)', transition: 'color var(--duration-fast) var(--ease-smooth)' }}>
              Home
            </Link>
            <span>/</span>
            <Link to="/properties" style={{ color: 'var(--text-muted)', transition: 'color var(--duration-fast) var(--ease-smooth)' }}>
              Properties
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--primary-red)' }}>{title}</span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <section className="gallery-section" style={{ 
        background: 'var(--text-primary)',
        paddingBottom: 'var(--spacing-8)',
      }}>
        <div className="container">
          <div className="gallery-grid" style={{
            display: 'grid',
            gridTemplateColumns: allImages.length > 1 ? '2fr 1fr' : '1fr',
            gap: 'var(--spacing-1)',
            maxHeight: '520px',
            overflow: 'hidden',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
          }}>
            <div className="gallery-main" style={{ position: 'relative', overflow: 'hidden' }}>
              <img
                src={allImages[activeImage] || PLACEHOLDER}
                alt={title}
                className="gallery-image"
                style={{ 
                  width: '100%', 
                  height: '520px', 
                  objectFit: 'cover',
                  transition: 'transform var(--duration-slow) var(--ease-smooth)',
                }}
              />
              {is_featured && (
                <span className="badge badge-primary" style={{
                  position: 'absolute',
                  top: 'var(--spacing-5)',
                  left: 'var(--spacing-5)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.12em',
                }}>
                  ★ FEATURED
                </span>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="gallery-thumbs" style={{ 
                display: 'grid', 
                gridTemplateRows: '1fr 1fr', 
                gap: 'var(--spacing-1)', 
                maxHeight: '520px' 
              }}>
                {allImages.slice(1, 3).map((img, i) => (
                  <div
                    key={i}
                    className="gallery-thumb"
                    style={{ 
                      overflow: 'hidden', 
                      cursor: 'pointer', 
                      position: 'relative' 
                    }}
                    onClick={() => setActiveImage(i + 1)}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${i + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '258px', 
                        objectFit: 'cover', 
                        transition: 'transform var(--duration-slow) var(--ease-smooth)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    {i === 1 && allImages.length > 3 && (
                      <div className="gallery-more-overlay" style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-2xl)',
                        color: 'var(--white)',
                        fontWeight: 600,
                      }}>
                        +{allImages.length - 3} more
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ 
        padding: 'var(--spacing-12) clamp(var(--spacing-4), 4vw, var(--spacing-10))' 
      }}>
        <div className="detail-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 360px', 
          gap: 'var(--spacing-12)', 
          alignItems: 'start' 
        }}>

          {/* Left: Details */}
          <div className="detail-content">
            {/* Title & Price */}
            <div className="detail-header" style={{ marginBottom: 'var(--spacing-8)' }}>
              <div style={{ 
                display: 'flex', 
                gap: 'var(--spacing-3)', 
                marginBottom: 'var(--spacing-4)', 
                flexWrap: 'wrap' 
              }}>
                <span className="badge badge-primary">
                  {status === 'sale' ? 'For Sale' : 'For Rent'}
                </span>
                <span className="badge badge-secondary">
                  {property_type?.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <h1 className="detail-title" style={{ 
                fontFamily: 'var(--font-family)',
                fontSize: 'clamp(1.8rem, 4vw, var(--text-4xl))',
                marginBottom: 'var(--spacing-3)',
                fontWeight: 700,
              }}>
                {title}
              </h1>
              <div className="detail-location" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--spacing-2)', 
                color: 'var(--text-secondary)', 
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--spacing-5)',
              }}>
                <MapPin size={14} color="var(--primary-red)" />
                {exact_location || `${city}, ${country}`}
              </div>
              <div className="detail-price" style={{ 
                fontFamily: 'var(--font-family)',
                fontSize: 'clamp(2rem, 4vw, var(--text-4xl))',
                color: 'var(--primary-red)',
                fontWeight: 700,
              }}>
                {formatPrice(price)}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="detail-stats" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '1px',
              marginBottom: 'var(--spacing-10)',
              background: 'var(--border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}>
              {[
                { Icon: BedDouble, value: bedrooms ?? '—', label: 'Bedrooms' },
                { Icon: Bath, value: bathrooms ?? '—', label: 'Bathrooms' },
                { Icon: Maximize, value: size_sqft ? `${Number(size_sqft).toLocaleString()} ft²` : size_acres ? `${size_acres} acres` : '—', label: 'Size' },
                { Icon: Calendar, value: created_at ? new Date(created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '—', label: 'Listed' },
              ].map(({ Icon, value, label }) => (
                <div key={label} className="stat-item" style={{ 
                  background: 'var(--white)',
                  padding: 'var(--spacing-5)',
                  textAlign: 'center',
                  transition: 'background var(--duration-fast) var(--ease-smooth)',
                }}>
                  <Icon size={18} color="var(--primary-red)" style={{ margin: '0 auto var(--spacing-2)' }} />
                  <div className="stat-value" style={{ 
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-xl)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--spacing-1)',
                  }}>
                    {value}
                  </div>
                  <div className="stat-label" style={{ 
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="detail-description" style={{ marginBottom: 'var(--spacing-10)' }}>
              <h3 className="detail-section-title" style={{ 
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 600,
                marginBottom: 'var(--spacing-4)',
              }}>
                About This Property
              </h3>
              <div className="gold-divider" />
              <p className="detail-description-text" style={{ 
                color: 'var(--text-secondary)',
                lineHeight: 1.9,
                whiteSpace: 'pre-line',
                fontSize: 'var(--text-base)',
                marginTop: 'var(--spacing-4)',
              }}>
                {description || 'A truly exceptional luxury property available exclusively through LuxuryHome. Contact us for full details and a private viewing.'}
              </p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="detail-amenities" style={{ marginBottom: 'var(--spacing-10)' }}>
                <h3 className="detail-section-title" style={{ 
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 600,
                  marginBottom: 'var(--spacing-4)',
                }}>
                  Amenities & Features
                </h3>
                <div className="gold-divider" />
                <div className="amenities-grid" style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 'var(--spacing-2)',
                  marginTop: 'var(--spacing-4)',
                }}>
                  {amenities.map((a) => (
                    <div
                      key={a.id ?? a.name ?? a}
                      className="amenity-item"
                      style={{ 
                        display: 'flex',
                        gap: 'var(--spacing-2)',
                        alignItems: 'center',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        padding: 'var(--spacing-2) var(--spacing-3)',
                        background: 'var(--gray-50)',
                        borderRadius: 'var(--radius-base)',
                        transition: 'all var(--duration-fast) var(--ease-smooth)',
                      }}
                    >
                      <CheckCircle size={14} color="var(--primary-red)" />
                      {typeof a === 'object' ? a.name : a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agent Info */}
            {agent && (
              <div className="detail-agent" style={{
                padding: 'var(--spacing-6)',
                background: 'var(--gray-50)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                gap: 'var(--spacing-5)',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
                <img
                  src={agent.avatar || `https://i.pravatar.cc/60?img=${agent.id}`}
                  alt={agent.full_name || agent.name}
                  style={{ 
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-full)',
                    objectFit: 'cover',
                    border: '2px solid var(--primary-red)',
                  }}
                />
                <div className="agent-info">
                  <div className="agent-label" style={{ 
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    color: 'var(--primary-red)',
                    marginBottom: 'var(--spacing-1)',
                    textTransform: 'uppercase',
                  }}>
                    LISTED BY
                  </div>
                  <div className="agent-name" style={{ 
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}>
                    {agent.full_name || agent.name}
                  </div>
                  <div className="agent-email" style={{ 
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                  }}>
                    {agent.email}
                  </div>
                </div>
                <div className="agent-actions" style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-3)' }}>
                  <a href={`tel:${agent.phone}`} className="btn btn-ghost btn-sm">
                    Call
                  </a>
                  <a 
                    href={`https://wa.me/${agent.phone}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-outline btn-sm"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right: Quote + Actions */}
          <aside className="detail-sidebar" style={{ position: 'sticky', top: 'calc(var(--nav-h) + var(--topbar-h) + var(--spacing-4))' }}>
            {/* Action Buttons */}
            <div className="action-buttons" style={{ 
              display: 'flex',
              gap: 'var(--spacing-2)',
              marginBottom: 'var(--spacing-6)',
            }}>
              <button
                className="action-btn"
                style={{
                  flex: 1,
                  background: 'var(--gray-50)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  padding: 'var(--spacing-2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-2)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-base)',
                  transition: 'all var(--duration-fast) var(--ease-smooth)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-red)'
                  e.currentTarget.style.color = 'var(--primary-red)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }}
              >
                <Heart size={14} /> Save
              </button>
              <button
                className="action-btn"
                style={{
                  flex: 1,
                  background: 'var(--gray-50)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  padding: 'var(--spacing-2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-2)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-base)',
                  transition: 'all var(--duration-fast) var(--ease-smooth)',
                }}
                onClick={() => navigator.share?.({ title, url: window.location.href })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-red)'
                  e.currentTarget.style.color = 'var(--primary-red)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }}
              >
                <Share2 size={14} /> Share
              </button>
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
                marginBottom: 'var(--spacing-4)' 
              }}>
                <MessageSquare size={16} color="var(--primary-red)" />
                <h3 style={{ 
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                }}>
                  Request Quotation
                </h3>
              </div>
              <QuoteForm property={property} />
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
          .detail-sidebar {
            position: static !important;
          }
          .gallery-grid {
            max-height: none !important;
          }
          .gallery-image {
            height: 400px !important;
          }
          .gallery-thumbs img {
            height: 200px !important;
          }
        }

        @media (max-width: 599px) {
          .gallery-grid {
            grid-template-columns: 1fr !important;
            gap: var(--spacing-2) !important;
          }
          .gallery-image {
            height: 300px !important;
          }
          .gallery-thumbs {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            grid-template-rows: 1fr !important;
            max-height: none !important;
          }
          .gallery-thumbs img {
            height: 150px !important;
          }
          .detail-stats {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .detail-agent {
            flex-direction: column !important;
            text-align: center !important;
          }
          .agent-actions {
            margin-left: 0 !important;
          }
          .breadcrumb-section {
            padding-top: calc(var(--nav-h) + var(--spacing-4)) !important;
          }
        }

        @media (max-width: 374px) {
          .detail-stats {
            grid-template-columns: 1fr !important;
          }
          .action-buttons {
            flex-direction: column !important;
          }
        }

        /* Hover states for stat items */
        .stat-item:hover {
          background: var(--gray-50) !important;
        }
        
        .amenity-item:hover {
          background: var(--red-tint) !important;
          transform: translateX(4px);
        }
      `}</style>
    </>
  )
}