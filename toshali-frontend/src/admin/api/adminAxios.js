import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const adminAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Automatically attach the Admin's JWT token (from sessionStorage) to
// every request this instance makes — so admin API calls never need to
// manually set the Authorization header each time.
adminAxios.interceptors.request.use((config) => {
  try {
    const saved = sessionStorage.getItem('toshali_admin_session')
    if (saved) {
      const { token } = JSON.parse(saved)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
  } catch {
    // no-op — request goes out without a token, backend will reject with 401
  }
  return config
})

export default adminAxios