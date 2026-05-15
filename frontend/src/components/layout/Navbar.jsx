import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, LayoutDashboard, Heart, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV_LINKS = [
  { label: 'Properties', to: '/properties' },
  { label: 'Hotels', to: '/hotels' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout, isAdmin, isAgent } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setProfileOpen(false)
  }

  const dashboardPath = isAdmin
    ? '/dashboard/admin'
    : isAgent
    ? '/dashboard/agent'
    : '/dashboard'

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
            Luxury<span>Home</span>
          </Link>

          {/* Desktop Links */}
          <ul className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}

            {/* Mobile-only auth buttons */}
            {mobileOpen && !user && (
              <li style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-gold btn-sm" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </li>
            )}
          </ul>

          {/* Right Actions */}
          <div className="flex gap-2" style={{ alignItems: 'center' }}>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex gap-1"
                  style={{
                    background: 'var(--dark-3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--warm-white)',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    transition: 'border-color 0.3s',
                  }}
                >
                  <User size={15} color="var(--gold)" />
                  <span>{user.first_name || 'Account'}</span>
                  <ChevronDown size={13} />
                </button>

                {profileOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 0.5rem)',
                      right: 0,
                      minWidth: '200px',
                      background: 'var(--dark-2)',
                      border: '1px solid rgba(201,168,76,0.15)',
                      zIndex: 1001,
                    }}
                  >
                    <Link
                      to={dashboardPath}
                      onClick={() => setProfileOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1.25rem',
                        fontSize: '0.82rem',
                        color: 'var(--gray-mid)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        transition: 'color 0.2s',
                      }}
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard?tab=favorites"
                      onClick={() => setProfileOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1.25rem',
                        fontSize: '0.82rem',
                        color: 'var(--gray-mid)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        transition: 'color 0.2s',
                      }}
                    >
                      <Heart size={14} />
                      Favorites
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1.25rem',
                        fontSize: '0.82rem',
                        color: '#E8614C',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2" style={{ display: 'none' }} id="desktop-auth">
                <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-gold btn-sm">Register</Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--warm-white)',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        #desktop-auth { display: flex !important; }
        @media (max-width: 768px) { #desktop-auth { display: none !important; } }
        .navbar-links li a:hover { color: var(--warm-white); }
      `}</style>
    </nav>
  )
}