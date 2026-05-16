import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, MessageSquare, Hotel, User, LogOut, Settings } from 'lucide-react'
import { propertiesAPI, quotesAPI, hotelsAPI, authAPI, extractError } from '../../utils/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { toast } from 'react-toastify'
import PropertyCard from '../../components/property/PropertyCard.jsx'

const TABS = ['Favorites', 'My Quotes', 'Bookings', 'Profile']

export default function UserDashboard() {
  const { user, logout, updateProfile } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [quotes, setQuotes] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Favorites')
  const [profileForm, setProfileForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', phone: user?.phone || '', bio: user?.bio || '' })
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    Promise.all([
      propertiesAPI.favorites(),
      quotesAPI.myQuotes(),
      hotelsAPI.myBookings(),
    ]).then(([f, q, b]) => {
      setFavorites(f.data?.results || f.data || [])
      setQuotes(q.data?.results || q.data || [])
      setBookings(b.data?.results || b.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await updateProfile(profileForm)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setSavingProfile(false)
    }
  }

  if (loading) return (
    <div className="loader-wrap" style={{ minHeight: '100vh', paddingTop: '6rem' }}><div className="loader-ring" /></div>
  )

  return (
    <>
      <Helmet><title>My Account | LuxuryHome</title></Helmet>

      <div style={{ paddingTop: '6rem', minHeight: '100vh', background: 'var(--black)' }}>
        <div className="container" style={{ padding: '2rem clamp(1rem,4vw,2.5rem)' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--dark-3)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {user?.avatar
                  ? <img src={user.avatar} alt={user.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <User size={28} color="var(--gold)" />
                }
              </div>
              <div>
                <div className="section-label" style={{ marginBottom: '0.2rem' }}>My Account</div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2rem)' }}>
                  {user?.first_name} {user?.last_name}
                </h1>
                <p style={{ color: 'var(--gray-muted)', fontSize: '0.8rem' }}>{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="btn btn-ghost btn-sm" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.04)', marginBottom: '2.5rem' }}>
            {[
              { icon: Heart,         label: 'Saved Properties', value: favorites.length },
              { icon: MessageSquare, label: 'Quote Requests',    value: quotes.length },
              { icon: Hotel,         label: 'Hotel Bookings',    value: bookings.length },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ background: 'var(--dark-2)', padding: '1.5rem', textAlign: 'center' }}>
                <Icon size={20} color="var(--gold)" style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--warm-white)' }}>{value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--gray-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.3rem' }}>{label}</div>
              </div>
            ))}
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

          {/* Favorites */}
          {activeTab === 'Favorites' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {favorites.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Heart size={40} color="var(--gold)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                  <p style={{ color: 'var(--gray-muted)', marginBottom: '1.5rem' }}>No saved properties yet.</p>
                  <Link to="/properties" className="btn btn-outline btn-sm">Browse Properties</Link>
                </div>
              ) : (
                <div className="grid-3">
                  {favorites.map((fav) => <PropertyCard key={fav.id} property={fav.property} />)}
                </div>
              )}
            </motion.div>
          )}

          {/* Quotes */}
          {activeTab === 'My Quotes' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your Quote Requests</h3>
                {quotes.length === 0 ? (
                  <p style={{ color: 'var(--gray-muted)', textAlign: 'center', padding: '2rem' }}>No quote requests yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {quotes.map((q) => (
                      <div key={q.id} style={{ padding: '1.25rem', background: 'var(--dark-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ color: 'var(--warm-white)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                            {q.property_title || q.hotel_name || 'General Enquiry'}
                          </div>
                          <div style={{ color: 'var(--gray-muted)', fontSize: '0.75rem' }}>
                            {q.inquiry_type} · {new Date(q.created_at).toLocaleDateString()}
                          </div>
                          {q.agent_response && (
                            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', fontSize: '0.82rem', color: 'var(--gray-mid)', borderLeft: '3px solid var(--gold)' }}>
                              <span style={{ fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Agent Response</span>
                              {q.agent_response}
                            </div>
                          )}
                        </div>
                        <span style={{ padding: '0.25rem 0.75rem', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: q.status === 'new' ? 'rgba(76,158,232,0.15)' : q.status === 'responded' ? 'rgba(76,175,80,0.15)' : 'rgba(201,168,76,0.1)', color: q.status === 'new' ? '#4C9EE8' : q.status === 'responded' ? '#4CAF50' : 'var(--gold)' }}>
                          {q.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Bookings */}
          {activeTab === 'Bookings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>Hotel Bookings</h3>
                {bookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--gray-muted)', marginBottom: '1.5rem' }}>No hotel bookings yet.</p>
                    <Link to="/hotels" className="btn btn-outline btn-sm">Browse Hotels</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {bookings.map((b) => (
                      <div key={b.id} style={{ padding: '1.25rem', background: 'var(--dark-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ color: 'var(--warm-white)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{b.hotel_name}</div>
                          <div style={{ color: 'var(--gray-muted)', fontSize: '0.75rem' }}>
                            {b.room_name} · {b.check_in} → {b.check_out} · {b.nights} nights
                          </div>
                          <div style={{ color: 'var(--gold)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                            {b.currency} {Number(b.total_price).toLocaleString()}
                          </div>
                        </div>
                        <span style={{ padding: '0.25rem 0.75rem', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: b.status === 'confirmed' ? 'rgba(76,175,80,0.15)' : 'rgba(201,168,76,0.1)', color: b.status === 'confirmed' ? '#4CAF50' : 'var(--gold)' }}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Profile */}
          {activeTab === 'Profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(201,168,76,0.15)', padding: '2.5rem', maxWidth: '540px' }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '2rem' }}>
                  <Settings size={16} color="var(--gold)" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Edit Profile</h3>
                </div>
                <form onSubmit={handleSaveProfile}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input className="form-input" value={profileForm.first_name}
                        onChange={(e) => setProfileForm((f) => ({ ...f, first_name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input className="form-input" value={profileForm.last_name}
                        onChange={(e) => setProfileForm((f) => ({ ...f, last_name: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" type="tel" value={profileForm.phone}
                      onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea className="form-textarea" rows={4} value={profileForm.bio}
                      placeholder="Tell us a bit about yourself…"
                      onChange={(e) => setProfileForm((f) => ({ ...f, bio: e.target.value }))} />
                  </div>
                  <div style={{ padding: '0.75rem 1rem', background: 'var(--dark-3)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'var(--gray-muted)' }}>
                    Email: <span style={{ color: 'var(--warm-white)' }}>{user?.email}</span>
                    <span style={{ marginLeft: '1rem', color: user?.is_verified ? '#4CAF50' : '#E8614C', fontSize: '0.72rem' }}>
                      {user?.is_verified ? '✓ Verified' : '✗ Unverified'}
                    </span>
                  </div>
                  <button type="submit" className="btn btn-gold" disabled={savingProfile}
                    style={{ justifyContent: 'center', padding: '0.9rem 2.5rem' }}>
                    {savingProfile ? 'Saving…' : 'Save Changes'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}