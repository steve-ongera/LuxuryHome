import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import { Eye, EyeOff } from 'lucide-react'
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
      <Helmet><title>Sign In | LuxuryHome</title></Helmet>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)', padding: '7rem 1.5rem 4rem' }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--warm-white)' }}>
              Luxury<span style={{ color: 'var(--gold)' }}>Home</span>
            </Link>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', marginTop: '1.5rem', marginBottom: '0.4rem' }}>Welcome Back</h1>
            <p style={{ color: 'var(--gray-muted)', fontSize: '0.88rem' }}>Sign in to your account to continue</p>
          </div>

          <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(201,168,76,0.15)', padding: '2.5rem' }}>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="you@example.com"
                  value={form.email} onChange={set('email')} required autoFocus />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-input" type={showPw ? 'text' : 'password'}
                    placeholder="••••••••" value={form.password} onChange={set('password')}
                    style={{ paddingRight: '3rem' }} required />
                  <button type="button" onClick={() => setShowPw((s) => !s)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--gray-muted)', cursor: 'pointer', display: 'flex' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right', marginBottom: '1.75rem' }}>
                <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--gold)' }}>Forgot password?</Link>
              </div>

              <button type="submit" className="btn btn-gold w-full" disabled={loading}
                style={{ justifyContent: 'center', padding: '1rem', fontSize: '0.82rem' }}>
                {loading ? 'Signing In…' : 'Sign In'}
              </button>
            </form>

            <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--gray-muted)', letterSpacing: '0.1em' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--gray-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--gold)', fontWeight: 500 }}>Create one free</Link>
            </p>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--gray-muted)' }}>
            No account needed to{' '}
            <Link to="/properties" style={{ color: 'var(--gold)' }}>browse properties</Link>
            {' '}or{' '}
            <Link to="/properties" style={{ color: 'var(--gold)' }}>request quotes</Link>
          </p>
        </div>
      </div>
    </>
  )
}