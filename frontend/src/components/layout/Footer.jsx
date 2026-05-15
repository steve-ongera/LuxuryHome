import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

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
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 600,
              color: 'var(--warm-white)',
              marginBottom: '1.25rem',
            }}>
              Luxury<span style={{ color: 'var(--gold)' }}>Home</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.8, maxWidth: '280px', marginBottom: '1.5rem' }}>
              The world's most trusted platform for ultra-premium real estate. Where discerning buyers find exceptional properties.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Instagram, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Facebook, href: '#' },
                { Icon: Linkedin, href: '#' },
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
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Properties */}
          <div>
            <h4 style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
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
            <h4 style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
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
            <h4 style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { Icon: MapPin, text: 'Westlands, Nairobi, Kenya' },
                { Icon: Phone, text: '+254 700 000 000' },
                { Icon: Mail, text: 'info@luxuryhome.com' },
              ].map(({ Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Icon size={14} color="var(--gold)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-mid)' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
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