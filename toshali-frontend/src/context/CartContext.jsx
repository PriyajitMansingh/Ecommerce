
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const SESSION_KEY = 'toshali_customer_session'
const STORAGE_KEY = 'toshali_cart'

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

async function apiFetch(method, path, body = null) {
  try {
    const res = await axiosInstance({ method, url: path, data: body })
    return res.data
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Something went wrong'
    throw new Error(message)
  }
}

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState(() => readStoredItems())
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const isSyncingRef = useRef(false)
  const prevAuthRef = useRef(isAuthenticated)

  // Persist guest cart to sessionStorage only when NOT authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      persistItems(items)
    }
  }, [items, isAuthenticated])

  // React to login/logout state transitions
  useEffect(() => {
    const syncCart = async () => {
      if (!isAuthenticated) {
        if (prevAuthRef.current) {
          // Explicit logout transition: clear guest storage and reset React state
          sessionStorage.removeItem(STORAGE_KEY)
          setItems([])
        } else {
          // Guest browsing: load guest items from storage
          setItems(readStoredItems())
        }
        setLoading(false)
        prevAuthRef.current = false
        return
      }

      // User is authenticated
      const storedGuestItems = readStoredItems()

      // If user just logged in (or has guest items stored) and sync is not already running
      if (storedGuestItems.length > 0 && !isSyncingRef.current) {
        isSyncingRef.current = true
        setLoading(true)

        try {
          // Send minimal secure payload
          const minimalPayload = storedGuestItems.map((item) => ({
            productId: item.productId || item._id || item.id,
            quantity: item.quantity,
            productType: item.productType || 'product',
          }))

          const data = await apiFetch('post', '/cart/merge', { items: minimalPayload })

          // Clear guest sessionStorage ONLY AFTER merge API call succeeds
          sessionStorage.removeItem(STORAGE_KEY)
          setItems(data.cart?.items || [])
        } catch (err) {
          if (/Not authorized|no token/i.test(err.message || '')) {
            // Stale customer session key without valid cookie token -> clean up stale session key silently
            sessionStorage.removeItem(SESSION_KEY)
            setItems(storedGuestItems)
          } else {
            console.error('Cart merge error:', err)
            try {
              const data = await apiFetch('get', '/cart')
              setItems(data.items || [])
            } catch {
              setItems(storedGuestItems)
            }
          }
        } finally {
          isSyncingRef.current = false
          setLoading(false)
        }
      } else if (!isSyncingRef.current) {
        // Logged in with no guest items to merge, load MongoDB cart
        setLoading(true)
        apiFetch('get', '/cart')
          .then((data) => setItems(data.items || []))
          .catch((err) => {
            if (/Not authorized|no token/i.test(err.message || '')) {
              sessionStorage.removeItem(SESSION_KEY)
            }
            setItems(readStoredItems())
          })
          .finally(() => setLoading(false))
      }

      prevAuthRef.current = true
    }

    syncCart()
  }, [isAuthenticated])

  // Clickable "added to cart" toast — tapping it (or the cart icon) goes to /cart
  const showAddedToCartToast = useCallback((productName) => {
    toast.custom(
      (t) => (
        <div
          onClick={() => {
            toast.dismiss(t.id)
            navigate('/cart')
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toast.dismiss(t.id)
              navigate('/cart')
            }
          }}
          className={`flex items-center gap-3 bg-[#3d2a1a] text-[#f8f1e2] rounded-xl px-4 py-3 shadow-lg cursor-pointer select-none transition-all duration-200 hover:bg-[#2b1d14] hover:shadow-xl ${
            t.visible ? 'animate-in fade-in slide-in-from-top-2' : 'opacity-0'
          }`}
          style={{ minWidth: '260px', maxWidth: '320px' }}
        >
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-[#3d2a1a]" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6" />
            </svg>
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold truncate">{productName}</p>
            <p className="text-[11px] text-[#f8f1e2]/70">Added to cart · Tap to view</p>
          </div>

          <svg className="w-4 h-4 flex-shrink-0 text-[#f8f1e2]/60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      ),
      { duration: 3000 }
    )
  }, [navigate])

  const addToCart = useCallback(async (product, quantity = 1, productType = 'product') => {
    const productId = product._id || product.id || product.productId || product.name
    const fallbackItem = {
      ...product,
      productId,
      productType,
      quantity,
      price: product.price || 0,
      imageUrl: product.imageUrl || product.image || '',
    }

    const addLocally = () => {
      setItems((prev) => {
        const existing = prev.find((item) => (item.productId || item._id || item.id || item.name) === productId && (item.productType || 'product') === productType)
        if (existing) {
          return prev.map((item) =>
            (item.productId || item._id || item.id || item.name) === productId && (item.productType || 'product') === productType
              ? { ...item, quantity: item.quantity + quantity, price: item.price || product.price || 0 }
              : item
          )
        }
        return [...prev, fallbackItem]
      })
    }

    if (!hasSession()) {
      addLocally()
      showAddedToCartToast(product.name)
      return
    }

    try {
      const data = await apiFetch('post', '/cart/add', { productId, quantity, productType })
      setItems(data.cart?.items || [])
      showAddedToCartToast(product.name)
    } catch (err) {
      addLocally()
      const message = err?.message || 'Unable to sync cart right now.'
      if (!/Please log in|Not authorized|Product not found|Failed to add/i.test(message)) {
        toast.error(message, toastStyle)
      } else {
        showAddedToCartToast(product.name)
      }
    }
  }, [showAddedToCartToast])

  const removeFromCart = useCallback(async (productId, name) => {
    const removeLocally = () => {
      setItems((prev) => prev.filter((item) => (item.productId || item._id || item.id || item.name) !== productId))
    }

    if (!hasSession()) {
      removeLocally()
      toast(`${name} removed from cart`, { icon: '🗑️', ...toastStyle })
      return
    }

    try {
      const data = await apiFetch('delete', `/cart/${productId}`)
      setItems(data.cart?.items || [])
      toast(`${name} removed from cart`, { icon: '🗑️', ...toastStyle })
    } catch (err) {
      removeLocally()
      toast.error(err.message || 'Unable to remove from cart right now.', toastStyle)
    }
  }, [])

  const updateQuantity = useCallback(async (productId, name, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, name)
      return
    }

    const updateLocally = () => {
      setItems((prev) => prev.map((item) => ((item.productId || item._id || item.id || item.name) === productId ? { ...item, quantity } : item)))
    }

    if (!hasSession()) {
      updateLocally()
      return
    }

    try {
      const data = await apiFetch('put', `/cart/${productId}`, { quantity })
      setItems(data.cart?.items || [])
    } catch (err) {
      updateLocally()
      toast.error(err.message || 'Unable to update cart right now.', toastStyle)
    }
  }, [removeFromCart])

  const clearCart = useCallback(async () => {
    if (!hasSession()) {
      setItems([])
      return
    }

    try {
      await apiFetch('delete', '/cart')
      setItems([])
    } catch {
      setItems([])
    }
  }, [])

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, loading, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}