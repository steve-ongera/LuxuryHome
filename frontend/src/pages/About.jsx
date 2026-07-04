import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Award, Users, Home, TrendingUp, MapPin, Phone, Mail, Clock, ChevronRight } from 'lucide-react'

const STATS = [
  { n: '1,200+', l: 'Properties Listed' },
  { n: '850+', l: 'Happy Clients' },
  { n: '150+', l: 'Verified Agents' },
  { n: '15+', l: 'Years Experience' },
]

const VALUES = [
  { Icon: Award, title: 'Excellence', desc: 'We curate only the finest properties that meet our premium standards.' },
  { Icon: Users, title: 'Trust', desc: 'Every agent is verified. Every listing is inspected. Your investment is safe.' },
  { Icon: Home, title: 'Expertise', desc: 'Deep local knowledge across Kenya and beyond. We know every neighbourhood.' },
  { Icon: TrendingUp, title: 'Results', desc: 'Our clients consistently achieve the best outcomes in the market.' },
]

const TEAM = [
  { name: 'James Kariuki', role: 'Founder & CEO', avatar: 'https://i.pravatar.cc/200?img=11' },
  { name: 'Amina Hassan', role: 'Head of Luxury Sales', avatar: 'https://i.pravatar.cc/200?img=5' },
  { name: 'David Omondi', role: 'Director of Hotels', avatar: 'https://i.pravatar.cc/200?img=15' },
  { name: 'Grace Wanjiku', role: 'Lead Property Agent', avatar: 'https://i.pravatar.cc/200?img=9' },
]

