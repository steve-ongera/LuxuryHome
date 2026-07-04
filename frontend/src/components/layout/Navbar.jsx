import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Menu, X, User, LogOut, LayoutDashboard, Heart,
  ChevronDown, Home, Building2, Hotel, Info, Phone, Mail, Briefcase,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV_LINKS = [
  { label: 'Properties', to: '/properties', icon: Building2 },
  { label: 'Hotels', to: '/hotels', icon: Hotel },
  { label: 'About', to: '/about', icon: Info },
  { label: 'Contact', to: '/contact', icon: Phone },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout, isAdmin, isAgent } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
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
      <div className="topbar" style={{ zIndex: 1001 }}>
        <div className="container">
          <div className="topbar-inner">
            <ul className="topbar-links">
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

            <div className="flex" style={{ alignItems: 'center', gap: 'var(--spacing-5)' }}>
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
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{ zIndex: 1000 }}>
        <div className="container">
          <div className="navbar-inner">

            {/* Logo */}
            <Link to="/" className="navbar-logo">
              <img
                src="/logo.png"
                alt="LuxuryHome"
                style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
              />
              <span>Luxury<span>Home</span></span>
            </Link>

            {/* Desktop Links */}
            <ul className="navbar-links">
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
            <div className="flex" style={{ alignItems: 'center', gap: 'var(--spacing-3)' }}>

              {/* Desktop auth */}
              <div className="desktop-auth-buttons" style={{ alignItems: 'center', gap: 'var(--spacing-2)' }}>
                {user ? (
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex"
                      style={{
                        alignItems: 'center',
                        gap: 'var(--spacing-2)',
                        background: 'var(--gray-50)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        padding: '0 var(--spacing-4)',
                        height: '40px',
                        borderRadius: 'var(--radius-base)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 500,
                        transition: 'border-color var(--duration-fast) var(--ease-smooth)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <User size={14} color="var(--primary-red)" />
                      <span>{user.first_name || 'Account'}</span>
                      <ChevronDown 
                        size={12} 
                        style={{ 
                          transition: 'transform var(--duration-fast) var(--ease-smooth)',
                          transform: profileOpen ? 'rotate(180deg)' : 'none' 
                        }} 
                      />
                    </button>

                    {profileOpen && (
                      <div className="card" style={{
                        position: 'absolute',
                        top: 'calc(100% + var(--spacing-2))',
                        right: 0,
                        minWidth: '200px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        zIndex: 2000,
                        boxShadow: 'var(--shadow-xl)',
                        border: '1px solid var(--border)',
                      }}>
                        {[
                          { to: dashboardPath, Icon: LayoutDashboard, label: 'Dashboard' },
                          { to: '/dashboard?tab=favorites', Icon: Heart, label: 'Favorites' },
                        ].map(({ to, Icon, label }) => (
                          <Link
                            key={to}
                            to={to}
                            onClick={() => setProfileOpen(false)}
                            className="drawer-nav-link"
                            style={{ borderRadius: 0 }}
                          >
                            <Icon size={14} /> {label}
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="drawer-nav-link"
                          style={{
                            borderRadius: 0,
                            color: 'var(--error)',
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-family)',
                            fontSize: 'var(--text-sm)',
                          }}
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                    <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                  </>
                )}
              </div>

              {/* Hamburger */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="navbar-toggle"
                aria-label="Open menu"
                style={{ zIndex: 1002, position: 'relative' }}
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
        style={{ zIndex: 2000 }}
      />

      {/* ── Drawer Sidebar ────────────────────────────────── */}
      <aside 
        className={`drawer ${drawerOpen ? 'open' : ''}`} 
        role="dialog" 
        aria-modal="true" 
        aria-label="Navigation menu"
        style={{ zIndex: 2001 }}
      >

        {/* Drawer Header */}
        <div className="drawer-header">
          <Link
            to="/"
            className="drawer-logo"
            onClick={() => setDrawerOpen(false)}
          >
            <img
              src="/logo.png"
              alt="LuxuryHome"
              style={{ height: '34px', width: 'auto', objectFit: 'contain' }}
            />
            <span>Luxury<span>Home</span></span>
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
          <Link 
            to="/" 
            className={`drawer-nav-link ${location.pathname === '/' ? 'active' : ''}`} 
            onClick={() => setDrawerOpen(false)}
          >
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

          <div className="gold-divider" style={{ margin: 'var(--spacing-5) 0', width: 'auto' }} />

          {user ? (
            <>
              <div style={{
                padding: 'var(--spacing-3)',
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius-base)',
                marginBottom: 'var(--spacing-2)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-3)',
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--primary-red)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <User size={16} color="var(--white)" />
                </div>
                <div>
                  <div style={{ 
                    fontSize: 'var(--text-sm)', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)' 
                  }}>
                    {user.first_name} {user.last_name}
                  </div>
                  <div style={{ 
                    fontSize: 'var(--text-xs)', 
                    color: 'var(--text-muted)' 
                  }}>
                    {user.email}
                  </div>
                </div>
              </div>
              <Link 
                to={dashboardPath} 
                className="drawer-nav-link" 
                onClick={() => setDrawerOpen(false)}
              >
                <LayoutDashboard size={17} /> Dashboard
              </Link>
              <Link 
                to="/dashboard?tab=favorites" 
                className="drawer-nav-link" 
                onClick={() => setDrawerOpen(false)}
              >
                <Heart size={17} /> Favorites
              </Link>
            </>
          ) : (
            <div style={{ padding: 'var(--spacing-2) 0' }}>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                marginBottom: 'var(--spacing-3)',
                padding: '0 var(--spacing-3)',
              }}>
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-2)',
                width: '100%',
                padding: 'var(--spacing-3)',
                background: 'transparent',
                border: '1px solid rgba(232, 97, 76, 0.35)',
                borderRadius: 'var(--radius-base)',
                color: 'var(--error)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                transition: 'background var(--duration-fast) var(--ease-smooth)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <LogOut size={15} /> Sign Out
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                className="btn btn-ghost w-full" 
                onClick={() => setDrawerOpen(false)}
                style={{ justifyContent: 'center' }}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary w-full" 
                onClick={() => setDrawerOpen(false)}
                style={{ justifyContent: 'center' }}
              >
                Create Account
              </Link>
            </>
          )}

          <p style={{
            textAlign: 'center',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            marginTop: 'var(--spacing-2)',
          }}>
            © {new Date().getFullYear()} LuxuryHome
          </p>
        </div>
      </aside>

      <style>{`
        /* Ensure proper z-index stacking */
        .topbar {
          z-index: 1001 !important;
        }
        
        .navbar {
          z-index: 1000 !important;
        }
        
        .drawer-overlay {
          z-index: 2000 !important;
        }
        
        .drawer {
          z-index: 2001 !important;
        }
        
        /* Profile dropdown */
        .card {
          z-index: 2000 !important;
        }
        
        /* Hamburger button */
        .navbar-toggle {
          z-index: 1002 !important;
          position: relative !important;
        }

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