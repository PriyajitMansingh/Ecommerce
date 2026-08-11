import React from 'react'
import { useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import Footer from './components/layout/Footer'
import AlsoAvailableOn from './components/layout/AlsoAvailableOn'
import RecentSalesNotification from './components/home/RecentSalesNotification'
import WhatsAppButton from './components/home/WhatsAppButton'
import ScrollToTop from './components/common/ScrollToTop'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="App">
            <ScrollToTop />
            <AppRoutes />
            {/* Customer-site-only chrome — never shown inside the admin panel */}
            {!isAdminRoute && (
              <>
                <AlsoAvailableOn />
                <Footer />
                {/* <RecentSalesNotification /> */}
                <WhatsAppButton />
              </>
            )}
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App