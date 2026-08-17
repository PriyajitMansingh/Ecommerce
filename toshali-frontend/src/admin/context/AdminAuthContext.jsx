import React, { createContext, useContext, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'

const AdminAuthContext = createContext(null)

const STORAGE_KEY = 'toshali_admin_session'

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Calls the DEDICATED admin-login endpoint — role check happens on the
  // SERVER now (not just in the browser), and every attempt (including
  // valid credentials from a non-Admin account) is properly audited.
  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post('/auth/admin-login', { email, password })
      const adminData = { ...data }
      delete adminData.token
      setAdmin(adminData)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(adminData))
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout')
    } catch {
      // ignore network errors
    }
    setAdmin(null)
    sessionStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated: !!admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}