import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const PROPERTY_LINKS = [
  { label: 'Mansions',          to: '/properties?type=mansion' },
  { label: 'Villas',            to: '/properties?type=villa' },
  { label: 'Luxury Apartments', to: '/properties?type=apartment' },
  { label: 'Beach Properties',  to: '/properties?type=beach' },
  { label: 'Commercial',        to: '/properties?type=commercial' },
  { label: 'Investment Land',   to: '/properties?type=land' },
]

const COMPANY_LINKS = [
  { label: 'About Us',         to: '/about' },
  { label: 'Our Agents',       to: '/agents' },
  { label: 'Careers',          to: '/careers' },
  { label: 'Press',            to: '/press' },
  { label: 'Privacy Policy',   to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
]

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--dark)',
      borderTop: '1px solid rgba(201,168,76,0.1)',
      paddingTop: '5rem',
    }}>
      <div className="container">

        {/* Top grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          paddingBottom: '4rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>

          {/* Brand */}
          <div>
            {/* Logo image + name */}
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1.25rem',
                textDecoration: 'none',
              }}
            >
              <img
                src="/logo.png"
                alt=""
                aria-hidden="true"
                style={{
                  height: '60px',
                  width: 'auto',
                  objectFit: 'contain',
                  flexShrink: 0,
                }}
              />
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.9rem',
                fontWeight: 600,
                color: 'var(--warm-white)',
                letterSpacing: '0.03em',
                lineHeight: 1,
              }}>
                Luxury<span style={{ color: 'var(--gold)' }}>Home</span>
              </span>
            </Link>

            <p style={{
              fontSize: '0.85rem',
              lineHeight: 1.8,
              maxWidth: '280px',
              marginBottom: '1.5rem',
              color: 'var(--gray-mid)',
            }}>
              The world's most trusted platform for ultra-premium real estate.
              Where discerning buyers find exceptional properties.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { Icon: InstagramIcon, href: '#' },
                { Icon: TwitterIcon,   href: '#' },
                { Icon: FacebookIcon,  href: '#' },
                { Icon: LinkedinIcon,  href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                    color: 'var(--gray-mid)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold)'
                    e.currentTarget.style.color = 'var(--gold)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.color = 'var(--gray-mid)'
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Properties */}
          <div>
            <h4 style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '1.5rem',
            }}>
              Properties
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {PROPERTY_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    style={{ fontSize: '0.85rem', color: 'var(--gray-mid)', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray-mid)'}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '1.5rem',
            }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {COMPANY_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    style={{ fontSize: '0.85rem', color: 'var(--gray-mid)', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray-mid)'}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '1.5rem',
            }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { Icon: MapPin, text: 'Westlands, Nairobi, Kenya' },
                { Icon: Phone,  text: '+254 700 000 000' },
                { Icon: Mail,   text: 'info@luxuryhome.com' },
              ].map(({ Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Icon size={14} color="var(--gold)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-mid)' }}>{text}</span>
                </div>
              ))}
            </div>

            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '+254700000000'}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm"
              style={{ marginTop: '1.5rem', display: 'inline-flex' }}
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem 0',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--gray-muted)' }}>
            © {new Date().getFullYear()} LuxuryHome. All rights reserved.
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--gray-muted)' }}>
            Crafted for the world's finest properties.
          </p>
        </div>

      </div>
    </footer>
  )
}