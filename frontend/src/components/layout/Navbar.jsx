import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Menu, X, User, LogOut, LayoutDashboard, Heart,
  ChevronDown, Home, Building2, Hotel, Info, Phone, Mail, Briefcase,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV_LINKS = [
  { label: 'Properties', to: '/properties', icon: Building2 },
  { label: 'Hotels',     to: '/hotels',     icon: Hotel },
  { label: 'About',      to: '/about',      icon: Info },
  { label: 'Contact',    to: '/contact',    icon: Phone },
]

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [drawerOpen,   setDrawerOpen]   = useState(false)
  const [profileOpen,  setProfileOpen]  = useState(false)
  const { user, logout, isAdmin, isAgent } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const profileRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const fn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const dashboardPath = isAdmin
    ? '/dashboard/admin'
    : isAgent
    ? '/dashboard/agent'
    : '/dashboard'

  return (
    <>
      {/* ── Top Utility Bar ──────────────────────────────── */}
      <div className="topbar">
        <div className="container">
          <div className="topbar-inner">
            <ul className="topbar-links" style={{ display: 'flex' }}>
              <li className="topbar-item">
                <Phone size={12} /> +254 700 000 000
              </li>
              <li className="topbar-divider" />
              <li className="topbar-item">
                <Mail size={12} /> info@luxuryhome.com
              </li>
              <li className="topbar-divider" />
              <li>
                <Link to="/agents" className="topbar-item">
                  <Briefcase size={12} /> Find an Agent
                </Link>
              </li>
            </ul>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <Link to="/list-property" className="topbar-cta">
                List Your Property
              </Link>
              {!user && (
                <>
                  <span className="topbar-divider" />
                  <Link to="/login" className="topbar-cta">Sign In</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Navbar Bar ───────────────────────────────────── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-inner">

            {/* Logo — icon + text side by side */}
            <Link
              to="/"
              className="navbar-logo"
              style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', textDecoration: 'none' }}
            >
              <img
                src="/logo.png"
                alt=""
                aria-hidden="true"
                style={{ height: '40px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
              />
              <span style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}>
                Luxury<span style={{ color: 'var(--primary-red)' }}>Home</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <ul className="navbar-links" style={{ display: 'flex' }}>
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    className={({ isActive }) => isActive ? 'active' : ''}
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

              {/* Desktop auth */}
              <div className="desktop-auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {user ? (
                  <div style={{ position: 'relative' }} ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'var(--gray-light)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        padding: '0 1rem',
                        height: '40px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        transition: 'border-color 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <User size={14} color="var(--primary-red)" />
                      <span>{user.first_name || 'Account'}</span>
                      <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: profileOpen ? 'rotate(180deg)' : 'none' }} />
                    </button>

                    {profileOpen && (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.5rem)',
                        right: 0,
                        minWidth: '200px',
                        background: 'var(--white)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        zIndex: 1001,
                        boxShadow: '0 12px 32px rgba(31,41,55,0.14)',
                      }}>
                        {[
                          { to: dashboardPath, Icon: LayoutDashboard, label: 'Dashboard' },
                          { to: '/dashboard?tab=favorites', Icon: Heart, label: 'Favorites' },
                        ].map(({ to, Icon, label }) => (
                          <Link key={to} to={to} onClick={() => setProfileOpen(false)} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.85rem 1.25rem',
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                            borderBottom: '1px solid var(--border)',
                            transition: 'color 0.2s, background 0.2s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary-red)'; e.currentTarget.style.background = 'var(--red-tint)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent' }}
                          >
                            <Icon size={14} /> {label}
                          </Link>
                        ))}
                        <button onClick={handleLogout} style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.85rem 1.25rem',
                          fontSize: '0.85rem',
                          color: '#E8614C',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          width: '100%',
                          fontFamily: 'var(--font-family)',
                        }}>
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link to="/login"    className="btn btn-ghost btn-sm">Sign In</Link>
                    <Link to="/register" className="btn btn-gold  btn-sm">Register</Link>
                  </>
                )}
              </div>

              {/* Hamburger */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="hamburger-btn"
                aria-label="Open menu"
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '6px',
                  width: '44px',
                  height: '44px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Drawer Overlay ────────────────────────────────── */}
      <div
        className={`drawer-overlay ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ── Drawer Sidebar ────────────────────────────────── */}
      <aside className={`drawer ${drawerOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation menu">

        {/* Drawer Header — icon + text */}
        <div className="drawer-header">
          <Link
            to="/"
            className="drawer-logo"
            onClick={() => setDrawerOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
          >
            <img
              src="/logo.png"
              alt=""
              aria-hidden="true"
              style={{ height: '34px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
            />
            <span style={{
              fontFamily: 'var(--font-family)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}>
              Luxury<span style={{ color: 'var(--primary-red)' }}>Home</span>
            </span>
          </Link>
          <button
            className="drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Nav Links */}
        <nav className="drawer-nav">
          <Link to="/" className={`drawer-nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setDrawerOpen(false)}>
            <Home size={17} /> Home
          </Link>
          {NAV_LINKS.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`drawer-nav-link ${location.pathname.startsWith(to) ? 'active' : ''}`}
              onClick={() => setDrawerOpen(false)}
            >
              <Icon size={17} /> {label}
            </Link>
          ))}

          <div style={{ height: '1px', background: 'var(--border)', margin: '1.25rem 0' }} />

          {user ? (
            <>
              <div style={{ padding: '0.75rem', background: 'var(--gray-light)', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={16} color="var(--white)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user.first_name} {user.last_name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
              </div>
              <Link to={dashboardPath} className="drawer-nav-link" onClick={() => setDrawerOpen(false)}>
                <LayoutDashboard size={17} /> Dashboard
              </Link>
              <Link to="/dashboard?tab=favorites" className="drawer-nav-link" onClick={() => setDrawerOpen(false)}>
                <Heart size={17} /> Favorites
              </Link>
            </>
          ) : (
            <div style={{ padding: '0.5rem 0' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', padding: '0 0.75rem' }}>
                Sign in to save favorites and track quotes
              </p>
            </div>
          )}
        </nav>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          {user ? (
            <button
              onClick={async () => { await handleLogout(); setDrawerOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                width: '100%', padding: '0.85rem',
                background: 'transparent',
                border: '1px solid rgba(232,97,76,0.35)',
                borderRadius: '6px',
                color: '#E8614C',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                transition: 'background 0.2s',
              }}
            >
              <LogOut size={15} /> Sign Out
            </button>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost w-full" onClick={() => setDrawerOpen(false)} style={{ justifyContent: 'center' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-gold w-full"  onClick={() => setDrawerOpen(false)} style={{ justifyContent: 'center' }}>
                Create Account
              </Link>
            </>
          )}

          <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            © {new Date().getFullYear()} LuxuryHome
          </p>
        </div>
      </aside>

      <style>{`
        @media (min-width: 768px) {
          .hamburger-btn { display: none !important; }
          .desktop-auth-buttons { display: flex !important; }
        }
        @media (max-width: 767px) {
          .desktop-auth-buttons { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .navbar-links { display: none !important; }
        }
      `}</style>
    </>
  )
}