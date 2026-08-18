import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
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
  const [loading, setLoading] = useState(true)

  const checkAdminAuth = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/auth/admin-me')
      if (data?.user && data.user.role === 'Admin') {
        const adminData = { ...data.user }
        delete adminData.token
        setAdmin(adminData)
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(adminData))
      } else {
        setAdmin(null)
        sessionStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      setAdmin(null)
      sessionStorage.removeItem(STORAGE_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAdminAuth()
  }, [checkAdminAuth])

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
    <AdminAuthContext.Provider value={{ admin, isAuthenticated: !!admin, loading, logout, checkAdminAuth }}>
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