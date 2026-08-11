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

export const getAddresses = () => apiFetch('/address')

export const addAddress = (addressData) =>
  apiFetch('/address', { method: 'POST', body: JSON.stringify(addressData) })

export const updateAddress = (addressId, addressData) =>
  apiFetch(`/address/${addressId}`, { method: 'PATCH', body: JSON.stringify(addressData) })

export const deleteAddress = (addressId) =>
  apiFetch(`/address/${addressId}`, { method: 'DELETE' })

export const setPrimaryAddress = (addressId) =>
  apiFetch(`/address/${addressId}/primary`, { method: 'PATCH' })
