import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Helmet><title>404 – Page Not Found | LuxuryHome</title></Helmet>

      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--dark)',
        padding: '2rem', textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Big 404 */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(8rem, 25vw, 16rem)',
            fontWeight: 300,
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(201,168,76,0.25)',
            marginBottom: '0.5rem',
            userSelect: 'none',
          }}>
            404
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
            }}>
              Page Not Found
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 400,
            marginBottom: '1rem',
            color: 'var(--warm-white)',
          }}>
            This address doesn't exist<br />in our portfolio
          </h1>

          <p style={{
            color: 'var(--gray-muted)',
            fontSize: '0.9rem',
            maxWidth: '380px',
            margin: '0 auto 3rem',
            lineHeight: 1.7,
          }}>
            The page you're looking for may have been removed, renamed, or is temporarily unavailable.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-gold" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
              <ArrowLeft size={15} />
              Return Home
            </Link>
            <Link to="/properties" className="btn btn-ghost" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
              <Search size={15} />
              Browse Properties
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}