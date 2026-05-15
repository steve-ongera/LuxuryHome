import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'

import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './styles/main.css'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <ToastContainer
            position="bottom-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastStyle={{
              background: '#1A1A1A',
              color: '#F5F0E8',
              border: '1px solid #C9A84C33',
              fontFamily: "'Jost', sans-serif",
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)