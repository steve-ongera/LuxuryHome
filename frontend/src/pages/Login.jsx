import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import { Eye, EyeOff, ArrowRight, Shield, Lock, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { extractError } from '../utils/api.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Sign In | LuxuryHome</title>
        <meta name="description" content="Sign in to your LuxuryHome account to manage properties, save favorites, and request quotations." />
      </Helmet>
      
      <div className="auth-page" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'var(--gray-50)',
        padding: 'calc(var(--nav-h) + var(--topbar-h) + var(--spacing-8)) var(--spacing-4) var(--spacing-8)',
      }}>
        <div className="auth-container" style={{ 
          width: '100%', 
          maxWidth: '480px',
        }}>
          {/* Logo and Header */}
          <div className="auth-header" style={{ 
            textAlign: 'center', 
            marginBottom: 'var(--spacing-10)' 
          }}>
            <Link to="/" className="auth-logo" style={{ 
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              display: 'inline-block',
              marginBottom: 'var(--spacing-6)',
            }}>
              Luxury<span style={{ color: 'var(--primary-red)' }}>Home</span>
            </Link>
            <h1 className="auth-title" style={{ 
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              marginBottom: 'var(--spacing-2)',
              color: 'var(--text-primary)',
            }}>
              Welcome Back
            </h1>
            <p className="auth-subtitle" style={{ 
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-base)',
            }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form Card */}
          <div className="auth-card" style={{ 
            background: 'var(--white)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-8)',
            boxShadow: 'var(--shadow-card)',
            transition: 'all var(--duration-normal) var(--ease-smooth)',
          }}>
            <form onSubmit={handleSubmit} noValidate>
              {/* Email Field */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <Mail size={16} color="var(--primary-red)" />
                  Email Address
                </label>
                <input 
                  className="form-input" 
                  type="email" 
                  placeholder="you@example.com"
                  value={form.email} 
                  onChange={set('email')} 
                  required 
                  autoFocus 
                />
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <Lock size={16} color="var(--primary-red)" />
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    className="form-input" 
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••" 
                    value={form.password} 
                    onChange={set('password')}
                    style={{ paddingRight: '3rem' }} 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPw((s) => !s)}
                    className="password-toggle"
                    style={{ 
                      position: 'absolute', 
                      right: 'var(--spacing-4)', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: 'transparent', 
                      border: 'none', 
                      color: 'var(--text-muted)', 
                      cursor: 'pointer', 
                      display: 'flex',
                      padding: 'var(--spacing-1)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'color var(--duration-fast) var(--ease-smooth)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 'var(--spacing-6)' 
              }}>
                <label className="luxury-checkbox" style={{ marginBottom: 0, fontSize: 'var(--text-sm)' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <Link 
                  to="/forgot-password" 
                  className="forgot-link"
                  style={{ 
                    fontSize: 'var(--text-sm)',
                    color: 'var(--primary-red)',
                    fontWeight: 500,
                    transition: 'color var(--duration-fast) var(--ease-smooth)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--dark-red)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary w-full" 
                disabled={loading}
                style={{ 
                  justifyContent: 'center', 
                  padding: 'var(--spacing-4)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  gap: 'var(--spacing-2)',
                }}
              >
                {loading ? (
                  <>
                    <span className="loader-ring" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                    Signing In…
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="auth-divider" style={{ 
              margin: 'var(--spacing-6) 0',
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-4)' 
            }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--text-muted)', 
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}>
                OR
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            {/* Register Link */}
            <p className="auth-footer" style={{ 
              textAlign: 'center', 
              fontSize: 'var(--text-sm)', 
              color: 'var(--text-secondary)' 
            }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: 'var(--primary-red)', 
                  fontWeight: 600,
                  transition: 'color var(--duration-fast) var(--ease-smooth)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--dark-red)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
              >
                Create one free
              </Link>
            </p>
          </div>

          {/* Bottom Links */}
          <div className="auth-bottom-links" style={{ 
            textAlign: 'center', 
            marginTop: 'var(--spacing-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-2)',
          }}>
            <p style={{ 
              fontSize: 'var(--text-sm)', 
              color: 'var(--text-muted)' 
            }}>
              No account needed to{' '}
              <Link 
                to="/properties" 
                style={{ 
                  color: 'var(--primary-red)',
                  fontWeight: 500,
                  transition: 'color var(--duration-fast) var(--ease-smooth)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--dark-red)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
              >
                browse properties
              </Link>
              {' '}or{' '}
              <Link 
                to="/properties" 
                style={{ 
                  color: 'var(--primary-red)',
                  fontWeight: 500,
                  transition: 'color var(--duration-fast) var(--ease-smooth)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--dark-red)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
              >
                request quotes
              </Link>
            </p>
            
            <Link 
              to="/" 
              className="back-home"
              style={{ 
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                transition: 'color var(--duration-fast) var(--ease-smooth)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              ← Back to Home
            </Link>
          </div>

          {/* Security Badge */}
          <div className="security-badge" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-2)',
            marginTop: 'var(--spacing-6)',
            padding: 'var(--spacing-2) var(--spacing-4)',
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border)',
          }}>
            <Shield size={14} color="var(--primary-red)" />
            <span style={{ 
              fontSize: 'var(--text-xs)', 
              color: 'var(--text-muted)',
              fontWeight: 500,
            }}>
              Secure & encrypted connection
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 599px) {
          .auth-card {
            padding: var(--spacing-6) var(--spacing-4) !important;
          }
          .auth-title {
            font-size: var(--text-xl) !important;
          }
          .auth-container {
            max-width: 100% !important;
          }
          .auth-page {
            padding: calc(var(--nav-h) + var(--spacing-4)) var(--spacing-4) var(--spacing-4) !important;
          }
        }

        @media (max-width: 374px) {
          .auth-card {
            padding: var(--spacing-4) !important;
          }
          .auth-header {
            margin-bottom: var(--spacing-6) !important;
          }
          .auth-logo {
            font-size: var(--text-xl) !important;
          }
          .auth-subtitle {
            font-size: var(--text-sm) !important;
          }
          .security-badge {
            flex-wrap: wrap !important;
            text-align: center !important;
          }
        }

        /* Card hover effect */
        .auth-card:hover {
          box-shadow: var(--shadow-lg) !important;
          transform: translateY(-2px);
        }

        /* Password toggle hover */
        .password-toggle:hover {
          color: var(--primary-red) !important;
        }

        /* Loading spinner */
        .loader-ring {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid var(--border);
          border-top-color: var(--white);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Focus styles for auth page */
        .auth-page input:focus {
          border-color: var(--primary-red) !important;
          box-shadow: var(--shadow-focus) !important;
        }

        /* Remember me checkbox enhancement */
        .luxury-checkbox input[type="checkbox"]:checked {
          background: var(--primary-red) !important;
          border-color: var(--primary-red) !important;
        }

        /* Hover transitions */
        .auth-footer a,
        .auth-bottom-links a {
          transition: color var(--duration-fast) var(--ease-smooth) !important;
        }

        .auth-bottom-links a:hover {
          color: var(--dark-red) !important;
        }
      `}</style>
    </>
  )
}