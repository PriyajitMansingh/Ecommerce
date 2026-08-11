import React, { createContext, useContext, useState, useCallback } from 'react'
import axiosInstance from '../api/axiosInstance'

const AuthContext = createContext(null)
const STORAGE_KEY = 'toshali_customer_session'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const saveSession = useCallback((userData) => {
    setUser((prev) => {
      const merged = { ...prev, ...userData }
      // Don't keep a stale token field if backend uses cookies only
      if (merged.token === undefined && prev?.token) {
        // optional: delete merged.token
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      return merged
    })
  }, [])

  const register = useCallback(async (payload) => {
    try {
      const { data } = await axiosInstance.post('/auth/register', payload)
      saveSession(data)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      return { success: false, message }
    }
  }, [saveSession])

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await axiosInstance.post('/auth/login', { email, password })
      saveSession(data)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      return { success: false, message }
    }
  }, [saveSession])

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/auth/logout') // clears httpOnly cookie
    } catch {
      // ignore network errors on logout
    }
    setUser(null)
    sessionStorage.removeItem(STORAGE_KEY)
  }, [])

  // Stable reference — critical to avoid AccountPage effect loop
  const fetchFullProfile = useCallback(async () => {
    try {
      // Cookie is sent automatically if axios has withCredentials: true
      const { data } = await axiosInstance.get('/account/profile')
      saveSession(data)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to load profile.' }
    }
  }, [saveSession])

  const updateProfile = useCallback(async (payload) => {
    try {
      const { data } = await axiosInstance.put('/account/profile', payload)
      saveSession(data)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile.'
      return { success: false, message }
    }
  }, [saveSession])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        fetchFullProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}