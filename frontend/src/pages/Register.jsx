import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { extractError } from '../utils/api.js'

const ROLES = [
  { value: 'customer',    label: 'Property Buyer / Tenant',  desc: 'Browse, save & enquire about listings' },
  { value: 'agent',       label: 'Real Estate Agent',         desc: 'List and manage property portfolios' },
  { value: 'hotel_owner', label: 'Hotel / Resort Owner',      desc: 'Manage hotel rooms and bookings' },
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

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.first_name.trim()) e.first_name = 'Required'
    if (!form.last_name.trim())  e.last_name  = 'Required'
    if (!form.email.trim())      e.email      = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.phone.trim())      e.phone      = 'Required'
    if (!form.password)          e.password   = 'Required'
    else if (form.password.length < 8) e.password = 'Min 8 characters'
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
      <Helmet><title>Create Account | LuxuryHome</title></Helmet>

      <div style={{
        minHeight: '100vh', background: 'var(--dark)',
        padding: '7rem 1.5rem 4rem',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--warm-white)' }}>
              Luxury<span style={{ color: 'var(--gold)' }}>Home</span>
            </Link>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', marginTop: '1.5rem', marginBottom: '0.4rem' }}>
              Create Your Account
            </h1>
            <p style={{ color: 'var(--gray-muted)', fontSize: '0.88rem' }}>
              Join Kenya's premier luxury real estate platform
            </p>
          </div>

          <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(201,168,76,0.15)', padding: '2.5rem' }}>
            <form onSubmit={handleSubmit} noValidate>

              {/* Role Selection */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div className="form-label" style={{ marginBottom: '0.75rem' }}>I am a</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {ROLES.map((r) => (
                    <label
                      key={r.value}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '1rem',
                        padding: '1rem 1.25rem', cursor: 'pointer',
                        background: form.role === r.value ? 'rgba(201,168,76,0.08)' : 'var(--dark-3)',
                        border: `1px solid ${form.role === r.value ? 'var(--gold)' : 'rgba(255,255,255,0.07)'}`,
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="radio" name="role" value={r.value}
                        checked={form.role === r.value}
                        onChange={set('role')}
                        style={{ marginTop: '2px', accentColor: 'var(--gold)', flexShrink: 0 }}
                      />
                      <div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--warm-white)', fontWeight: 500 }}>
                          {r.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-muted)', marginTop: '2px' }}>
                          {r.desc}
                        </div>
                      </div>
                      {form.role === r.value && (
                        <CheckCircle size={16} color="var(--gold)" style={{ marginLeft: 'auto', flexShrink: 0, marginTop: '2px' }} />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Name Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" placeholder="John"
                    value={form.first_name} onChange={set('first_name')} />
                  {errors.first_name && <span className="form-error">{errors.first_name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" placeholder="Doe"
                    value={form.last_name} onChange={set('last_name')} />
                  {errors.last_name && <span className="form-error">{errors.last_name}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="you@example.com"
                  value={form.email} onChange={set('email')} />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" placeholder="+254 700 000 000"
                  value={form.phone} onChange={set('phone')} />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-input" type={showPw ? 'text' : 'password'}
                    placeholder="Min 8 characters" value={form.password}
                    onChange={set('password')} style={{ paddingRight: '3rem' }} />
                  <button type="button" onClick={() => setShowPw((s) => !s)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--gray-muted)', cursor: 'pointer', display: 'flex' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              {/* Submit */}
              <button type="submit" className="btn btn-gold w-full" disabled={loading}
                style={{ justifyContent: 'center', padding: '1rem', marginTop: '0.5rem' }}>
                {loading ? 'Creating Account…' : 'Create Account'}
              </button>

              <p style={{ fontSize: '0.72rem', color: 'var(--gray-muted)', textAlign: 'center', marginTop: '1rem' }}>
                By registering you agree to our{' '}
                <Link to="/terms" style={{ color: 'var(--gold)' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" style={{ color: 'var(--gold)' }}>Privacy Policy</Link>
              </p>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--gray-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 500 }}>Sign in</Link>
            </p>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--gray-muted)' }}>
            No account needed to{' '}
            <Link to="/properties" style={{ color: 'var(--gold)' }}>browse</Link>
            {' '}or{' '}
            <Link to="/properties" style={{ color: 'var(--gold)' }}>request quotes</Link>
          </p>
        </div>
      </div>
    </>
  )
}