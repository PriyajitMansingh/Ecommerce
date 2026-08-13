import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/images/logo.png'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
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

    // if (result.success) {
    //   toast.success('Welcome back!', {
    //     icon: '👋',
    //     style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
    //   })
    //   // Always land on the Home page after login — it looks completely
    //   // different from the Login form (Hero slider, colors, products),
    //   // so it's immediately obvious the page actually changed.
    //   navigate('/', { replace: true })
    // }
    if (result.success) {
  toast.success('Welcome back!', {
    icon: '👋',
    style: {
      background: '#3d2a1a',
      color: '#f8f1e2',
      fontSize: '13px',
      fontWeight: 600,
      borderRadius: '10px',
    },
  })

  if (result.user?.role === 'Admin') {
    navigate('/admin', { replace: true })
  } else {
    navigate('/', { replace: true })
  }
}
     else {
      setError(result.message)
      toast.error(result.message, {
        style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
      })
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] bg-[#FBF9F2] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="House of Toshali" className="h-16 w-auto object-contain" />
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-[#3d2a1a]/10 p-8">
            <h1 className="font-serif text-2xl text-[#3d2a1a] text-center mb-1">Welcome Back</h1>
            <p className="text-xs text-[#a89c8a] text-center mb-6">Sign in to your account</p>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-medium px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3d2a1a] mb-1.5 block">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-[#3d2a1a]/15 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3d2a1a] mb-1.5 block">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-[#3d2a1a]/15 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <div className="text-right mt-1.5">
                  <Link to="/forgot-password" className="text-xs text-[#B8860B] hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3d2a1a] text-white font-bold text-sm py-3.5 rounded-lg hover:bg-[#2b1d14] hover:shadow-lg transition-all disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-[#6b5940] mt-6">
              New here?{' '}
              <Link to="/register" className="text-[#B8860B] font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login