import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import { Eye, EyeOff, CheckCircle, User, Mail, Phone, Lock, Shield, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { extractError } from '../utils/api.js'

const ROLES = [
  { value: 'customer', label: 'Property Buyer / Tenant', desc: 'Browse, save & enquire about listings', icon: User },
  { value: 'agent', label: 'Real Estate Agent', desc: 'List and manage property portfolios', icon: User },
  { value: 'hotel_owner', label: 'Hotel / Resort Owner', desc: 'Manage hotel rooms and bookings', icon: User },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    phone: '', password: '', role: 'customer',
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.first_name.trim()) e.first_name = 'Required'
    if (!form.last_name.trim()) e.last_name = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.password) e.password = 'Required'
    else if (form.password.length < 8) e.password = 'Min 8 characters'
    if (!acceptedTerms) e.terms = 'Please accept the terms'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created! Please check your email to verify.')
      navigate('/login')
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Create Account | LuxuryHome</title>
        <meta name="description" content="Join LuxuryHome - Kenya's premier luxury real estate platform. Create your free account to browse properties, save favorites, and request quotations." />
      </Helmet>

      <div className="auth-page register-page" style={{
        minHeight: '100vh',
        background: 'var(--gray-50)',
        padding: 'calc(var(--nav-h) + var(--topbar-h) + var(--spacing-8)) var(--spacing-4) var(--spacing-8)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}>
        <div className="auth-container" style={{
          width: '100%',
          maxWidth: '600px',
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
              Create Your Account
            </h1>
            <p className="auth-subtitle" style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-base)',
            }}>
              Join Kenya's premier luxury real estate platform
            </p>
          </div>

          <div className="auth-card" style={{
            background: 'var(--white)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-8)',
            boxShadow: 'var(--shadow-card)',
            transition: 'all var(--duration-normal) var(--ease-smooth)',
          }}>
            <form onSubmit={handleSubmit} noValidate>

              {/* Role Selection */}
              <div className="role-selection" style={{
                marginBottom: 'var(--spacing-7)'
              }}>
                <div className="form-label" style={{
                  marginBottom: 'var(--spacing-3)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                }}>
                  I am a
                </div>
                <div className="role-options" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-2)',
                }}>
                  {ROLES.map((r) => {
                    const Icon = r.icon
                    const isSelected = form.role === r.value
                    return (
                      <label
                        key={r.value}
                        className={`role-option ${isSelected ? 'selected' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 'var(--spacing-4)',
                          padding: 'var(--spacing-4) var(--spacing-5)',
                          cursor: 'pointer',
                          background: isSelected ? 'var(--red-tint)' : 'var(--gray-50)',
                          border: `2px solid ${isSelected ? 'var(--primary-red)' : 'var(--border)'}`,
                          borderRadius: 'var(--radius-base)',
                          transition: 'all var(--duration-fast) var(--ease-smooth)',
                          position: 'relative',
                        }}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={r.value}
                          checked={isSelected}
                          onChange={set('role')}
                          style={{
                            marginTop: '2px',
                            accentColor: 'var(--primary-red)',
                            flexShrink: 0,
                            width: '18px',
                            height: '18px',
                          }}
                        />
                        <div className="role-content" style={{ flex: 1 }}>
                          <div className="role-label" style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-primary)',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-2)',
                          }}>
                            <Icon size={16} color="var(--primary-red)" />
                            {r.label}
                          </div>
                          <div className="role-desc" style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-secondary)',
                            marginTop: 'var(--spacing-1)',
                          }}>
                            {r.desc}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle size={20} color="var(--primary-red)" style={{
                            flexShrink: 0,
                            marginTop: '2px',
                          }} />
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Name Row */}
              <div className="name-row" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-4)',
              }}>
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} color="var(--primary-red)" style={{ marginRight: 'var(--spacing-1)' }} />
                    First Name
                  </label>
                  <input
                    className="form-input"
                    placeholder="John"
                    value={form.first_name}
                    onChange={set('first_name')}
                    required
                  />
                  {errors.first_name && <span className="form-error">{errors.first_name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-input"
                    placeholder="Doe"
                    value={form.last_name}
                    onChange={set('last_name')}
                    required
                  />
                  {errors.last_name && <span className="form-error">{errors.last_name}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">
                  <Mail size={16} color="var(--primary-red)" style={{ marginRight: 'var(--spacing-1)' }} />
                  Email Address
                </label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">
                  <Phone size={16} color="var(--primary-red)" style={{ marginRight: 'var(--spacing-1)' }} />
                  Phone Number
                </label>
                <input
                  className="form-input"
                  type="tel"
                  placeholder="+254 700 000 000"
                  value={form.phone}
                  onChange={set('phone')}
                  required
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} color="var(--primary-red)" style={{ marginRight: 'var(--spacing-1)' }} />
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-input"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min 8 characters"
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
                {errors.password && <span className="form-error">{errors.password}</span>}
                <div className="password-hint" style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-muted)',
                  marginTop: 'var(--spacing-1)',
                }}>
                  Must be at least 8 characters
                </div>
              </div>

              {/* Terms */}
              <div className="terms-section" style={{
                marginBottom: 'var(--spacing-6)',
              }}>
                <label className="luxury-checkbox" style={{
                  fontSize: 'var(--text-sm)',
                  alignItems: 'flex-start',
                }}>
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    style={{ marginTop: '2px' }}
                  />
                  <span>
                    I agree to the{' '}
                    <Link to="/terms" style={{
                      color: 'var(--primary-red)',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'color var(--duration-fast) var(--ease-smooth)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--dark-red)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
                    >
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" style={{
                      color: 'var(--primary-red)',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'color var(--duration-fast) var(--ease-smooth)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--dark-red)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && <span className="form-error">{errors.terms}</span>}
              </div>

              {/* Submit */}
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
                    Creating Account…
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight size={18} />
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

            {/* Login Link */}
            <p className="auth-footer" style={{
              textAlign: 'center',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)'
            }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: 'var(--primary-red)',
                  fontWeight: 600,
                  transition: 'color var(--duration-fast) var(--ease-smooth)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--dark-red)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Bottom Links */}
          <div className="auth-bottom-links" style={{
            textAlign: 'center',
            marginTop: 'var(--spacing-6)',
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
              Secure & encrypted registration
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .name-row {
            grid-template-columns: 1fr !important;
          }
          .auth-card {
            padding: var(--spacing-6) !important;
          }
          .role-option {
            padding: var(--spacing-3) var(--spacing-4) !important;
          }
        }

        @media (max-width: 599px) {
          .register-page {
            padding: calc(var(--nav-h) + var(--spacing-4)) var(--spacing-4) var(--spacing-4) !important;
          }
          .auth-title {
            font-size: var(--text-xl) !important;
          }
          .auth-container {
            max-width: 100% !important;
          }
          .auth-card {
            padding: var(--spacing-4) !important;
          }
        }

        @media (max-width: 374px) {
          .auth-card {
            padding: var(--spacing-3) !important;
          }
          .role-option {
            flex-wrap: wrap !important;
          }
          .role-content {
            width: 100% !important;
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

        /* Role option hover */
        .role-option:hover:not(.selected) {
          border-color: var(--border-hover) !important;
          background: var(--gray-50) !important;
        }

        .role-option.selected {
          border-color: var(--primary-red) !important;
          background: var(--red-tint) !important;
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

        /* Focus styles */
        .register-page input:focus {
          border-color: var(--primary-red) !important;
          box-shadow: var(--shadow-focus) !important;
        }

        /* Checkbox enhancement */
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