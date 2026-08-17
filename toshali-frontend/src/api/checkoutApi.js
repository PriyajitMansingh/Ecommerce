import axiosInstance from './axiosInstance'

export const validateCheckout = async () => {
  const { data } = await axiosInstance.post('/checkout/validate')
  return data
}

export const createOrder = async (payload) => {
  const { data } = await axiosInstance.post('/orders', payload)
  return data
}

export const createPayment = async (payload) => {
  const { data } = await axiosInstance.post('/payments/create', payload)
  return data
}

export const verifyPayment = async (payload) => {
  const { data } = await axiosInstance.post('/payments/verify', payload)
  return data
}

export const retryPayment = async (payload) => {
  const { data } = await axiosInstance.post('/payments/retry', payload)
  return data
}

export const getOrderById = async (orderId) => {
  const { data } = await axiosInstance.get(`/orders/${orderId}`)
  return data
}

export const getMyOrders = async () => {
  const { data } = await axiosInstance.get('/orders')
  return data
}

export const getInvoice = async (orderId) => {
  const { data } = await axiosInstance.get(`/orders/${orderId}/invoice`)
  return data
}

export const cancelOrder = async (orderId, reason) => {
  const { data } = await axiosInstance.post(`/orders/${orderId}/cancel`, { reason })
  return data
}

export const updateOrderShippingAddress = async (orderId, shippingAddress) => {
  const { data } = await axiosInstance.patch(`/orders/${orderId}/shipping-address`, { shippingAddress })
  return data
}

// Apply coupon against DB — validates isActive, expiry, minOrder, usageLimit
export const applyCoupon = async (couponCode, subtotal) => {
  const { data } = await axiosInstance.post('/coupon/apply', { couponCode, subtotal })
  return data
}

// Fetch active, non-expired coupons for checkout display (no auth needed)
export const getActiveCoupons = async () => {
  const { data } = await axiosInstance.get('/coupon/get-active')
  return data
}



