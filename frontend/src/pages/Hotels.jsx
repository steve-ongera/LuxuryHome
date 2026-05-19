import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MapPin, Wifi, Car, Waves, Utensils } from 'lucide-react'
import { hotelsAPI } from '../utils/api.js'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80'

const AMENITY_ICONS = {
  wifi: Wifi, parking: Car, pool: Waves, restaurant: Utensils,
}

function StarRating({ rating = 0 }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={13} fill={s <= rating ? 'var(--gold)' : 'none'} color="var(--gold)" />
      ))}
    </div>
  )
}

function HotelCard({ hotel }) {
  const { slug, name, city, country, star_rating, price_per_night, currency = 'KES',
    featured_image, amenities = [], total_rooms } = hotel

  return (
    <Link to={`/hotels/${slug}`}>
      <article className="card property-card">
        <div className="card-image">
          <img src={featured_image || PLACEHOLDER} alt={name} loading="lazy"
            onError={(e) => { e.target.src = PLACEHOLDER }} />
          <span className="card-badge">Hotel & Resort</span>
          <span style={{
            position: 'absolute', top: '1rem', right: '0.75rem',
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            padding: '0.25rem 0.6rem', display: 'flex', gap: '4px',
          }}>
            <StarRating rating={star_rating} />
          </span>
        </div>
        <div className="card-body">
          <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>
            {star_rating}-Star Resort
          </div>
          <h3 className="card-title">{name}</h3>
          <div className="card-location flex gap-1" style={{ alignItems: 'center', marginBottom: '0.75rem' }}>
            <MapPin size={12} /> {city}{country ? `, ${country}` : ''}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {amenities.slice(0, 4).map((a) => {
              const amenityName = typeof a === 'object' ? a.name : a
              const Icon = AMENITY_ICONS[amenityName?.toLowerCase()] || Wifi
              return (
                <span
                  key={a.id ?? amenityName}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--gray-muted)', background: 'var(--dark-3)', padding: '0.2rem 0.5rem' }}
                >
                  <Icon size={11} /> {amenityName}
                </span>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--gold)' }}>
                {currency} {Number(price_per_night).toLocaleString()}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--gray-muted)', marginLeft: '0.4rem' }}>/night</span>
            </div>
            {total_rooms && (
              <span style={{ fontSize: '0.72rem', color: 'var(--gray-muted)' }}>{total_rooms} rooms</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

const DEMO_HOTELS = [
  { id: 1, slug: 'sarova-whitesands-mombasa', name: 'Sarova Whitesands Beach Resort', city: 'Mombasa', country: 'Kenya', star_rating: 5, price_per_night: 45000, currency: 'KES', total_rooms: 340, amenities: ['Pool', 'WiFi', 'Restaurant', 'Parking'], featured_image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80' },
  { id: 2, slug: 'hemingways-nairobi', name: "Hemingways Nairobi", city: 'Karen', country: 'Kenya', star_rating: 5, price_per_night: 85000, currency: 'KES', total_rooms: 45, amenities: ['Pool', 'WiFi', 'Restaurant', 'Spa'], featured_image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80' },
  { id: 3, slug: 'lake-naivasha-resort', name: 'Lake Naivasha Sopa Resort', city: 'Naivasha', country: 'Kenya', star_rating: 4, price_per_night: 28000, currency: 'KES', total_rooms: 82, amenities: ['Pool', 'WiFi', 'Restaurant'], featured_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80' },
  { id: 4, slug: 'alfajiri-diani', name: 'Alfajiri Cliff Villa', city: 'Diani Beach', country: 'Kenya', star_rating: 5, price_per_night: 120000, currency: 'KES', total_rooms: 3, amenities: ['Pool', 'WiFi', 'Parking'], featured_image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80' },
  { id: 5, slug: 'giraffe-manor-karen', name: 'The Giraffe Manor', city: 'Karen', country: 'Kenya', star_rating: 5, price_per_night: 180000, currency: 'KES', total_rooms: 12, amenities: ['WiFi', 'Restaurant'], featured_image: 'https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=800&q=80' },
  { id: 6, slug: 'majlis-lamu', name: 'The Majlis Resort Lamu', city: 'Lamu', country: 'Kenya', star_rating: 4, price_per_night: 35000, currency: 'KES', total_rooms: 25, amenities: ['Pool', 'WiFi', 'Restaurant', 'Spa'], featured_image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80' },
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
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }),
  }

  return (
    <>
      <Helmet>
        <title>Luxury Hotels & Resorts | LuxuryHome</title>
        <meta name="description" content="Discover Kenya's finest luxury hotels and beach resorts. From Diani Beach to Karen. Book your stay or request a quotation today." />
      </Helmet>

      {/* Header */}
      <div style={{ paddingTop: '8rem', paddingBottom: '4rem', background: 'var(--dark)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="section-label">Handpicked Stays</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '0.75rem' }}>
              Luxury Hotels & Resorts
            </h1>
            <p style={{ color: 'var(--gray-mid)', maxWidth: '520px' }}>
              From intimate boutique properties to grand beachfront resorts — discover Kenya's most exceptional places to stay.
            </p>
          </motion.div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              className="form-input"
              style={{ maxWidth: '240px' }}
              placeholder="Search by city…"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-muted)', alignSelf: 'center' }}>Stars:</span>
              {[0, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setStarFilter(s)}
                  style={{
                    padding: '0.45rem 1rem', fontSize: '0.75rem',
                    background: starFilter === s ? 'var(--gold)' : 'var(--dark-3)',
                    color: starFilter === s ? 'var(--black)' : 'var(--gray-mid)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                  }}
                >
                  {s === 0 ? 'All' : `${s}★`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="section" style={{ background: 'var(--black)' }}>
        <div className="container">
          {loading ? (
            <div className="loader-wrap" style={{ minHeight: '400px' }}><div className="loader-ring" /></div>
          ) : displayHotels.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--warm-white)', marginBottom: '0.5rem' }}>No hotels found</p>
              <p style={{ color: 'var(--gray-muted)' }}>Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid-3">
              {displayHotels.map((hotel, i) => (
                <motion.div key={hotel.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <HotelCard hotel={hotel} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}