const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SESSION_KEY = 'toshali_customer_session'

function getToken() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw).token || null
  } catch {
    return null
  }
}

async function apiFetch(path, options = {}) {
  const token = getToken()
  if (!token) throw new Error('Please log in to continue.')

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Something went wrong')
  return data
}

export const validateCheckout = () => apiFetch('/checkout/validate', { method: 'POST' })

export const createOrder = (payload) =>
  apiFetch('/orders', { method: 'POST', body: JSON.stringify(payload) })

export const createPayment = (payload) =>
  apiFetch('/payments/create', { method: 'POST', body: JSON.stringify(payload) })

export const verifyPayment = (payload) =>
  apiFetch('/payments/verify', { method: 'POST', body: JSON.stringify(payload) })

export const retryPayment = (payload) =>
  apiFetch('/payments/retry', { method: 'POST', body: JSON.stringify(payload) })

export const getOrderById = (orderId) => apiFetch(`/orders/${orderId}`)

export const getMyOrders = () => apiFetch('/orders')

export const getInvoice = (orderId) => apiFetch(`/orders/${orderId}/invoice`)

export const cancelOrder = (orderId, reason) =>
  apiFetch(`/orders/${orderId}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) })

export const updateOrderShippingAddress = (orderId, shippingAddress) =>
  apiFetch(`/orders/${orderId}/shipping-address`, {
    method: 'PATCH',
    body: JSON.stringify({ shippingAddress }),
  })

// Apply coupon against DB — validates isActive, expiry, minOrder, usageLimit
export const applyCoupon = (couponCode, subtotal) =>
  apiFetch('/coupon/apply', {
    method: 'POST',
    body: JSON.stringify({ couponCode, subtotal }),
  })

// Fetch active, non-expired coupons for checkout display (no auth needed)
export const getActiveCoupons = () =>
  fetch(`${API_BASE}/coupon/get-active`).then(async (r) => {
    const d = await r.json()
    if (!r.ok) throw new Error(d.message || 'Could not load coupons')
    return d
  })



