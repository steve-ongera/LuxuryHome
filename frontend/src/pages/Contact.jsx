import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { MapPin, Phone, Mail, Clock, CheckCircle, Send } from 'lucide-react'
import { utilsAPI, extractError } from '../utils/api.js'

const CONTACT_INFO = [
  { Icon: MapPin, label: 'OFFICE',  value: 'Westlands Business Park, Nairobi, Kenya' },
  { Icon: Phone,  label: 'PHONE',   value: '+254 700 000 000' },
  { Icon: Mail,   label: 'EMAIL',   value: 'info@luxuryhome.com' },
  { Icon: Clock,  label: 'HOURS',   value: 'Monday – Saturday, 8 AM – 6 PM EAT' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Required'
    if (!form.email.trim())   e.email   = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.subject.trim()) e.subject = 'Required'
    if (!form.message.trim()) e.message = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await utilsAPI.contactMessage(form)
      setSent(true)
      toast.success("Message sent! We'll be in touch within 24 hours.")
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  })

  return (
    <>
      <Helmet>
        <title>Contact Us | LuxuryHome</title>
        <meta name="description" content="Get in touch with LuxuryHome's expert real estate team. We're here to help you find your perfect luxury property in Kenya." />
      </Helmet>

      {/* Header */}
      <div style={{ paddingTop: '8rem', paddingBottom: '5rem', background: 'var(--dark)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <motion.div {...fadeUp()}>
            <div className="section-label">We're Here to Help</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 300, marginBottom: '1rem' }}>
              Get In Touch
            </h1>
            <p style={{ color: 'var(--gray-mid)', maxWidth: '500px', lineHeight: 1.8 }}>
              Whether you're buying, selling, or simply exploring — our team of luxury real estate specialists is ready to assist you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Grid */}
      <section className="section" style={{ background: 'var(--black)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '5rem', alignItems: 'start' }}>

            {/* Left – Info */}
            <motion.div {...fadeUp()}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '2rem' }}>
                Contact Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
                {CONTACT_INFO.map(({ Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '42px', height: '42px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color="var(--gold)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.18em', color: 'var(--gold)', marginBottom: '0.3rem' }}>
                        {label}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--warm-white)' }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '254700000000'}`}
                target="_blank" rel="noreferrer"
                className="btn btn-outline"
                style={{ display: 'inline-flex', gap: '0.6rem', alignItems: 'center' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </motion.div>

            {/* Right – Form */}
            <motion.div {...fadeUp(0.15)}>
              <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(201,168,76,0.15)', padding: '2.5rem' }}>

                {sent ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <CheckCircle size={52} color="var(--gold)" style={{ margin: '0 auto 1.5rem' }} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.75rem' }}>
                      Message Sent!
                    </h3>
                    <p style={{ color: 'var(--gray-mid)', maxWidth: '320px', margin: '0 auto' }}>
                      Thank you for reaching out. One of our specialists will contact you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '2rem' }}>
                      Send Us a Message
                    </h3>

                    <form onSubmit={handleSubmit} noValidate>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Full Name *</label>
                          <input className="form-input" placeholder="John Doe"
                            value={form.name} onChange={set('name')} />
                          {errors.name && <span className="form-error">{errors.name}</span>}
                        </div>
                        <div className="form-group">
                          <label className="form-label">Phone</label>
                          <input className="form-input" type="tel" placeholder="+254 700 000 000"
                            value={form.phone} onChange={set('phone')} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input className="form-input" type="email" placeholder="you@example.com"
                          value={form.email} onChange={set('email')} />
                        {errors.email && <span className="form-error">{errors.email}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Subject *</label>
                        <input className="form-input" placeholder="How can we help you?"
                          value={form.subject} onChange={set('subject')} />
                        {errors.subject && <span className="form-error">{errors.subject}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Message *</label>
                        <textarea className="form-textarea" rows={5}
                          placeholder="Tell us about your requirements, the type of property you're interested in, your budget range, or any questions you may have…"
                          value={form.message} onChange={set('message')} />
                        {errors.message && <span className="form-error">{errors.message}</span>}
                      </div>

                      <button type="submit" className="btn btn-gold w-full" disabled={loading}
                        style={{ justifyContent: 'center', padding: '1rem', gap: '0.75rem' }}>
                        <Send size={16} />
                        {loading ? 'Sending Message…' : 'Send Message'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          [style*="grid-template-columns: 1fr 1.4fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}