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
    <div className="loader-wrap" style={{ minHeight: '100vh', paddingTop: '6rem' }}>
      <div className="loader-ring" />
    </div>
  )

  if (!property) return (
    <div style={{ paddingTop: '8rem', textAlign: 'center' }}>
      <h2>Property Not Found</h2>
      <Link to="/properties" className="btn btn-outline" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
        ← Back to Listings
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
      <div style={{ paddingTop: '6rem', background: 'var(--dark)', paddingBottom: '1.5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--gray-muted)', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'var(--gray-muted)' }}>Home</Link>
            <span>/</span>
            <Link to="/properties" style={{ color: 'var(--gray-muted)' }}>Properties</Link>
            <span>/</span>
            <span style={{ color: 'var(--gold)' }}>{title}</span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div style={{ background: 'var(--dark)', paddingBottom: '0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: allImages.length > 1 ? '2fr 1fr' : '1fr',
            gap: '4px',
            maxHeight: '520px',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <img
                src={allImages[activeImage] || PLACEHOLDER}
                alt={title}
                style={{ width: '100%', height: '520px', objectFit: 'cover' }}
              />
              {is_featured && (
                <span style={{
                  position: 'absolute', top: '1.25rem', left: '1.25rem',
                  background: 'var(--gold)', color: 'var(--black)',
                  padding: '0.3rem 0.8rem', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em',
                }}>
                  ★ FEATURED
                </span>
              )}
            </div>
            {allImages.length > 1 && (
              <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '4px', maxHeight: '520px' }}>
                {allImages.slice(1, 3).map((img, i) => (
                  <div
                    key={i}
                    style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                    onClick={() => setActiveImage(i + 1)}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${i + 1}`}
                      style={{ width: '100%', height: '258px', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.04)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    {i === 1 && allImages.length > 3 && (
                      <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--warm-white)',
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
      </div>

      {/* Main Content */}
      <div className="container" style={{ padding: '3rem clamp(1rem,4vw,2.5rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' }}>

          {/* Left: Details */}
          <div>
            {/* Title & Price */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="badge badge-gold">{status === 'sale' ? 'For Sale' : 'For Rent'}</span>
                <span className="badge badge-dark">{property_type?.replace('_', ' ').toUpperCase()}</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', marginBottom: '0.75rem' }}>
                {title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--gray-mid)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                <MapPin size={14} color="var(--gold)" />
                {exact_location || `${city}, ${country}`}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--gold)', fontWeight: 400 }}>
                {formatPrice(price)}
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '1px',
              marginBottom: '2.5rem',
              background: 'rgba(255,255,255,0.05)',
            }}>
              {[
                { Icon: BedDouble, value: bedrooms ?? '—', label: 'Bedrooms' },
                { Icon: Bath,      value: bathrooms ?? '—', label: 'Bathrooms' },
                { Icon: Maximize,  value: size_sqft ? `${Number(size_sqft).toLocaleString()} ft²` : size_acres ? `${size_acres} acres` : '—', label: 'Size' },
                { Icon: Calendar,  value: created_at ? new Date(created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '—', label: 'Listed' },
              ].map(({ Icon, value, label }) => (
                <div key={label} style={{ background: 'var(--dark-2)', padding: '1.25rem', textAlign: 'center' }}>
                  <Icon size={18} color="var(--gold)" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--warm-white)', marginBottom: '0.2rem' }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray-muted)' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '1rem' }}>
                About This Property
              </h3>
              <div className="gold-divider" />
              <p style={{ color: 'var(--gray-mid)', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                {description || 'A truly exceptional luxury property available exclusively through LuxuryHome. Contact us for full details and a private viewing.'}
              </p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '1rem' }}>
                  Amenities & Features
                </h3>
                <div className="gold-divider" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.6rem', marginTop: '1rem' }}>
                  {amenities.map((a) => (
                    <div
                      key={a.id ?? a.name ?? a}
                      style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--gray-mid)' }}
                    >
                      <CheckCircle size={14} color="var(--gold)" />
                      {typeof a === 'object' ? a.name : a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agent Info */}
            {agent && (
              <div style={{
                padding: '1.5rem',
                background: 'var(--dark-2)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
                <img
                  src={agent.avatar || `https://i.pravatar.cc/60?img=${agent.id}`}
                  alt={agent.full_name || agent.name}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold)' }}
                />
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.25rem' }}>
                    LISTED BY
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--warm-white)' }}>
                    {agent.full_name || agent.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-muted)' }}>
                    {agent.email}
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
                  <a href={`tel:${agent.phone}`} className="btn btn-ghost btn-sm">Call</a>
                  <a href={`https://wa.me/${agent.phone}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                    WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right: Quote + Actions */}
          <div style={{ position: 'sticky', top: '6rem' }}>
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button
                style={{
                  flex: 1, background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--gray-mid)', padding: '0.6rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem',
                }}
              >
                <Heart size={14} /> Save
              </button>
              <button
                style={{
                  flex: 1, background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--gray-mid)', padding: '0.6rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem',
                }}
                onClick={() => navigator.share?.({ title, url: window.location.href })}
              >
                <Share2 size={14} /> Share
              </button>
            </div>

            {/* Quote Form Card */}
            <div style={{
              background: 'var(--dark-2)',
              border: '1px solid rgba(201,168,76,0.2)',
              padding: '2rem',
            }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <MessageSquare size={16} color="var(--gold)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>
                  Request Quotation
                </h3>
              </div>
              <QuoteForm property={property} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          [style*="grid-template-columns: 1fr 360px"] { grid-template-columns: 1fr !important; }
          [style*="position: sticky"] { position: static !important; }
        }
      `}</style>
    </>
  )
}