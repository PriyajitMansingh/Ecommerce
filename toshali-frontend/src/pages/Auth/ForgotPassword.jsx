import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import axiosInstance from '../../api/axiosInstance'
import logo from '../../assets/images/logo.png'

const toastStyle = {
  style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
}

const ForgotPassword = () => {
  const navigate = useNavigate()

  // step: 'email' -> 'questions' -> 'reset' -> 'done'
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const inputClass = "w-full border border-[#3d2a1a]/15 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]"
  const labelClass = "text-xs font-semibold text-[#3d2a1a] mb-1.5 block"

  // STEP 1 — fetch this user's security questions (shuffled by the backend)
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await axiosInstance.get(`/auth/forgot-password/questions/${email}`)
      setQuestions(data.questions)
      setAnswers(Object.fromEntries(data.questions.map((q) => [q, ''])))
      setStep('questions')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to start password recovery.')
    } finally {
      setLoading(false)
    }
  }

  // STEP 2 — verify the 3 answers
  const handleAnswersSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await axiosInstance.post('/auth/forgot-password/verify', { email, answers })
      setResetToken(data.resetToken)
      setStep('reset')
      toast.success('Identity verified. Set your new password.', { icon: '✅', ...toastStyle })
    } catch (err) {
      setError(err.response?.data?.message || 'One or more answers are incorrect.')
    } finally {
      setLoading(false)
    }
  }

  // STEP 3 — set the new password
  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await axiosInstance.post('/auth/reset-password', { resetToken, newPassword })
      setStep('done')
      toast.success('Password reset successful!', { icon: '🎉', ...toastStyle })
    } catch (err) {
      setError(err.response?.data?.message || 'Reset link expired. Please start again.')
    } finally {
      setLoading(false)
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
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {['email', 'questions', 'reset'].map((s, i) => (
                <span
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    step === s || (step === 'done' && i <= 2) ? 'w-8 bg-[#D4AF37]' : 'w-4 bg-[#3d2a1a]/15'
                  }`}
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-medium px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* ===== STEP: email ===== */}
            {step === 'email' && (
              <>
                <h1 className="font-serif text-2xl text-[#3d2a1a] text-center mb-1">Forgot Password?</h1>
                <p className="text-xs text-[#a89c8a] text-center mb-6">
                  Enter your email to answer your security questions.
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" className={inputClass}
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-[#3d2a1a] text-white font-bold text-sm py-3.5 rounded-lg hover:bg-[#2b1d14] transition-all disabled:opacity-60">
                    {loading ? 'Checking...' : 'Continue'}
                  </button>
                </form>
              </>
            )}

            {/* ===== STEP: security questions ===== */}
            {step === 'questions' && (
              <>
                <h1 className="font-serif text-2xl text-[#3d2a1a] text-center mb-1">Verify Your Identity</h1>
                <p className="text-xs text-[#a89c8a] text-center mb-6">
                  Answer your security questions exactly as you set them.
                </p>
                <form onSubmit={handleAnswersSubmit} className="space-y-4">
                  {questions.map((q) => (
                    <div key={q}>
                      <label className={labelClass}>{q}</label>
                      <input
                        type="text" required value={answers[q]}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [q]: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                  ))}
                  <button type="submit" disabled={loading} className="w-full bg-[#3d2a1a] text-white font-bold text-sm py-3.5 rounded-lg hover:bg-[#2b1d14] transition-all disabled:opacity-60">
                    {loading ? 'Verifying...' : 'Verify Answers'}
                  </button>
                </form>
              </>
            )}

            {/* ===== STEP: reset password ===== */}
            {step === 'reset' && (
              <>
                <h1 className="font-serif text-2xl text-[#3d2a1a] text-center mb-1">Set New Password</h1>
                <p className="text-xs text-[#a89c8a] text-center mb-6">This link expires in 15 minutes.</p>
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div>
                    <label className={labelClass}>New Password</label>
                    <input
                      type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters" className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Confirm New Password</label>
                    <input
                      type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password" className={inputClass}
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-[#3d2a1a] text-white font-bold text-sm py-3.5 rounded-lg hover:bg-[#2b1d14] transition-all disabled:opacity-60">
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </>
            )}

            {/* ===== STEP: done ===== */}
            {step === 'done' && (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600 mx-auto mb-4">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h1 className="font-serif text-2xl text-[#3d2a1a] mb-2">Password Reset!</h1>
                <p className="text-sm text-[#6b5940] mb-6">You can now sign in with your new password.</p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-[#3d2a1a] text-white font-bold text-sm py-3.5 rounded-lg hover:bg-[#2b1d14] transition-all"
                >
                  Go to Login
                </button>
              </div>
            )}

            {step !== 'done' && (
              <p className="text-center text-sm text-[#6b5940] mt-6">
                Remembered your password?{' '}
                <Link to="/login" className="text-[#B8860B] font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword