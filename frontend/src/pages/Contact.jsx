import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { MapPin, Phone, Mail, Clock, CheckCircle, Send, Building2, Users } from 'lucide-react'
import { utilsAPI, extractError } from '../utils/api.js'

const CONTACT_INFO = [
  { Icon: MapPin, label: 'OFFICE', value: 'Westlands Business Park, Nairobi, Kenya' },
  { Icon: Phone, label: 'PHONE', value: '+254 700 000 000' },
  { Icon: Mail, label: 'EMAIL', value: 'info@luxuryhome.com' },
  { Icon: Clock, label: 'HOURS', value: 'Monday – Saturday, 8 AM – 6 PM EAT' },
]

const TEAM_MEMBERS = [
  { name: 'Sarah Mwangi', role: 'Senior Property Consultant', email: 'sarah@luxuryhome.com' },
  { name: 'James Ochieng', role: 'Luxury Portfolio Manager', email: 'james@luxuryhome.com' },
  { name: 'Grace Wanjiru', role: 'Client Relations Director', email: 'grace@luxuryhome.com' },
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
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim()) e.email = 'Required'
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
        <meta property="og:title" content="Contact Us | LuxuryHome" />
        <meta property="og:description" content="Get in touch with LuxuryHome's expert real estate team. We're here to help you find your perfect luxury property in Kenya." />
      </Helmet>

      {/* Header */}
      <header className="contact-header" style={{
        paddingTop: 'calc(var(--nav-h) + var(--topbar-h) + var(--spacing-12))',
        paddingBottom: 'var(--spacing-16)',
        background: 'var(--text-primary)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="container">
          <motion.div {...fadeUp()}>
            <div className="section-label" style={{ color: 'var(--primary-red)' }}>
              We're Here to Help
            </div>
            <h1 style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'clamp(2.5rem, 5vw, var(--text-5xl))',
              color: 'var(--white)',
              fontWeight: 700,
              marginBottom: 'var(--spacing-4)',
              letterSpacing: '-0.02em',
            }}>
              Get In Touch
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '500px',
              lineHeight: 1.8,
              fontSize: 'var(--text-lg)',
            }}>
              Whether you're buying, selling, or simply exploring — our team of luxury real estate 
              specialists is ready to assist you.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Grid */}
      <section className="contact-section" style={{
        background: 'var(--white)',
        padding: 'var(--spacing-16) 0',
      }}>
        <div className="container">
          <div className="contact-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: 'var(--spacing-20)',
            alignItems: 'start',
          }}>

            {/* Left – Info */}
            <motion.div {...fadeUp()} className="contact-info">
              <h2 className="contact-info-title" style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 600,
                marginBottom: 'var(--spacing-8)',
              }}>
                Contact Information
              </h2>

              <div className="contact-info-items" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-6)',
                marginBottom: 'var(--spacing-10)',
              }}>
                {CONTACT_INFO.map(({ Icon, label, value }) => (
                  <div key={label} className="contact-info-item" style={{
                    display: 'flex',
                    gap: 'var(--spacing-5)',
                    alignItems: 'flex-start',
                  }}>
                    <div className="contact-icon-wrapper" style={{
                      width: '48px',
                      height: '48px',
                      background: 'var(--red-tint)',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all var(--duration-fast) var(--ease-smooth)',
                    }}>
                      <Icon size={18} color="var(--primary-red)" />
                    </div>
                    <div className="contact-info-content">
                      <div className="contact-label" style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        letterSpacing: '0.18em',
                        color: 'var(--primary-red)',
                        marginBottom: 'var(--spacing-1)',
                        textTransform: 'uppercase',
                      }}>
                        {label}
                      </div>
                      <div className="contact-value" style={{
                        fontSize: 'var(--text-base)',
                        color: 'var(--text-primary)',
                        fontWeight: 500,
                      }}>
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Team Section */}
              <div className="contact-team" style={{
                marginBottom: 'var(--spacing-10)',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                  marginBottom: 'var(--spacing-4)',
                }}>
                  Our Team
                </h3>
                <div className="team-members" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-3)',
                }}>
                  {TEAM_MEMBERS.map((member) => (
                    <div key={member.email} className="team-member" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-3)',
                      padding: 'var(--spacing-3) var(--spacing-4)',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius-base)',
                      border: '1px solid var(--border)',
                      transition: 'all var(--duration-fast) var(--ease-smooth)',
                    }}>
                      <div className="team-avatar" style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--primary-red)',
                        color: 'var(--white)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: 'var(--text-sm)',
                        flexShrink: 0,
                      }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="team-info">
                        <div className="team-name" style={{
                          fontWeight: 600,
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-primary)',
                        }}>
                          {member.name}
                        </div>
                        <div className="team-role" style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-secondary)',
                        }}>
                          {member.role}
                        </div>
                      </div>
                      <a href={`mailto:${member.email}`} className="team-email" style={{
                        marginLeft: 'auto',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--primary-red)',
                        textDecoration: 'none',
                        fontWeight: 500,
                        transition: 'color var(--duration-fast) var(--ease-smooth)',
                      }}>
                        Email
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '254700000000'}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                style={{
                  display: 'inline-flex',
                  gap: 'var(--spacing-2)',
                  alignItems: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </motion.div>

            {/* Right – Form */}
            <motion.div {...fadeUp(0.15)} className="contact-form-wrapper">
              <div className="contact-form-card" style={{
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-8)',
                boxShadow: 'var(--shadow-card)',
                transition: 'all var(--duration-normal) var(--ease-smooth)',
              }}>

                {sent ? (
                  <div className="success-message" style={{
                    textAlign: 'center',
                    padding: 'var(--spacing-12) var(--spacing-4)',
                  }}>
                    <CheckCircle size={64} color="var(--primary-red)" style={{ margin: '0 auto var(--spacing-6)' }} />
                    <h3 style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 600,
                      marginBottom: 'var(--spacing-3)',
                    }}>
                      Message Sent!
                    </h3>
                    <p style={{
                      color: 'var(--text-secondary)',
                      maxWidth: '320px',
                      margin: '0 auto',
                    }}>
                      Thank you for reaching out. One of our specialists will contact you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="form-title" style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 600,
                      marginBottom: 'var(--spacing-6)',
                    }}>
                      Send Us a Message
                    </h3>

                    <form onSubmit={handleSubmit} noValidate>
                      <div className="form-row" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'var(--spacing-4)',
                      }}>
                        <div className="form-group">
                          <label className="form-label">Full Name <span className="required" style={{ color: 'var(--error)' }}>*</span></label>
                          <input
                            className="form-input"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={set('name')}
                            required
                          />
                          {errors.name && <span className="form-error">{errors.name}</span>}
                        </div>
                        <div className="form-group">
                          <label className="form-label">Phone</label>
                          <input
                            className="form-input"
                            type="tel"
                            placeholder="+254 700 000 000"
                            value={form.phone}
                            onChange={set('phone')}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email Address <span className="required" style={{ color: 'var(--error)' }}>*</span></label>
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

                      <div className="form-group">
                        <label className="form-label">Subject <span className="required" style={{ color: 'var(--error)' }}>*</span></label>
                        <input
                          className="form-input"
                          placeholder="How can we help you?"
                          value={form.subject}
                          onChange={set('subject')}
                          required
                        />
                        {errors.subject && <span className="form-error">{errors.subject}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Message <span className="required" style={{ color: 'var(--error)' }}>*</span></label>
                        <textarea
                          className="form-textarea"
                          rows={5}
                          placeholder="Tell us about your requirements, the type of property you're interested in, your budget range, or any questions you may have…"
                          value={form.message}
                          onChange={set('message')}
                          required
                        />
                        {errors.message && <span className="form-error">{errors.message}</span>}
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                        style={{
                          justifyContent: 'center',
                          padding: 'var(--spacing-4)',
                          gap: 'var(--spacing-3)',
                          fontSize: 'var(--text-base)',
                          fontWeight: 600,
                        }}
                      >
                        <Send size={18} />
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
        @media (max-width: 1023px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: var(--spacing-12) !important;
          }
          .contact-form-card {
            padding: var(--spacing-6) !important;
          }
        }

        @media (max-width: 767px) {
          .contact-header {
            padding-top: calc(var(--nav-h) + var(--spacing-8)) !important;
            padding-bottom: var(--spacing-8) !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
          .contact-form-card {
            padding: var(--spacing-4) !important;
          }
          .contact-info-items {
            gap: var(--spacing-4) !important;
          }
          .team-member {
            flex-wrap: wrap !important;
          }
          .team-email {
            margin-left: 0 !important;
          }
        }

        @media (max-width: 599px) {
          .contact-section {
            padding: var(--spacing-8) 0 !important;
          }
          .contact-form-card {
            padding: var(--spacing-4) !important;
          }
          .success-message {
            padding: var(--spacing-8) var(--spacing-4) !important;
          }
        }

        /* Hover Effects */
        .contact-info-item:hover .contact-icon-wrapper {
          transform: scale(1.1);
          background: var(--red-tint-strong);
        }

        .team-member:hover {
          border-color: var(--primary-red) !important;
          background: var(--red-tint) !important;
          transform: translateX(4px);
        }

        .team-email:hover {
          color: var(--dark-red) !important;
          text-decoration: underline !important;
        }

        .contact-form-card:hover {
          box-shadow: var(--shadow-lg) !important;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </>
  )
}