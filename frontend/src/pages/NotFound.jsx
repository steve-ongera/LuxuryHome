import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, Home, Building2, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 – Page Not Found | LuxuryHome</title>
        <meta name="description" content="The page you're looking for doesn't exist. Browse our luxury properties or return to the LuxuryHome homepage." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="not-found-page" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--gray-50)',
        padding: 'var(--spacing-8) var(--spacing-4)',
        textAlign: 'center',
      }}>
        <motion.div
          className="not-found-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            maxWidth: '560px',
            width: '100%',
          }}
        >
          {/* Decorative Icon */}
          <div className="not-found-icon" style={{
            marginBottom: 'var(--spacing-6)',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: 'var(--red-tint)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}>
              <AlertCircle size={60} color="var(--primary-red)" strokeWidth={1.5} />
            </div>
          </div>

          {/* Big 404 */}
          <div className="not-found-number" style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'clamp(6rem, 20vw, 12rem)',
            fontWeight: 800,
            lineHeight: 1,
            color: 'var(--primary-red)',
            opacity: 0.15,
            marginBottom: 'var(--spacing-4)',
            userSelect: 'none',
            letterSpacing: '-0.05em',
          }}>
            404
          </div>

          <div className="not-found-label" style={{
            marginBottom: 'var(--spacing-4)',
          }}>
            <span className="badge badge-primary" style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              padding: 'var(--spacing-2) var(--spacing-6)',
              background: 'var(--primary-red)',
              color: 'var(--white)',
              borderRadius: 'var(--radius-full)',
            }}>
              Page Not Found
            </span>
          </div>

          <h1 className="not-found-title" style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'clamp(1.5rem, 3vw, var(--text-3xl))',
            fontWeight: 700,
            marginBottom: 'var(--spacing-4)',
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}>
            This address doesn't exist<br />in our portfolio
          </h1>

          <p className="not-found-description" style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-base)',
            maxWidth: '380px',
            margin: '0 auto var(--spacing-8)',
            lineHeight: 1.7,
          }}>
            The page you're looking for may have been removed, renamed, 
            or is temporarily unavailable.
          </p>

          <div className="not-found-actions" style={{
            display: 'flex',
            gap: 'var(--spacing-4)',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <Link 
              to="/" 
              className="btn btn-primary" 
              style={{ 
                display: 'inline-flex', 
                gap: 'var(--spacing-2)', 
                alignItems: 'center',
                minWidth: '160px',
                justifyContent: 'center',
              }}
            >
              <ArrowLeft size={16} />
              Return Home
            </Link>
            <Link 
              to="/properties" 
              className="btn btn-outline" 
              style={{ 
                display: 'inline-flex', 
                gap: 'var(--spacing-2)', 
                alignItems: 'center',
                minWidth: '160px',
                justifyContent: 'center',
              }}
            >
              <Search size={16} />
              Browse Properties
            </Link>
          </div>

          {/* Quick Links */}
          <div className="not-found-quick-links" style={{
            marginTop: 'var(--spacing-12)',
            paddingTop: 'var(--spacing-8)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--spacing-6)',
            flexWrap: 'wrap',
          }}>
            <Link 
              to="/" 
              className="quick-link" 
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                transition: 'color var(--duration-fast) var(--ease-smooth)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Home size={14} /> Home
            </Link>
            <Link 
              to="/properties" 
              className="quick-link" 
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                transition: 'color var(--duration-fast) var(--ease-smooth)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Building2 size={14} /> Properties
            </Link>
            <Link 
              to="/contact" 
              className="quick-link" 
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                transition: 'color var(--duration-fast) var(--ease-smooth)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Contact Support
            </Link>
          </div>

          {/* Error Code */}
          <div className="not-found-error-code" style={{
            marginTop: 'var(--spacing-6)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-family)',
            letterSpacing: '0.05em',
          }}>
            Error 404 • Page Not Found
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 599px) {
          .not-found-page {
            padding: var(--spacing-6) var(--spacing-4) !important;
          }
          .not-found-icon {
            margin-bottom: var(--spacing-4) !important;
          }
          .not-found-icon div {
            width: 80px !important;
            height: 80px !important;
          }
          .not-found-icon svg {
            width: 40px !important;
            height: 40px !important;
          }
          .not-found-number {
            font-size: clamp(4rem, 15vw, 8rem) !important;
          }
          .not-found-title {
            font-size: var(--text-xl) !important;
          }
          .not-found-description {
            font-size: var(--text-sm) !important;
          }
          .not-found-actions {
            flex-direction: column !important;
            align-items: center !important;
          }
          .not-found-actions .btn {
            width: 100% !important;
            max-width: 240px !important;
          }
          .not-found-quick-links {
            flex-direction: column !important;
            align-items: center !important;
            gap: var(--spacing-3) !important;
          }
        }

        @media (max-width: 374px) {
          .not-found-page {
            padding: var(--spacing-4) var(--spacing-3) !important;
          }
          .not-found-icon div {
            width: 60px !important;
            height: 60px !important;
          }
          .not-found-icon svg {
            width: 30px !important;
            height: 30px !important;
          }
          .not-found-number {
            font-size: clamp(3rem, 12vw, 6rem) !important;
          }
          .not-found-label .badge {
            font-size: var(--text-xs) !important;
            padding: var(--spacing-1) var(--spacing-4) !important;
          }
        }

        /* Animation for the 404 number */
        .not-found-number {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.02);
          }
        }

        /* Decorative icon animation */
        .not-found-icon div {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        /* Quick links hover underline effect */
        .quick-link {
          position: relative;
          text-decoration: none;
        }

        .quick-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary-red);
          transition: width var(--duration-normal) var(--ease-smooth);
        }

        .quick-link:hover::after {
          width: 100%;
        }

        /* Card hover effect for the entire content */
        .not-found-content {
          background: var(--white);
          padding: var(--spacing-12) var(--spacing-8);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          transition: all var(--duration-normal) var(--ease-smooth);
        }

        .not-found-content:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }

        @media (max-width: 599px) {
          .not-found-content {
            padding: var(--spacing-8) var(--spacing-4) !important;
          }
        }

        @media (max-width: 374px) {
          .not-found-content {
            padding: var(--spacing-6) var(--spacing-3) !important;
          }
        }
      `}</style>
    </>
  )
}