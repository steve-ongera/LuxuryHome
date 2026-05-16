import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Home, Users, Hotel, MessageSquare,
  TrendingUp, CheckCircle, Clock, DollarSign,
  Eye, AlertCircle, LogOut,
} from 'lucide-react'
import { adminAPI, extractError } from '../../utils/api.js'
import { useAuth } from '../../context/AuthContext.jsx'

function StatCard({ icon: Icon, label, value, color = 'var(--gold)', change }) {
  return (
    <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div style={{ width: '44px', height: '44px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
        {change !== undefined && (
          <span style={{ fontSize: '0.72rem', color: change >= 0 ? '#4CAF50' : '#E8614C', background: change >= 0 ? 'rgba(76,175,80,0.1)' : 'rgba(232,97,76,0.1)', padding: '0.2rem 0.5rem' }}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--warm-white)', marginBottom: '0.3rem' }}>
        {value ?? '—'}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--gray-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  )
}

const TABS = ['Overview', 'Properties', 'Users', 'Quotes', 'Revenue']

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')
  const [pendingProperties, setPendingProperties] = useState([])

  useEffect(() => {
    Promise.all([
      adminAPI.analytics(),
      adminAPI.pendingProperties(),
    ]).then(([a, p]) => {
      setAnalytics(a.data)
      setPendingProperties(p.data?.results || p.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveProperty(id)
      setPendingProperties((prev) => prev.filter((p) => p.id !== id))
    } catch { /* noop */ }
  }

  if (loading) return (
    <div className="loader-wrap" style={{ minHeight: '100vh', paddingTop: '6rem' }}>
      <div className="loader-ring" />
    </div>
  )

  const stats = analytics || {}

  return (
    <>
      <Helmet><title>Admin Dashboard | LuxuryHome</title></Helmet>

      <div style={{ paddingTop: '6rem', minHeight: '100vh', background: 'var(--black)' }}>
        <div className="container" style={{ padding: '2rem clamp(1rem,4vw,2.5rem)' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-label">Platform Control</div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
                Admin Dashboard
              </h1>
              <p style={{ color: 'var(--gray-muted)', fontSize: '0.85rem' }}>
                Welcome back, {user?.first_name}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/properties" className="btn btn-outline btn-sm">View Site</Link>
              <button onClick={logout} className="btn btn-ghost btn-sm" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '2.5rem', background: 'var(--dark-2)', padding: '4px', width: 'fit-content' }}>
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

          {activeTab === 'Overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', marginBottom: '2.5rem', background: 'rgba(255,255,255,0.04)' }}>
                <StatCard icon={Home}         label="Total Properties"  value={stats.total_properties}  />
                <StatCard icon={Hotel}        label="Total Hotels"      value={stats.total_hotels}       />
                <StatCard icon={Users}        label="Total Users"       value={stats.total_users}        />
                <StatCard icon={MessageSquare} label="Total Quotes"     value={stats.total_quotes}       />
                <StatCard icon={Clock}        label="New Quotes Today"  value={stats.new_quotes_today}   color="#4C9EE8" />
                <StatCard icon={AlertCircle}  label="Pending Approval"  value={stats.pending_approvals}  color="#E8614C" />
                <StatCard icon={CheckCircle}  label="Total Bookings"    value={stats.total_bookings}     color="#4CAF50" />
                <StatCard icon={DollarSign}   label="Total Revenue (KES)" value={stats.total_revenue ? `${(stats.total_revenue/1000000).toFixed(1)}M` : '0'} />
              </div>

              {/* Pending Approvals */}
              {pendingProperties.length > 0 && (
                <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(232,97,76,0.2)', padding: '2rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <AlertCircle size={16} color="#E8614C" />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#E8614C' }}>
                      {pendingProperties.length} Properties Awaiting Approval
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {pendingProperties.slice(0, 5).map((p) => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--dark-3)', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ color: 'var(--warm-white)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{p.title}</div>
                          <div style={{ color: 'var(--gray-muted)', fontSize: '0.75rem' }}>{p.city}, {p.country} · {p.property_type}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link to={`/properties/${p.slug}`} className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                            <Eye size={12} /> Preview
                          </Link>
                          <button onClick={() => handleApprove(p.id)} className="btn btn-gold btn-sm">
                            Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Quotes */}
              {stats.recent_quotes?.length > 0 && (
                <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: '2rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>Recent Quote Requests</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                          {['Name', 'Email', 'Property', 'Type', 'Status', 'Date'].map((h) => (
                            <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--gray-muted)', fontWeight: 500, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recent_quotes.map((q) => (
                          <tr key={q.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--warm-white)' }}>{q.full_name}</td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--gray-mid)' }}>{q.email}</td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--gray-mid)' }}>{q.property_title || '—'}</td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--gray-mid)' }}>{q.inquiry_type}</td>
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
                </div>
              )}
            </motion.div>
          )}

          {activeTab !== 'Overview' && (
            <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <TrendingUp size={40} color="var(--gold)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ color: 'var(--gray-muted)' }}>
                {activeTab} management — connect to the Django admin panel or build out this tab with the API endpoints in <code style={{ color: 'var(--gold)' }}>utils/api.js</code>
              </p>
              <a href="/django-admin/" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                Open Django Admin
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}