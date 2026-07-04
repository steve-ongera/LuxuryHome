import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, useInView } from 'framer-motion'
import { Search, ArrowRight, ChevronDown, Play, Star, Building2, Home as HomeIcon, Hotel, Landmark } from 'lucide-react'
import PropertyCard from '../components/property/PropertyCard.jsx'
import { propertiesAPI, hotelsAPI, utilsAPI } from '../utils/api.js'

// ── Animated Counter ─────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 20)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ── Property Type Filter Tabs ─────────────────────────────
const TYPES = [
  { value: '', label: 'All', icon: HomeIcon },
  { value: 'mansion', label: 'Mansions', icon: Building2 },
  { value: 'villa', label: 'Villas', icon: HomeIcon },
  { value: 'apartment', label: 'Apartments', icon: Building2 },
  { value: 'land', label: 'Land', icon: Landmark },
  { value: 'hotel', label: 'Hotels', icon: Hotel },
  { value: 'beach', label: 'Beach', icon: HomeIcon },
]

export default function Home() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('')
  const [featured, setFeatured] = useState([])
  const [trending, setTrending] = useState([])
  const [activeTab, setActiveTab] = useState('')
  const [loadingFeatured, setLoadingFeatured] = useState(true)

  useEffect(() => {
    propertiesAPI.featured()
      .then(({ data }) => setFeatured(data?.results || data || []))
      .catch(() => {})
      .finally(() => setLoadingFeatured(false))

    propertiesAPI.trending()
      .then(({ data }) => setTrending(data?.results || data || []))
      .catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (searchType) params.set('type', searchType)
    navigate(`/properties?${params.toString()}`)
  }

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <>
      <Helmet>
        <title>LuxuryHome – Premium Real Estate | Mansions, Villas & Luxury Properties</title>
        <meta name="description" content="Discover world-class luxury properties in Kenya and beyond. Mansions, villas, beachfront estates, luxury hotels and investment land. Request a free quotation today." />
        <meta property="og:title" content="LuxuryHome – Premium Real Estate" />
        <meta property="og:description" content="Discover world-class luxury properties in Kenya and beyond. Request a free quotation today." />
        <link rel="canonical" href="https://luxuryhome.com" />
      </Helmet>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <video
            className="hero-bg-video"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80"
          >
            {/* <source src="/hero-video.mp4" type="video/mp4" /> */}
          </video>
          <div className="hero-fallback" style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4,
          }} />
        </div>
        <div className="hero-overlay" />

        <div className="container hero-content">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            style={{ maxWidth: '800px' }}
          >
            <motion.div variants={fadeUp} className="hero-eyebrow">
              Est. 2024 · Kenya's Finest Properties
            </motion.div>

            <motion.h1 variants={fadeUp}>
              Where Luxury<br />
              Finds Its <em>Perfect</em><br />
              Address
            </motion.h1>

            <motion.p variants={fadeUp} className="hero-subtitle">
              Discover an exclusive collection of mansions, villas, beachfront estates,
              and investment properties curated for the world's most discerning buyers.
            </motion.p>

            {/* Search Bar */}
            <motion.form variants={fadeUp} onSubmit={handleSearch} className="hero-search">
              <div className="search-bar" style={{ maxWidth: '680px' }}>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="search-select"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    color: searchType ? 'var(--white)' : 'var(--text-muted)',
                    padding: 'var(--spacing-4) var(--spacing-5)',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                    cursor: 'pointer',
                    minWidth: '140px',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                  }}
                >
                  <option value="" style={{ background: 'var(--text-primary)' }}>Property Type</option>
                  {TYPES.slice(1).map((t) => (
                    <option key={t.value} value={t.value} style={{ background: 'var(--text-primary)' }}>
                      {t.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by city, area or property name…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1, minWidth: '180px' }}
                />

                <button
                  type="submit"
                  className="btn btn-primary search-btn"
                  style={{ borderRadius: 0, padding: '0 var(--spacing-8)', whiteSpace: 'nowrap' }}
                >
                  <Search size={16} />
                  Search
                </button>
              </div>
            </motion.form>

            <motion.div variants={fadeUp} className="hero-quick-suggestions" style={{ 
              marginTop: 'var(--spacing-6)', 
              display: 'flex', 
              gap: 'var(--spacing-3)', 
              flexWrap: 'wrap' 
            }}>
              {['Diani Beach Villa', 'Westlands Penthouse', 'Karen Mansion'].map((q) => (
                <button
                  key={q}
                  onClick={() => { setSearchQuery(q); }}
                  className="suggestion-chip"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.7)',
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--duration-fast) var(--ease-smooth)',
                    fontFamily: 'var(--font-family)',
                    borderRadius: 'var(--radius-full)',
                    backdropFilter: 'blur(4px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                    e.currentTarget.style.borderColor = 'var(--primary-red)'
                    e.currentTarget.style.color = 'var(--white)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }}
                >
                  {q}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator" style={{
          position: 'absolute',
          bottom: 'var(--spacing-10)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          animation: 'bounceDown 2s infinite',
        }}>
          <span style={{ 
            fontSize: 'var(--text-xs)', 
            letterSpacing: '0.2em', 
            color: 'rgba(255,255,255,0.5)', 
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Scroll
          </span>
          <ChevronDown size={16} color="var(--primary-red)" />
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="stats-section" style={{ background: 'var(--text-primary)' }}>
        <div className="container">
          <div className="stats-grid">
            {[
              { target: 1200, suffix: '+', label: 'Premium Properties' },
              { target: 850, suffix: '+', label: 'Happy Clients' },
              { target: 15, suffix: '+', label: 'Years Experience' },
              { target: 98, suffix: '%', label: 'Client Satisfaction' },
            ].map((s) => (
              <div key={s.label} className="stat-item">
                <div className="stat-number">
                  <Counter target={s.target} suffix={s.suffix} />
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ───────────────────────────── */}
      <section className="section featured-section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label">Handpicked for You</div>
            <div className="section-header" style={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'space-between', 
              marginBottom: 'var(--spacing-12)', 
              flexWrap: 'wrap', 
              gap: 'var(--spacing-4)' 
            }}>
              <h2 className="section-title">Featured Properties</h2>
              <Link to="/properties?featured=true" className="btn btn-outline btn-sm" style={{ 
                display: 'flex', 
                gap: 'var(--spacing-2)', 
                alignItems: 'center' 
              }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {/* Type tabs */}
            <div className="type-tabs" style={{ 
              display: 'flex', 
              gap: 'var(--spacing-2)', 
              marginBottom: 'var(--spacing-10)', 
              flexWrap: 'wrap' 
            }}>
              {TYPES.map((t) => {
                const Icon = t.icon
                return (
                  <button
                    key={t.value}
                    onClick={() => setActiveTab(t.value)}
                    className={`type-tab ${activeTab === t.value ? 'active' : ''}`}
                    style={{
                      padding: 'var(--spacing-2) var(--spacing-5)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      background: activeTab === t.value ? 'var(--primary-red)' : 'transparent',
                      color: activeTab === t.value ? 'var(--white)' : 'var(--text-secondary)',
                      border: `1px solid ${activeTab === t.value ? 'var(--primary-red)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      transition: 'all var(--duration-fast) var(--ease-smooth)',
                      fontFamily: 'var(--font-family)',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== t.value) {
                        e.currentTarget.style.borderColor = 'var(--primary-red)'
                        e.currentTarget.style.color = 'var(--text-primary)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== t.value) {
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                      }
                    }}
                  >
                    <Icon size={14} />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </motion.div>

          {loadingFeatured ? (
            <div className="loader-wrap"><div className="loader-ring" /></div>
          ) : featured.length > 0 ? (
            <motion.div
              className="grid-3"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featured
                .filter((p) => !activeTab || p.property_type === activeTab)
                .slice(0, 6)
                .map((p) => (
                  <motion.div key={p.id} variants={fadeUp}>
                    <PropertyCard property={p} />
                  </motion.div>
                ))}
            </motion.div>
          ) : (
            <motion.div className="grid-3" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {DEMO_PROPERTIES.slice(0, 6).map((p) => (
                <motion.div key={p.id} variants={fadeUp}>
                  <PropertyCard property={p} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── QUOTE CTA BANNER ──────────────────────────────── */}
      <section className="quote-banner" style={{
        background: 'linear-gradient(135deg, var(--text-primary), var(--gray-800))',
        borderTop: '1px solid rgba(217, 63, 48, 0.15)',
        borderBottom: '1px solid rgba(217, 63, 48, 0.15)',
        padding: 'var(--spacing-20) 0',
      }}>
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-label" style={{ justifyContent: 'center' }}>Free & Instant</div>
            <h2 className="banner-title" style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'clamp(2rem, 4vw, var(--text-4xl))',
              color: 'var(--white)',
              marginBottom: 'var(--spacing-4)',
              fontWeight: 700,
            }}>
              Request a Quotation — No Account Required
            </h2>
            <p className="banner-subtitle" style={{
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '500px',
              margin: '0 auto var(--spacing-10)',
              fontSize: 'var(--text-lg)',
            }}>
              Interested in a property? Get a personalised quote, negotiate prices or schedule a private viewing — completely free, no sign-up needed.
            </p>
            <div className="banner-actions" style={{ 
              display: 'flex', 
              gap: 'var(--spacing-4)', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <Link to="/properties" className="btn btn-primary btn-lg">
                Browse Properties
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'var(--white)' }}>
                Talk to an Agent
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRENDING ──────────────────────────────────────── */}
      <section className="section trending-section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-label">Hot Right Now</div>
          <div className="section-header" style={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'space-between', 
            marginBottom: 'var(--spacing-12)', 
            flexWrap: 'wrap', 
            gap: 'var(--spacing-4)' 
          }}>
            <h2 className="section-title">Trending Mansions</h2>
            <Link to="/properties?type=mansion" className="btn btn-outline btn-sm" style={{ 
              display: 'flex', 
              gap: 'var(--spacing-2)', 
              alignItems: 'center' 
            }}>
              All Mansions <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid-4">
            {(trending.length > 0 ? trending : DEMO_PROPERTIES).slice(0, 4).map((p) => (
              <PropertyCard key={p.id} property={p} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="section testimonials-section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-label" style={{ justifyContent: 'center' }}>Client Stories</div>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
            What Our Clients Say
          </h2>
          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} />
                  <div>
                    <div className="testimonial-author-name">{t.name}</div>
                    <div className="testimonial-author-role">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section className="final-cta" style={{
        padding: 'var(--spacing-24) 0',
        background: 'var(--text-primary)',
        borderTop: '1px solid rgba(217, 63, 48, 0.1)',
        textAlign: 'center',
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title" style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'clamp(2rem, 5vw, var(--text-5xl))',
              color: 'var(--white)',
              marginBottom: 'var(--spacing-4)',
              fontWeight: 700,
            }}>
              Ready to Find Your<br />
              <span className="text-gold">Dream Property?</span>
            </h2>
            <p className="cta-subtitle" style={{
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '440px',
              margin: '0 auto var(--spacing-10)',
              fontSize: 'var(--text-lg)',
            }}>
              Our team of luxury real estate specialists are ready to guide you to the perfect property.
            </p>
            <Link to="/properties" className="btn btn-primary btn-lg" style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
            }}>
              Explore Listings <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes bounceDown {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }

        @media (max-width: 767px) {
          .hero-search .search-bar {
            flex-wrap: wrap !important;
          }
          .hero-search .search-select {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.1) !important;
            padding: var(--spacing-3) var(--spacing-4) !important;
          }
          .hero-search .search-input {
            min-width: 100% !important;
            padding: var(--spacing-3) var(--spacing-4) !important;
          }
          .hero-search .search-btn {
            width: 100% !important;
            justify-content: center !important;
            border-radius: 0 !important;
          }
          .type-tabs {
            gap: var(--spacing-2) !important;
          }
          .type-tab {
            font-size: var(--text-xs) !important;
            padding: var(--spacing-1) var(--spacing-3) !important;
          }
          .section-header {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .banner-actions {
            flex-direction: column !important;
            align-items: center !important;
          }
          .banner-actions .btn {
            width: 100% !important;
            max-width: 300px !important;
          }
        }

        @media (max-width: 599px) {
          .hero h1 {
            font-size: var(--text-3xl) !important;
          }
          .hero-quick-suggestions {
            gap: var(--spacing-2) !important;
          }
          .suggestion-chip {
            font-size: var(--text-xs) !important;
            padding: var(--spacing-1) var(--spacing-3) !important;
          }
          .final-cta {
            padding: var(--spacing-16) 0 !important;
          }
        }
      `}</style>
    </>
  )
}

// ── Demo data ─────────────────────────────────────────────
const DEMO_PROPERTIES = [
  {
    id: 1, slug: 'luxury-villa-diani-beach', title: 'Beachfront Villa – Diani',
    price: '85000000', currency: 'KES', status: 'sale', property_type: 'villa',
    city: 'Diani Beach', country: 'Kenya', bedrooms: 5, bathrooms: 4, size_sqft: 8200,
    is_featured: true,
    featured_image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80',
  },
  {
    id: 2, slug: 'karen-mansion-nairobi', title: 'Grand Karen Mansion',
    price: '120000000', currency: 'KES', status: 'sale', property_type: 'mansion',
    city: 'Karen', country: 'Kenya', bedrooms: 7, bathrooms: 6, size_sqft: 14000,
    is_featured: true,
    featured_image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  },
  {
    id: 3, slug: 'westlands-penthouse', title: 'Westlands Sky Penthouse',
    price: '45000000', currency: 'KES', status: 'sale', property_type: 'apartment',
    city: 'Westlands', country: 'Kenya', bedrooms: 4, bathrooms: 3, size_sqft: 4500,
    is_featured: false,
    featured_image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
  },
  {
    id: 4, slug: 'mombasa-beachfront-resort', title: 'Mombasa Beachfront Resort',
    price: '250000000', currency: 'KES', status: 'sale', property_type: 'hotel',
    city: 'Mombasa', country: 'Kenya', bedrooms: 40, bathrooms: 40, size_sqft: 80000,
    is_featured: true,
    featured_image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
  },
  {
    id: 5, slug: 'lavington-luxury-apartment', title: 'Lavington Luxury Apartment',
    price: '18000000', currency: 'KES', status: 'rent', property_type: 'apartment',
    city: 'Lavington', country: 'Kenya', bedrooms: 3, bathrooms: 2, size_sqft: 2200,
    is_featured: false,
    featured_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
  },
  {
    id: 6, slug: 'runda-investment-land', title: 'Runda Premium Plot',
    price: '35000000', currency: 'KES', status: 'sale', property_type: 'land',
    city: 'Runda', country: 'Kenya', bedrooms: null, bathrooms: null, size_sqft: 21780,
    is_featured: false,
    featured_image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
  },
]

const TESTIMONIALS = [
  {
    text: 'LuxuryHome helped us find our dream villa in Diani within two weeks. The process was seamless and the team was incredibly professional throughout.',
    name: 'James Kariuki',
    role: 'Property Investor, Nairobi',
    avatar: 'https://i.pravatar.cc/48?img=11',
  },
  {
    text: 'As a first-time luxury buyer, I appreciated that I could request a quotation without creating an account. The agent called me within the hour!',
    name: 'Amina Hassan',
    role: 'CEO, Mombasa',
    avatar: 'https://i.pravatar.cc/48?img=5',
  },
  {
    text: 'The platform\'s property listings are unmatched. We found our boutique hotel investment through LuxuryHome and couldn\'t be happier with the ROI.',
    name: 'David Omondi',
    role: 'Hotel Owner, Naivasha',
    avatar: 'https://i.pravatar.cc/48?img=15',
  },
]