import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, MessageSquare, Eye, Calendar, Plus, LogOut, CheckCircle, Clock } from 'lucide-react'
import { agentAPI } from '../../utils/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import PropertyCard from '../../components/property/PropertyCard.jsx'

const TABS = ['Overview', 'My Listings', 'Inquiries', 'Appointments']

function StatCard({ icon: Icon, label, value, color = 'var(--gold)' }) {
  return (
    <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.75rem' }}>
      <div style={{ width: '44px', height: '44px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <Icon size={18} color={color} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--warm-white)', marginBottom: '0.3rem' }}>{value ?? '—'}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--gray-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

export default function AgentDashboard() {
  const { user, logout } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [listings, setListings] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')

  useEffect(() => {
    Promise.all([
      agentAPI.analytics(),
      agentAPI.myListings(),
      agentAPI.inquiries(),
    ]).then(([a, l, i]) => {
      setAnalytics(a.data)
      setListings(l.data?.results || l.data || [])
      setInquiries(i.data?.results || i.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="loader-wrap" style={{ minHeight: '100vh', paddingTop: '6rem' }}><div className="loader-ring" /></div>
  )

  const stats = analytics || {}

  return (
    <>
      <Helmet><title>Agent Dashboard | LuxuryHome</title></Helmet>

      <div style={{ paddingTop: '6rem', minHeight: '100vh', background: 'var(--black)' }}>
        <div className="container" style={{ padding: '2rem clamp(1rem,4vw,2.5rem)' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-label">Agent Portal</div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
                My Dashboard
              </h1>
              <p style={{ color: 'var(--gray-muted)', fontSize: '0.85rem' }}>Welcome, {user?.first_name}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/properties" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                <Plus size={14} /> New Listing
              </Link>
              <button onClick={logout} className="btn btn-ghost btn-sm" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '2.5rem', background: 'var(--dark-2)', padding: '4px', width: 'fit-content', flexWrap: 'wrap' }}>
            {TABS.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                style={{
                  padding: '0.6rem 1.25rem', fontSize: '0.78rem', fontWeight: 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  background: activeTab === t ? 'var(--gold)' : 'transparent',
                  color: activeTab === t ? 'var(--black)' : 'var(--gray-mid)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'var(--font-body)',
                }}>
                {t}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'Overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1px', marginBottom: '2.5rem', background: 'rgba(255,255,255,0.04)' }}>
                <StatCard icon={Home}         label="Total Listings"    value={stats.total_listings}   />
                <StatCard icon={CheckCircle}  label="Active Listings"   value={stats.active_listings}  color="#4CAF50" />
                <StatCard icon={MessageSquare} label="Total Inquiries"  value={stats.total_inquiries}  />
                <StatCard icon={Clock}        label="New Inquiries"     value={stats.new_inquiries}    color="#4C9EE8" />
                <StatCard icon={Eye}          label="Total Views"       value={stats.total_views}      />
              </div>

              {/* Upcoming Appointments */}
              {stats.upcoming_appointments?.length > 0 && (
                <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: '2rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <Calendar size={16} color="var(--gold)" />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Upcoming Appointments</h3>
                  </div>
                  {stats.upcoming_appointments.map((a) => (
                    <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--dark-3)', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <div style={{ color: 'var(--warm-white)', fontSize: '0.88rem' }}>{a.client_name}</div>
                        <div style={{ color: 'var(--gray-muted)', fontSize: '0.75rem' }}>{a.property_title}</div>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gold)' }}>
                        {new Date(a.scheduled_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recent Inquiries */}
              {stats.recent_inquiries?.length > 0 && (
                <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: '2rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>Recent Inquiries</h3>
                  {stats.recent_inquiries.map((q) => (
                    <div key={q.id} style={{ padding: '1rem', background: 'var(--dark-3)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <div style={{ color: 'var(--warm-white)', fontSize: '0.88rem' }}>{q.full_name}</div>
                        <div style={{ color: 'var(--gray-muted)', fontSize: '0.75rem' }}>{q.property_title} · {q.inquiry_type}</div>
                      </div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '0.2rem 0.6rem', background: q.status === 'new' ? 'rgba(76,158,232,0.15)' : 'rgba(201,168,76,0.1)', color: q.status === 'new' ? '#4C9EE8' : 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {q.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* My Listings */}
          {activeTab === 'My Listings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {listings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Home size={40} color="var(--gold)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p style={{ color: 'var(--gray-muted)', marginBottom: '1.5rem' }}>No listings yet.</p>
                  <Link to="/properties/new" className="btn btn-gold btn-sm">Create First Listing</Link>
                </div>
              ) : (
                <div className="grid-3">
                  {listings.map((p) => <PropertyCard key={p.id} property={p} />)}
                </div>
              )}
            </motion.div>
          )}

          {/* Inquiries */}
          {activeTab === 'Inquiries' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>All Inquiries</h3>
                {inquiries.length === 0 ? (
                  <p style={{ color: 'var(--gray-muted)', textAlign: 'center', padding: '2rem' }}>No inquiries yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                          {['Client', 'Contact', 'Property', 'Type', 'Budget', 'Status', 'Date'].map((h) => (
                            <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--gray-muted)', fontWeight: 500, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.map((q) => (
                          <tr key={q.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--warm-white)' }}>{q.full_name}</td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--gray-mid)', fontSize: '0.78rem' }}>
                              <div>{q.email}</div><div>{q.phone}</div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--gray-mid)' }}>{q.property_title || '—'}</td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--gray-mid)' }}>{q.inquiry_type}</td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--gray-mid)' }}>{q.budget || '—'}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span style={{ padding: '0.2rem 0.6rem', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: q.status === 'new' ? 'rgba(76,158,232,0.15)' : 'rgba(201,168,76,0.1)', color: q.status === 'new' ? '#4C9EE8' : 'var(--gold)' }}>
                                {q.status}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--gray-muted)' }}>
                              {new Date(q.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Appointments' && (
            <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Calendar size={40} color="var(--gold)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ color: 'var(--gray-muted)' }}>Appointment management coming soon. Use the API endpoint <code style={{ color: 'var(--gold)' }}>/api/agent/appointments/</code></p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}