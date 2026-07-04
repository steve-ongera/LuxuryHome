import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()

  // Close any open drawers when route changes
  useEffect(() => {
    // This will trigger any drawer state resets in Navbar
    // via the location change effect already in Navbar
  }, [location])

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}