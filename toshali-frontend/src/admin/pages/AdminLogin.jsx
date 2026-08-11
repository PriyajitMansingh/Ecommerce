import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAdminAuth } from '../context/AdminAuthContext'
import logo from '../../assets/images/logo.png'
import almondLoose from '../../assets/images/almond-loose.png'
import cashewLoose from '../../assets/images/cashew-loose.png'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { login } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      toast.success('Welcome back, Admin!', {
        style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
      })
      navigate('/admin')
    } else {
      const message = result.message || 'Invalid credentials.'
      setError(message)
      toast.error(message, {
        style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
      })
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT — brand panel, hidden on mobile */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-[#3d2a1a] via-[#2b1d14] to-[#1f150e] flex-col items-center justify-center px-12 overflow-hidden">
        <img src={almondLoose} alt="" className="absolute top-16 left-10 w-28 opacity-20 rotate-[-15deg] pointer-events-none" />
        <img src={cashewLoose} alt="" className="absolute bottom-16 right-10 w-28 opacity-20 rotate-[12deg] pointer-events-none" />

        {/* Logo on a solid white badge so it's always clearly visible */}
        <div className="bg-white rounded-2xl p-5 shadow-2xl mb-8 relative z-10">
          <img src={logo} alt="House of Toshali" className="h-16 w-auto object-contain" />
        </div>

        <h1 className="font-serif text-3xl text-white text-center leading-tight mb-4 relative z-10">
          House of Toshali
        </h1>
        <p className="text-white/60 text-sm text-center max-w-xs relative z-10">
          Admin Panel — manage products, stock and orders in one place.
        </p>

        <div className="absolute bottom-8 left-0 right-0 text-center">
          <span className="text-white/30 text-xs tracking-wide">UI Preview · Backend Integration Pending</span>
        </div>
      </div>

      {/* RIGHT — sign-in form */}
      <div className="flex items-center justify-center bg-[#FBF9F2] px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo shown only on mobile, since the brand panel is hidden there */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <img src={logo} alt="House of Toshali" className="h-14 w-auto object-contain" />
            </div>
          </div>

          <div className="mb-8">
            <span className="inline-flex items-center gap-2 mb-4 bg-[#F3E4C8] px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]" />
              <span className="text-[11px] font-bold text-[#B8860B] tracking-[0.15em] uppercase">Admin Access</span>
            </span>
            <h2 className="font-serif text-3xl text-[#3d2a1a] mb-2">Welcome back</h2>
            <p className="text-sm text-[#6b5940]">Sign in to manage your store.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-medium px-4 py-3 rounded-lg mb-5 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-[#3d2a1a] mb-2 block">Email Address</label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89c8a]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@houseoftoshali.com"
                  className="w-full border border-[#3d2a1a]/15 bg-white rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3d2a1a] mb-2 block">Password</label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89c8a]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 118 0v4" />
                </svg>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-[#3d2a1a]/15 bg-white rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3d2a1a] text-white font-bold text-sm py-3.5 rounded-xl hover:bg-[#2b1d14] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  Sign In
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#a89c8a] text-xs mt-8">
            Authorized personnel only · House of Toshali
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin