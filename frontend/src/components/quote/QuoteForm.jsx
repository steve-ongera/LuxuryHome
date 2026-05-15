/**
 * QuoteForm – No authentication required.
 * Any visitor can request a quotation on a property.
 */
import { useState } from 'react'
import { quotesAPI, extractError } from '../../utils/api.js'
import { toast } from 'react-toastify'
import { CheckCircle, Send } from 'lucide-react'

const INQUIRY_TYPES = [
  { value: 'quote',      label: 'Price Quotation' },
  { value: 'viewing',    label: 'Schedule Viewing' },
  { value: 'financing',  label: 'Financing Info' },
  { value: 'negotiate',  label: 'Negotiate Price' },
]

const INITIAL = {
  full_name: '',
  email: '',
  phone: '',
  budget: '',
  inquiry_type: 'quote',
  viewing_date: '',
  message: '',
}

export default function QuoteForm({ property, onClose }) {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.full_name.trim()) e.full_name = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.message.trim()) e.message = 'Please add a message'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await quotesAPI.submit({
        ...form,
        property: property?.slug || property?.id,
      })
      setSubmitted(true)
      toast.success('Quote request sent! We\'ll contact you shortly.')
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <CheckCircle size={52} color="var(--gold)" style={{ margin: '0 auto 1.5rem' }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.75rem' }}>
          Request Received
        </h3>
        <p style={{ color: 'var(--gray-mid)', marginBottom: '2rem', maxWidth: '340px', margin: '0 auto 2rem' }}>
          Thank you, {form.full_name}. Our team will reach you at{' '}
          <strong style={{ color: 'var(--gold)' }}>{form.email}</strong> within 24 hours.
        </p>
        {onClose && (
          <button onClick={onClose} className="btn btn-outline">
            Close
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {property && (
        <div style={{
          padding: '1rem 1.25rem',
          background: 'var(--dark-3)',
          border: '1px solid rgba(201,168,76,0.15)',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          color: 'var(--gray-mid)',
        }}>
          Requesting quote for:{' '}
          <strong style={{ color: 'var(--warm-white)' }}>{property.title}</strong>
        </div>
      )}

      {/* No-auth notice */}
      <div style={{
        padding: '0.75rem 1rem',
        background: 'rgba(201,168,76,0.06)',
        border: '1px solid rgba(201,168,76,0.2)',
        fontSize: '0.78rem',
        color: 'var(--gold)',
        marginBottom: '1.5rem',
        letterSpacing: '0.03em',
      }}>
        ✓ No account needed — anyone can request a quote for free
      </div>

      {/* Inquiry Type */}
      <div className="form-group">
        <label className="form-label">Inquiry Type</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {INQUIRY_TYPES.map((t) => (
            <label
              key={t.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.9rem',
                background: form.inquiry_type === t.value ? 'rgba(201,168,76,0.12)' : 'var(--dark-3)',
                border: `1px solid ${form.inquiry_type === t.value ? 'var(--gold)' : 'rgba(255,255,255,0.08)'}`,
                cursor: 'pointer',
                fontSize: '0.78rem',
                color: form.inquiry_type === t.value ? 'var(--gold)' : 'var(--gray-mid)',
                transition: 'all 0.2s',
              }}
            >
              <input
                type="radio"
                name="inquiry_type"
                value={t.value}
                checked={form.inquiry_type === t.value}
                onChange={handleChange}
                style={{ display: 'none' }}
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      {/* Full Name */}
      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input
          className="form-input"
          type="text"
          name="full_name"
          placeholder="John Doe"
          value={form.full_name}
          onChange={handleChange}
        />
        {errors.full_name && <span className="form-error">{errors.full_name}</span>}
      </div>

      {/* Email + Phone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            className="form-input"
            type="email"
            name="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Phone *</label>
          <input
            className="form-input"
            type="tel"
            name="phone"
            placeholder="+254 700 000 000"
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>
      </div>

      {/* Budget */}
      <div className="form-group">
        <label className="form-label">Your Budget (optional)</label>
        <input
          className="form-input"
          type="text"
          name="budget"
          placeholder="e.g. KES 50,000,000 or USD 300,000"
          value={form.budget}
          onChange={handleChange}
        />
      </div>

      {/* Viewing Date */}
      {form.inquiry_type === 'viewing' && (
        <div className="form-group">
          <label className="form-label">Preferred Viewing Date</label>
          <input
            className="form-input"
            type="date"
            name="viewing_date"
            value={form.viewing_date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      )}

      {/* Message */}
      <div className="form-group">
        <label className="form-label">Message *</label>
        <textarea
          className="form-textarea"
          name="message"
          placeholder="Tell us about your requirements, questions or preferred contact time..."
          value={form.message}
          onChange={handleChange}
          rows={4}
        />
        {errors.message && <span className="form-error">{errors.message}</span>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn btn-gold w-full"
        disabled={loading}
        style={{ justifyContent: 'center', gap: '0.75rem', padding: '1rem' }}
      >
        <Send size={16} />
        {loading ? 'Sending Request…' : 'Send Quote Request'}
      </button>

      <p style={{
        fontSize: '0.72rem',
        color: 'var(--gray-muted)',
        textAlign: 'center',
        marginTop: '1rem',
        letterSpacing: '0.02em',
      }}>
        We respect your privacy. Your information is kept confidential.
      </p>
    </form>
  )
}