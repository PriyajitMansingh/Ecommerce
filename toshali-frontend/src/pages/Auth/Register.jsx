import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosInstance'
import logo from '../../assets/images/logo.png'

const SECURITY_QUESTIONS = ['Favorite Food', 'Favorite Color', 'Favorite Birth Place']

const toastStyle = {
  style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
}

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    name: '', email: '', countryCode: '+91', mobile: '', password: '',
    addressLine1: '', addressLine2: '', pincode: '', city: '', state: '', country: '',
  })
  const [answers, setAnswers] = useState({ 'Favorite Food': '', 'Favorite Color': '', 'Favorite Birth Place': '' })

  const [countryCodes, setCountryCodes] = useState([])
  const [pincodeLoading, setPincodeLoading] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch the country-code list from the backend (per requirement — served
  // from the API, not hardcoded in the frontend).
  useEffect(() => {
    axiosInstance
      .get('/utils/country-codes')
      .then(({ data }) => setCountryCodes(data))
      .catch(() => setCountryCodes([{ name: 'India', code: 'IN', dialCode: '+91' }]))
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAnswerChange = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question]: value }))
  }

  // As soon as the user finishes typing a 6-digit pincode, auto-fill
  // city/state/country from the backend (which calls the postal API).
  const handlePincodeChange = async (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, pincode: value }))

    if (/^\d{6}$/.test(value)) {
      setPincodeLoading(true)
      try {
        const { data } = await axiosInstance.get(`/utils/pincode/${value}`)
        setForm((prev) => ({ ...prev, city: data.city, state: data.state, country: data.country }))
        toast.success('Address auto-filled from pincode', { icon: '📍', ...toastStyle })
      } catch {
        toast.error('Could not find details for this pincode. Please fill manually.', toastStyle)
      } finally {
        setPincodeLoading(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (SECURITY_QUESTIONS.some((q) => !answers[q]?.trim())) {
      setError('Please answer all 3 security questions.')
      return
    }

    setLoading(true)
    const result = await register({
      ...form,
      securityAnswers: answers,
    })
    setLoading(false)

    if (result.success) {
      toast.success(`Welcome to House of Toshali, ${form.name.split(' ')[0]}!`, { icon: '🎉', ...toastStyle })
      navigate('/', { replace: true })
    } else {
      setError(result.message)
      toast.error(result.message, toastStyle)
    }
  }

  const inputClass = "w-full border border-[#3d2a1a]/15 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]"
  const labelClass = "text-xs font-semibold text-[#3d2a1a] mb-1.5 block"

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] bg-[#FBF9F2] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="House of Toshali" className="h-16 w-auto object-contain" />
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-[#3d2a1a]/10 p-8">
            <h1 className="font-serif text-2xl text-[#3d2a1a] text-center mb-1">Create Account</h1>
            <p className="text-xs text-[#a89c8a] text-center mb-6">Join House of Toshali</p>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-medium px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ===== Basic Info ===== */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide">Basic Information</p>
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Mobile Number *</label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={form.countryCode}
                      onChange={handleChange}
                      className="w-24 flex-shrink-0 border border-[#3d2a1a]/15 rounded-lg px-2 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.dialCode}>{c.dialCode}</option>
                      ))}
                    </select>
                    <input
                      type="tel" name="mobile" required value={form.mobile} onChange={handleChange}
                      placeholder="98765 43210" className={`${inputClass} flex-1`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Password *</label>
                  <input
                    type="password" name="password" required minLength={6} value={form.password} onChange={handleChange}
                    placeholder="At least 6 characters" className={inputClass}
                  />
                </div>
              </div>

              {/* ===== Address ===== */}
              <div className="space-y-4 border-t border-[#3d2a1a]/10 pt-5">
                <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide">Address</p>
                <div>
                  <label className={labelClass}>Address Line 1</label>
                  <input type="text" name="addressLine1" value={form.addressLine1} onChange={handleChange} placeholder="House no., building, street" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Address Line 2</label>
                  <input type="text" name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Landmark, area (optional)" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>
                    Pincode {pincodeLoading && <span className="text-[#B8860B]">(fetching...)</span>}
                  </label>
                  <input
                    type="text" name="pincode" value={form.pincode} onChange={handlePincodeChange}
                    placeholder="6-digit pincode" maxLength={6} className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="Auto-filled" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="Auto-filled" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input type="text" name="country" value={form.country} onChange={handleChange} placeholder="Auto-filled" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* ===== Security Questions ===== */}
              <div className="space-y-4 border-t border-[#3d2a1a]/10 pt-5">
                <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide">Security Questions</p>

                {/* Professional warning banner — exactly what was requested */}
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 9v4M12 17h.01M10.29 3.86l-8.18 14.14A1 1 0 003 19.5h18a1 1 0 00.89-1.5L13.71 3.86a1 1 0 00-1.72 0z" />
                  </svg>
                  <p className="text-xs text-red-700 leading-relaxed">
                    <span className="font-bold">Please remember these answers carefully.</span> If you ever
                    forget your password, you'll need to answer these exact questions to reset it. There is
                    no other way to recover your account.
                  </p>
                </div>

                {SECURITY_QUESTIONS.map((question) => (
                  <div key={question}>
                    <label className={labelClass}>{question} *</label>
                    <input
                      type="text"
                      required
                      value={answers[question]}
                      onChange={(e) => handleAnswerChange(question, e.target.value)}
                      placeholder={`Your answer`}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3d2a1a] text-white font-bold text-sm py-3.5 rounded-lg hover:bg-[#2b1d14] hover:shadow-lg transition-all disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-[#6b5940] mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-[#B8860B] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register