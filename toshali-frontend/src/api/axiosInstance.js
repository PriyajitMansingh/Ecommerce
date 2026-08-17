import axios from 'axios'

// Central place for the backend's base URL. Change this ONE line if the
// backend ever runs on a different port/host (e.g. after deployment).
const API_BASE_URL = import.meta.env.VITE_API_URL 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const savedSession = sessionStorage.getItem('toshali_customer_session')
  if (!savedSession) return config

  try {
    const { token } = JSON.parse(savedSession) || {}
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (error) {
    // Keep request unchanged if parsing fails
  }

  return config
})

export default axiosInstance