const MILESTONES = [
  { year: '2024', title: 'Founded in Nairobi', description: 'Launched with a vision to transform luxury real estate in Kenya' },
  { year: '2024', title: 'First Property Listed', description: 'A magnificent Karen mansion valued at 120M KES' },
  { year: '2025', title: 'Expanded to Hotels', description: 'Added premium hotels and resorts to our portfolio' },
  { year: '2025', title: 'Agent Network Grows', description: '150+ verified agents across all major cities' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | LuxuryHome</title>
        <meta name="description" content="LuxuryHome is Kenya's leading luxury real estate platform — mansions, villas, beach properties and premium hotels." />
        <meta property="og:title" content="About Us | LuxuryHome" />
        <meta property="og:description" content="LuxuryHome is Kenya's leading luxury real estate platform — mansions, villas, beach properties and premium hotels." />
        <link rel="canonical" href="https://luxuryhome.com/about" />
      </Helmet>

      {/* Hero */}
      <section className="about-hero" style={{
        paddingTop: 'calc(var(--nav-h) + var(--topbar-h) + var(--spacing-12))',
        paddingBottom: 'var(--spacing-16)',
        background: 'var(--text-primary)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="hero-background" style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.06,
        }} />
        <div className="container" style={{ position: 'relative' }}>
          <motion.div {...fadeUp()}>
            <div className="section-label" style={{ color: 'var(--primary-red)' }}>Est. 2024</div>
            <h1 className="about-title" style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'clamp(2.5rem, 6vw, var(--text-5xl))',
              fontWeight: 700,
              maxWidth: '700px',
              marginBottom: 'var(--spacing-6)',
              lineHeight: 1.1,
              color: 'var(--white)',
              letterSpacing: '-0.02em',
            }}>
              Redefining Luxury<br />Real Estate in <em style={{ fontStyle: 'italic', color: 'var(--primary-red)' }}>Kenya</em>
            </h1>
            <p className="hero-subtitle" style={{
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '580px',
              lineHeight: 1.9,
              fontSize: 'var(--text-lg)',
            }}>
              Founded on the belief that finding or selling a premium property should be as exceptional as the property itself.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section" style={{ background: 'var(--white)' }}>
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
      </section>

      {/* Story */}
      <section className="section story-section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="story-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-20)',
            alignItems: 'center',
          }}>
            <motion.div {...fadeUp()} className="story-content">
              <div className="section-label">Our Story</div>
              <h2 className="story-title" style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'clamp(1.8rem, 3.5vw, var(--text-4xl))',
                fontWeight: 700,
                marginBottom: 'var(--spacing-4)',
              }}>
                Built for Those Who Demand the Best
              </h2>
              <div className="gold-divider" />
              <p className="story-text" style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.9,
                marginBottom: 'var(--spacing-5)',
                fontSize: 'var(--text-base)',
              }}>
                LuxuryHome was founded in Nairobi in 2024 by a team of real estate professionals who saw a gap in the market: Kenya's finest properties deserved a platform that matched their prestige.
              </p>
              <p className="story-text" style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.9,
                marginBottom: 'var(--spacing-8)',
                fontSize: 'var(--text-base)',
              }}>
                Today we are the country's most trusted platform for ultra-premium real estate — from beachfront villas in Diani to investment land in the Rift Valley. Our network of verified agents and hotel partners spans every major city and resort destination.
              </p>
              <Link to="/properties" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                Explore Listings <ChevronRight size={16} />
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.15)} className="story-image">
              <div style={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=80"
                  alt="Luxury property"
                  className="story-img"
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                />
                <div className="story-badge" style={{
                  position: 'absolute',
                  bottom: '-1.5rem',
                  right: '-1.5rem',
                  background: 'var(--white)',
                  border: '2px solid var(--primary-red)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--spacing-6) var(--spacing-8)',
                  boxShadow: 'var(--shadow-xl)',
                }}>
                  <div className="badge-number" style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-3xl)',
                    fontWeight: 700,
                    color: 'var(--primary-red)',
                    lineHeight: 1,
                  }}>
                    #1
                  </div>
                  <div className="badge-label" style={{
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
                    marginTop: 'var(--spacing-1)',
                    fontWeight: 600,
                  }}>
                    Luxury Platform<br />in Kenya
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section milestones-section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Our Journey</div>
            <h2 className="milestones-title" style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'clamp(1.8rem, 3.5vw, var(--text-4xl))',
              fontWeight: 700,
            }}>
              Milestones That Define Us
            </h2>
          </motion.div>
          <div className="milestones-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--spacing-6)',
          }}>
            {MILESTONES.map((m, i) => (
              <motion.div key={m.title} {...fadeUp(i * 0.1)} className="milestone-card" style={{
                background: 'var(--gray-50)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-6)',
                transition: 'all var(--duration-normal) var(--ease-smooth)',
                textAlign: 'center',
              }}>
                <div className="milestone-year" style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  color: 'var(--primary-red)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  {m.year}
                </div>
                <h4 className="milestone-title" style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  {m.title}
                </h4>
                <p className="milestone-desc" style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}>
                  {m.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section values-section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>What We Stand For</div>
            <h2 className="values-title" style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'clamp(1.8rem, 3.5vw, var(--text-4xl))',
              fontWeight: 700,
            }}>
              Our Core Values
            </h2>
          </motion.div>
          <div className="grid-4">
            {VALUES.map(({ Icon, title, desc }, i) => (
              <motion.div key={title} {...fadeUp(i * 0.1)} className="value-card" style={{
                padding: 'var(--spacing-8)',
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                transition: 'all var(--duration-normal) var(--ease-smooth)',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-red)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              >
                <div className="value-icon" style={{
                  width: '56px',
                  height: '56px',
                  background: 'var(--red-tint)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--spacing-4)',
                }}>
                  <Icon size={24} color="var(--primary-red)" />
                </div>
                <h4 className="value-title" style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                  marginBottom: 'var(--spacing-2)',
                }}>
                  {title}
                </h4>
                <p className="value-desc" style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section team-section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Meet the Team</div>
            <h2 className="team-title" style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'clamp(1.8rem, 3.5vw, var(--text-4xl))',
              fontWeight: 700,
            }}>
              The People Behind LuxuryHome
            </h2>
          </motion.div>
          <div className="grid-4">
            {TEAM.map((m, i) => (
              <motion.div key={m.name} {...fadeUp(i * 0.1)} className="team-card" style={{
                textAlign: 'center',
                padding: 'var(--spacing-6)',
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                transition: 'all var(--duration-normal) var(--ease-smooth)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-red)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              >
                <div className="team-avatar" style={{
                  position: 'relative',
                  display: 'inline-block',
                  marginBottom: 'var(--spacing-4)',
                }}>
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="team-avatar-img"
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: 'var(--radius-full)',
                      objectFit: 'cover',
                      border: '3px solid var(--primary-red)',
                      display: 'block',
                      margin: '0 auto',
                      transition: 'transform var(--duration-slow) var(--ease-smooth)',
                    }}
                  />
                </div>
                <h4 className="team-name" style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                  marginBottom: 'var(--spacing-1)',
                }}>
                  {m.name}
                </h4>
                <p className="team-role" style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--primary-red)',
                  letterSpacing: '0.08em',
                  fontWeight: 500,
                }}>
                  {m.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{
        padding: 'var(--spacing-24) 0',
        background: 'var(--text-primary)',
        textAlign: 'center',
        borderTop: '1px solid rgba(217, 63, 48, 0.1)',
      }}>
        <div className="container">
          <motion.div {...fadeUp()}>
            <h2 className="cta-title" style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'clamp(1.8rem, 4vw, var(--text-4xl))',
              color: 'var(--white)',
              marginBottom: 'var(--spacing-4)',
              fontWeight: 700,
            }}>
              Ready to Work With Us?
            </h2>
            <p className="cta-subtitle" style={{
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '440px',
              margin: '0 auto var(--spacing-10)',
              fontSize: 'var(--text-lg)',
            }}>
              Whether buying, selling, or investing — our team is ready to deliver an extraordinary experience.
            </p>
            <div className="cta-actions" style={{
              display: 'flex',
              gap: 'var(--spacing-4)',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <Link to="/contact" className="btn btn-primary btn-lg">
                Contact Us
              </Link>
              <Link to="/properties" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'var(--white)' }}>
                View Properties
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1023px) {
          .story-grid {
            grid-template-columns: 1fr !important;
            gap: var(--spacing-12) !important;
          }
          .story-badge {
            bottom: -1rem !important;
            right: -1rem !important;
            padding: var(--spacing-4) var(--spacing-6) !important;
          }
        }

        @media (max-width: 767px) {
          .about-hero {
            padding-top: calc(var(--nav-h) + var(--spacing-8)) !important;
            padding-bottom: var(--spacing-8) !important;
          }
          .about-title {
            font-size: var(--text-3xl) !important;
          }
          .story-badge {
            bottom: 0 !important;
            right: 0 !important;
            padding: var(--spacing-3) var(--spacing-4) !important;
          }
          .badge-number {
            font-size: var(--text-2xl) !important;
          }
          .milestones-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .team-avatar-img {
            width: 100px !important;
            height: 100px !important;
          }
        }

        @media (max-width: 599px) {
          .story-badge {
            display: none !important;
          }
          .grid-4 {
            grid-template-columns: 1fr !important;
          }
          .milestones-grid {
            grid-template-columns: 1fr !important;
          }
          .value-card {
            padding: var(--spacing-6) !important;
          }
          .cta-section {
            padding: var(--spacing-16) 0 !important;
          }
          .cta-actions {
            flex-direction: column !important;
            align-items: center !important;
          }
          .cta-actions .btn {
            width: 100% !important;
            max-width: 280px !important;
          }
          .team-card {
            padding: var(--spacing-4) !important;
          }
          .team-avatar-img {
            width: 80px !important;
            height: 80px !important;
          }
        }

        @media (max-width: 374px) {
          .story-text {
            font-size: var(--text-sm) !important;
          }
          .value-title {
            font-size: var(--text-base) !important;
          }
        }

        /* Hover effect for value cards */
        .value-card:hover .value-icon {
          background: var(--red-tint-strong) !important;
          transform: scale(1.05);
        }

        /* Team avatar hover */
        .team-card:hover .team-avatar-img {
          transform: scale(1.05);
        }

        /* Milestone card hover */
        .milestone-card:hover {
          border-color: var(--primary-red) !important;
          box-shadow: var(--shadow-md) !important;
          transform: translateY(-4px);
        }

        /* Smooth transitions */
        .value-card,
        .team-card,
        .milestone-card {
          transition: all var(--duration-normal) var(--ease-smooth) !important;
        }
      `}</style>
    </>
  )
}