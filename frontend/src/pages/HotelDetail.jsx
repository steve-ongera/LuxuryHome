import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Star, MapPin, Wifi, Car, Waves, Utensils, MessageSquare } from 'lucide-react'
import { hotelsAPI } from '../utils/api.js'
import QuoteForm from '../components/quote/QuoteForm.jsx'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80'

const AMENITY_ICONS = {
  wifi: Wifi, parking: Car, pool: Waves, restaurant: Utensils,
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
    <div className="loader-wrap" style={{ minHeight: '100vh', paddingTop: '6rem' }}>
      <div className="loader-ring" />
    </div>
  )

  if (!hotel) return (
    <div style={{ paddingTop: '8rem', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-display)' }}>Hotel Not Found</h2>
      <Link to="/hotels" className="btn btn-outline" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
        ← Back to Hotels
      </Link>
    </div>
  )

  const {
    name, description, star_rating, city, country,
    price_per_night, currency = 'KES',
    featured_image, gallery_images = [], amenities = [],
    total_rooms, seo_title, seo_description,
  } = hotel

  return (
    <>
      <Helmet>
        <title>{seo_title || `${name} | LuxuryHome Hotels`}</title>
        <meta name="description" content={seo_description || description?.substring(0, 160)} />
      </Helmet>

      {/* Hero */}
      <div style={{ paddingTop: '5rem', position: 'relative', height: '60vh', overflow: 'hidden' }}>
        <img
          src={featured_image || PLACEHOLDER}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
          onError={(e) => { e.target.src = PLACEHOLDER }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 60%)' }} />
        <div className="container" style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
          <div style={{ display: 'flex', gap: '3px', marginBottom: '0.75rem' }}>
            {Array.from({ length: star_rating || 5 }).map((_, i) => (
              <Star key={i} size={16} fill="var(--gold)" color="var(--gold)" />
            ))}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'var(--warm-white)', marginBottom: '0.5rem' }}>
            {name}
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--gray-mid)', fontSize: '0.9rem', alignItems: 'center' }}>
            <MapPin size={14} color="var(--gold)" /> {city}, {country}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '3rem clamp(1rem,4vw,2.5rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' }}>

          {/* Left */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '1rem' }}>
              About the Property
            </h2>
            <div className="gold-divider" />
            <p style={{ color: 'var(--gray-mid)', lineHeight: 1.9, marginBottom: '2rem' }}>
              {description || 'An exceptional luxury resort offering world-class hospitality and unmatched amenities. Contact us for room availability and special rates.'}
            </p>

            {/* Gallery thumbnails */}
            {gallery_images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '4px', marginBottom: '2rem' }}>
                {gallery_images.slice(0, 6).map((img, i) => {
                  const src = typeof img === 'object' ? img.image : img
                  return (
                    <img
                      key={i}
                      src={src}
                      alt={`${name} gallery ${i + 1}`}
                      style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = PLACEHOLDER }}
                    />
                  )
                })}
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '1rem' }}>
                  Amenities
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem' }}>
                  {amenities.map((a) => {
                    const amenityName = typeof a === 'object' ? a.name : a
                    const Icon = AMENITY_ICONS[amenityName?.toLowerCase()] || Wifi
                    return (
                      <div
                        key={a.id ?? amenityName}
                        style={{
                          display: 'flex', gap: '0.5rem', alignItems: 'center',
                          padding: '0.6rem 0.9rem',
                          background: 'var(--dark-2)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          fontSize: '0.82rem', color: 'var(--gray-mid)',
                        }}
                      >
                        <Icon size={13} color="var(--gold)" /> {amenityName}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: '6rem' }}>
            {/* Pricing card */}
            <div style={{
              background: 'var(--dark-2)',
              border: '1px solid rgba(201,168,76,0.2)',
              padding: '2rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--gold)', marginBottom: '0.25rem' }}>
                {currency} {Number(price_per_night).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--gray-muted)', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
                per night · {total_rooms} rooms available
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {Array.from({ length: star_rating || 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />
                ))}
              </div>
              <button className="btn btn-gold w-full" style={{ marginBottom: '0.75rem', justifyContent: 'center' }}>
                Check Availability
              </button>
              <Link
                to="/contact"
                className="btn btn-ghost w-full"
                style={{ justifyContent: 'center', display: 'flex' }}
              >
                Contact Hotel
              </Link>
            </div>

            {/* Quote form */}
            <div style={{
              background: 'var(--dark-2)',
              border: '1px solid rgba(201,168,76,0.2)',
              padding: '2rem',
            }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <MessageSquare size={16} color="var(--gold)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Enquire Now</h3>
              </div>
              <QuoteForm property={{ ...hotel, title: name }} />
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