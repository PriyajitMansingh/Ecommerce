// import React from 'react'
// import { Routes, Route } from 'react-router-dom'
// import Home from '../pages/Home/Home'
// import About from '../pages/About/About'
// import ProductList from '../pages/Products/ProductList'
// import Contact from '../pages/Contact/Contact'
// import CartPage from '../pages/Cart/CartPage'
// import WishlistPage from '../pages/Wishlist/WishlistPage'
// import Login from '../pages/Auth/Login'
// import Register from '../pages/Auth/Register'
// import ForgotPassword from '../pages/Auth/ForgotPassword'
// import AccountPage from '../pages/Account/AccountPage'
// import PageTransition from '../components/common/PageTransition'
// import AdminRoutes from '../admin/routes/AdminRoutes'

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/admin/*" element={<AdminRoutes />} />

//       <Route
//         path="/*"
//         element={
//           <PageTransition>
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/about" element={<About />} />
//               <Route path="/products" element={<ProductList />} />
//               <Route path="/contact" element={<Contact />} />
//               <Route path="/cart" element={<CartPage />} />
//               <Route path="/wishlist" element={<WishlistPage />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//               <Route path="/forgot-password" element={<ForgotPassword />} />
//               <Route path="/account" element={<AccountPage />} />
//             </Routes>
//           </PageTransition>
//         }
//       />
//     </Routes>
//   )
// }

// export default AppRoutes

//================================================================================================================================

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import About from '../pages/About/About'
import ProductList from '../pages/Products/ProductList'
import ProductDetail from '../pages/Products/ProductDetail'
import Contact from '../pages/Contact/Contact'
import CartPage from '../pages/Cart/CartPage'
import WishlistPage from '../pages/Wishlist/WishlistPage.jsx'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import AccountPage from '../pages/Account/AccountPage'
import GiftsIndex from '../pages/Gifts/GiftsIndex'
import GiftOccasionPage from '../pages/Gifts/GiftOccasionPage'
import PageTransition from '../components/common/PageTransition'
import AdminRoutes from '../admin/routes/AdminRoutes'
import ForgotPassword from '../pages/Auth/ForgotPassword'
import CategoryPage from '../pages/Products/CategoryPage'
import BulkOrderPage from '../pages/Bulkorder/bulkpage'
import TermsOfService from '../pages/Policy/TermsOfService.jsx'
import PrivacyPolicy from '../pages/Policy/PrivacyPolicy.jsx'
import ShippingPolicy from '../pages/Policy/ShippingPolicy.jsx'
import ReturnRefundPolicy from '../pages/Policy/ReturnRefundPolicy.jsx'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin panel — separate section, own layout/auth, not wrapped in
          the customer-facing PageTransition/Navbar/Footer chrome */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Public / customer-facing site */}
      <Route
        path="/*"
        element={
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/gifts" element={<GiftsIndex />} />
              <Route path="/gifts/:slug" element={<GiftOccasionPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/bulk-order" element={<BulkOrderPage />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
            </Routes>
          </PageTransition>
        }
      />
    </Routes>
  )
}

export default AppRoutes