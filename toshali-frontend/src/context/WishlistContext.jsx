import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

const getApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_URL  || import.meta?.env?.REACT_APP_API_URL
  return envBase ? `${envBase.replace(/\/$/, '')}/wishlist` :import.meta.env.VITE_API_URL 
}

const API_BASE_URL = getApiBaseUrl()
const SESSION_KEY = 'toshali_customer_session'
const STORAGE_KEY = 'toshali_wishlist'

const readStoredItems = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const persistItems = (items) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore storage issues
  }
}

const toastStyle = {
  style: {
    background: '#3d2a1a',
    color: '#f8f1e2',
    fontSize: '13px',
    fontWeight: 600,
    borderRadius: '10px',
    padding: '10px 16px',
  },
}

function hasSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return !!raw
  } catch {
    return false
  }
}

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || 'Failed to process wishlist request')
  }

  return data
}

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => readStoredItems())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    persistItems(items)
  }, [items])

  // Fetch wishlist on mount — only if a user token exists
  const fetchWishlist = useCallback(async () => {
    if (!hasSession()) {
      setItems(readStoredItems())
      return
    }

    try {
      setLoading(true)
      const data = await apiFetch('')
      const normalizedItems = data?.wishlist?.products || data?.products || data?.wishlist || data || []
      setItems(normalizedItems)
    } catch (error) {
      setItems(readStoredItems())
      const isAuthError = /Not authorized|token|log in|Please log in/i.test(error.message || '')
      if (isAuthError) {
        sessionStorage.removeItem(SESSION_KEY)
      } else {
        console.error('Error fetching wishlist:', error)
        toast.error('Failed to load wishlist', toastStyle)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const isInWishlist = useCallback((nameOrId) => {
    return items.some(
      (item) => item._id === nameOrId || item.name === nameOrId
    )
  }, [items])

  const addToWishlist = async (product) => {
    const productId = product._id || product.id || product.productId || product.name
    const productName = product.name

    if (!productId) {
      toast.error('Cannot add to wishlist — product ID missing.', toastStyle)
      return
    }

    if (isInWishlist(productId) || isInWishlist(productName)) {
      toast(`${productName} is already in your wishlist!`, { icon: '❤️', ...toastStyle })
      return
    }

    const previousItems = [...items]
    const fallbackItem = { ...product, productId }

    const addLocally = () => {
      setItems((prev) => [...prev, fallbackItem])
    }

    if (!hasSession()) {
      addLocally()
      toast.success(`${productName} added to wishlist`, { icon: '❤️', ...toastStyle })
      return
    }

    try {
      setItems((prev) => [...prev, fallbackItem])

      const data = await apiFetch('/add', {
        method: 'POST',
        body: JSON.stringify({ productId }),
      })

      const normalizedItems = data?.wishlist?.products || data?.products || []
      setItems(normalizedItems)

      toast.success(`${productName} added to wishlist`, { icon: '❤️', ...toastStyle })
    } catch (error) {
      setItems(previousItems)
      addLocally()
      console.error('Error adding to wishlist:', error)
      const message = error.message || 'Failed to add to wishlist'
      if (/Please log in|Not authorized|Product not found|Failed to add/i.test(message)) {
        toast.success(`${productName} added to wishlist locally`, { icon: '❤️', ...toastStyle })
      } else {
        toast.error(message, toastStyle)
      }
    }
  }

  const removeFromWishlist = async (nameOrId) => {
    const productToRemove = items.find(
      (item) => item._id === nameOrId || item.name === nameOrId || item.productId === nameOrId
    )

    if (!productToRemove) return

    const previousItems = [...items]
    const removeLocally = () => {
      setItems((prev) => prev.filter(
        (item) => (item._id || item.productId || item.id || item.name) !== nameOrId && item.name !== nameOrId
      ))
    }

    try {
      removeLocally()

      const productId = productToRemove._id || productToRemove.id || productToRemove.productId

      if (!productId || !hasSession()) {
        toast(`${productToRemove.name} removed from wishlist`, { icon: '💔', ...toastStyle })
        return
      }

      const data = await apiFetch(`/${productId}`, { method: 'DELETE' })
      const normalizedItems = data?.wishlist?.products || data?.products || []
      setItems(normalizedItems)

      toast(`${productToRemove.name} removed from wishlist`, { icon: '💔', ...toastStyle })
    } catch (error) {
      setItems(previousItems)
      removeLocally()
      console.error('Error removing from wishlist:', error)
      toast.error(error.message || 'Failed to remove from wishlist', toastStyle)
    }
  }

  const toggleWishlist = async (product) => {
    const productId = product._id || product.id
    const productName = product.name
    if (isInWishlist(productId) || isInWishlist(productName)) {
      await removeFromWishlist(productId || productName)
    } else {
      await addToWishlist(product)
    }
  }

  const wishlistCount = items.length

  const value = {
    items,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    wishlistCount,
    loading,
    refetchWishlist: fetchWishlist,
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}