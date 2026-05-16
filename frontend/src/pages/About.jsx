import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Award, Users, Home, TrendingUp } from 'lucide-react'

const STATS = [
  { n: '1,200+', l: 'Properties Listed' },
  { n: '850+',   l: 'Happy Clients' },
  { n: '150+',   l: 'Verified Agents' },
  { n: '15+',    l: 'Years Experience' },
]

const VALUES = [
  { Icon: Award,     title: 'Excellence',   desc: 'We curate only the finest properties that meet our premium standards.' },
  { Icon: Users,     title: 'Trust',        desc: 'Every agent is verified. Every listing is inspected. Your investment is safe.' },
  { Icon: Home,      title: 'Expertise',    desc: 'Deep local knowledge across Kenya and beyond. We know every neighbourhood.' },
  { Icon: TrendingUp,title: 'Results',      desc: 'Our clients consistently achieve the best outcomes in the market.' },
]

const TEAM = [
  { name: 'James Kariuki',  role: 'Founder & CEO',          avatar: 'https://i.pravatar.cc/200?img=11' },
  { name: 'Amina Hassan',   role: 'Head of Luxury Sales',   avatar: 'https://i.pravatar.cc/200?img=5'  },
  { name: 'David Omondi',   role: 'Director of Hotels',     avatar: 'https://i.pravatar.cc/200?img=15' },
  { name: 'Grace Wanjiku',  role: 'Lead Property Agent',    avatar: 'https://i.pravatar.cc/200?img=9'  },
]

const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:  { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | LuxuryHome</title>
        <meta name="description" content="LuxuryHome is Kenya's leading luxury real estate platform — mansions, villas, beach properties and premium hotels." />
      </Helmet>

      {/* Hero */}
      <div style={{
        paddingTop: '8rem', paddingBottom: '6rem',
        background: 'var(--dark)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.07,
        }} />
        <div className="container" style={{ position: 'relative' }}>
          <motion.div {...fadeUp()}>
            <div className="section-label">Est. 2024</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 300, maxWidth: '700px', marginBottom: '1.5rem', lineHeight: 1.1 }}>
              Redefining Luxury<br />Real Estate in <em style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>Kenya</em>
            </h1>
            <p style={{ color: 'var(--gray-mid)', maxWidth: '580px', lineHeight: 1.9, fontSize: '1.05rem' }}>
              Founded on the belief that finding or selling a premium property should be as exceptional as the property itself.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: 'var(--black)' }}>
        <div className="container">
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <motion.div key={s.l} className="stat-item" {...fadeUp(i * 0.1)}>
                <div className="stat-number">{s.n}</div>
                <div className="stat-label">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <motion.div {...fadeUp()}>
              <div className="section-label">Our Story</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', marginBottom: '1.5rem' }}>
                Built for Those Who Demand the Best
              </h2>
              <div className="gold-divider" />
              <p style={{ color: 'var(--gray-mid)', lineHeight: 1.9, marginBottom: '1.25rem' }}>
                LuxuryHome was founded in Nairobi in 2024 by a team of real estate professionals who saw a gap in the market: Kenya's finest properties deserved a platform that matched their prestige.
              </p>
              <p style={{ color: 'var(--gray-mid)', lineHeight: 1.9, marginBottom: '2rem' }}>
                Today we are the country's most trusted platform for ultra-premium real estate — from beachfront villas in Diani to investment land in the Rift Valley. Our network of verified agents and hotel partners spans every major city and resort destination.
              </p>
              <Link to="/properties" className="btn btn-outline">
                Explore Listings
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.15)}>
              <div style={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=80"
                  alt="Luxury property"
                  style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', bottom: '-1.5rem', right: '-1.5rem',
                  background: 'var(--dark-2)', border: '1px solid rgba(201,168,76,0.2)',
                  padding: '1.5rem 2rem',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--gold)', lineHeight: 1 }}>
                    #1
                  </div>
                  <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray-muted)', marginTop: '0.4rem' }}>
                    Luxury Platform<br />in Kenya
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--black)' }}>
        <div className="container">
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>What We Stand For</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)' }}>Our Core Values</h2>
          </motion.div>
          <div className="grid-4">
            {VALUES.map(({ Icon, title, desc }, i) => (
              <motion.div key={title} {...fadeUp(i * 0.1)}
                style={{ padding: '2rem', background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                <div style={{ width: '48px', height: '48px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Icon size={20} color="var(--gold)" />
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '0.75rem' }}>{title}</h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.8 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Meet the Team</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)' }}>The People Behind LuxuryHome</h2>
          </motion.div>
          <div className="grid-4">
            {TEAM.map((m, i) => (
              <motion.div key={m.name} {...fadeUp(i * 0.1)} style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
                  <img src={m.avatar} alt={m.name}
                    style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold)', display: 'block', margin: '0 auto' }}
                  />
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.3rem' }}>{m.name}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--gold)', letterSpacing: '0.08em' }}>{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 0', background: 'var(--black)', textAlign: 'center', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
        <div className="container">
          <motion.div {...fadeUp()}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,3rem)', marginBottom: '1rem' }}>
              Ready to Work With Us?
            </h2>
            <p style={{ color: 'var(--gray-mid)', marginBottom: '2.5rem', maxWidth: '440px', margin: '0 auto 2.5rem' }}>
              Whether buying, selling, or investing — our team is ready to deliver an extraordinary experience.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-gold btn-lg">Contact Us</Link>
              <Link to="/properties" className="btn btn-ghost btn-lg">View Properties</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          [style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}