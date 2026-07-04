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
  { label: 'Mansions', to: '/properties?type=mansion' },
  { label: 'Villas', to: '/properties?type=villa' },
  { label: 'Luxury Apartments', to: '/properties?type=apartment' },
  { label: 'Beach Properties', to: '/properties?type=beach' },
  { label: 'Commercial', to: '/properties?type=commercial' },
  { label: 'Investment Land', to: '/properties?type=land' },
]

const COMPANY_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Our Agents', to: '/agents' },
  { label: 'Careers', to: '/careers' },
  { label: 'Press', to: '/press' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
]

export default function Footer() {
  return (
    <footer className="footer" style={{
      background: 'var(--gray-50)',
      borderTop: '1px solid var(--border)',
      paddingTop: 'var(--spacing-16)',
      marginTop: 'auto',
    }}>
      <div className="container">

        {/* Top grid */}
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--spacing-12)',
          paddingBottom: 'var(--spacing-16)',
          borderBottom: '1px solid var(--border)',
        }}>

          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
              marginBottom: 'var(--spacing-5)',
              textDecoration: 'none',
            }}>
              <img
                src="/logo.png"
                alt="LuxuryHome"
                style={{
                  height: '52px',
                  width: 'auto',
                  objectFit: 'contain',
                  flexShrink: 0,
                }}
              />
              <span className="footer-logo-text" style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}>
                Luxury<span style={{ color: 'var(--primary-red)' }}>Home</span>
              </span>
            </Link>

            <p className="footer-description" style={{
              fontSize: 'var(--text-sm)',
              lineHeight: 1.8,
              maxWidth: '280px',
              marginBottom: 'var(--spacing-6)',
              color: 'var(--text-secondary)',
            }}>
              The world's most trusted platform for ultra-premium real estate.
              Where discerning buyers find exceptional properties.
            </p>

            {/* Social icons */}
            <div className="footer-social" style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              {[
                { Icon: InstagramIcon, href: '#', label: 'Instagram' },
                { Icon: TwitterIcon, href: '#', label: 'Twitter' },
                { Icon: FacebookIcon, href: '#', label: 'Facebook' },
                { Icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
              ].map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  className="footer-social-link"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-base)',
                    border: '1px solid var(--border)',
                    background: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all var(--duration-fast) var(--ease-smooth)',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-red)'
                    e.currentTarget.style.color = 'var(--primary-red)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Properties */}
          <div className="footer-column">
            <h4 className="footer-heading" style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-6)',
            }}>
              Properties
            </h4>
            <ul className="footer-links" style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-3)',
            }}>
              {PROPERTY_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="footer-link"
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      transition: 'color var(--duration-fast) var(--ease-smooth)',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--primary-red)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h4 className="footer-heading" style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-6)',
            }}>
              Company
            </h4>
            <ul className="footer-links" style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-3)',
            }}>
              {COMPANY_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="footer-link"
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      transition: 'color var(--duration-fast) var(--ease-smooth)',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--primary-red)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h4 className="footer-heading" style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-6)',
            }}>
              Contact
            </h4>
            <div className="footer-contact" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-4)',
            }}>
              {[
                { Icon: MapPin, text: 'Westlands, Nairobi, Kenya' },
                { Icon: Phone, text: '+254 700 000 000' },
                { Icon: Mail, text: 'info@luxuryhome.com' },
              ].map(({ Icon, text }, i) => (
                <div key={i} className="footer-contact-item" style={{
                  display: 'flex',
                  gap: 'var(--spacing-3)',
                  alignItems: 'flex-start',
                }}>
                  <Icon 
                    size={14} 
                    color="var(--primary-red)" 
                    style={{ 
                      marginTop: '2px', 
                      flexShrink: 0,
                      opacity: 0.8,
                    }} 
                  />
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>

            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '+254700000000'}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm"
              style={{
                marginTop: 'var(--spacing-6)',
                display: 'inline-flex',
                gap: 'var(--spacing-2)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacing-6) 0',
          gap: 'var(--spacing-4)',
          flexWrap: 'wrap',
        }}>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
          }}>
            © {new Date().getFullYear()} LuxuryHome. All rights reserved.
          </p>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
            textAlign: 'right',
          }}>
            Crafted for the world's finest properties.
          </p>
        </div>

      </div>
    </footer>
  )
}