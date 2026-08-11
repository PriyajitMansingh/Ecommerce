import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminAuthProvider, useAdminAuth } from '../context/AdminAuthContext'
import AdminLayout from '../layouts/AdminLayout'
import AdminLogin from '../pages/AdminLogin'
import AdminDashboard from '../pages/AdminDashboard'
import AdminProducts from '../pages/AdminProducts'
import AdminProductForm from '../pages/AdminProductForm'
import AdminOrders from '../pages/AdminOrders'
import AdminOrderDetail from '../pages/AdminOrderDetail'
import AdminBulkorder from '../pages/AdminBulkorder'
import AdminGiftOccasions from '../pages/AdminGiftOccasions'
import AdminGiftProducts from '../pages/AdminGiftProducts'
import AdminCoupons from '../pages/CouponsPage.jsx'

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated } = useAdminAuth()
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

const AdminRoutesInner = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />

      <Route
        path="/"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
        <Route path="bulk-orders" element={<AdminBulkorder />} />
        <Route path="gift-occasions" element={<AdminGiftOccasions />} />
        <Route path="gift-occasions/:occasionId/products" element={<AdminGiftProducts />} />
        <Route path="coupons" element={<AdminCoupons />} />
      </Route>
    </Routes>
  )
}

const AdminRoutes = () => (
  <AdminAuthProvider>
    <AdminRoutesInner />
  </AdminAuthProvider>
)

export default AdminRoutes
