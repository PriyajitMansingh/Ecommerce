import React, { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { useNavigate } from 'react-router-dom'
import almondLoose from '../../assets/images/almond-loose.png'
import cashewLoose from '../../assets/images/cashew-loose.png'
import makhanaLoose from '../../assets/images/makhana-loose.png'

const Contact = () => {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   // Backend not ready yet — this is a realistic frontend-only placeholder.
  //   setSubmitted(true)
  // }

  const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const handleSubmit = async (e) => {
  e.preventDefault()

  setLoading(true)
  setError('')

  const formData = new FormData(e.target)

  formData.append(
    'access_key',
    import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
  )

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      setSubmitted(true)
      e.target.reset()
    } else {
      setError(data.message || 'Failed to send message. Please try again.')
    }
  } catch (error) {
    console.error('Web3Forms error:', error)
    setError('Something went wrong. Please try again.')
  } finally {
    setLoading(false)
  }
}

  return (
    <>
      <Navbar />
      <section className="relative bg-[#FBF9F2] min-h-screen pb-20 px-6 md:px-16 overflow-hidden">
      <img src={almondLoose} alt="" className="hidden md:block absolute top-20 left-8 w-24 rotate-[-15deg] opacity-70 pointer-events-none drop-shadow-lg" />
      <img src={cashewLoose} alt="" className="hidden md:block absolute top-1/2 right-10 w-24 rotate-[12deg] opacity-70 pointer-events-none drop-shadow-lg" />
      <img src={makhanaLoose} alt="" className="hidden md:block absolute bottom-20 left-14 w-20 rotate-[8deg] opacity-60 pointer-events-none drop-shadow-lg" />

      <div className="max-w-2xl mx-auto pt-8 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b5940] hover:text-[#B8860B] transition-colors mb-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-[#B8860B] tracking-[0.22em] uppercase mb-3">
            We'd Love to Hear From You
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-[#3d2a1a] mb-3">
            Get in Touch
          </h1>
          <p className="text-[#6b5940] text-sm">
            Have a question about an order, bulk gifting, or anything else? Send us a message.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#3d2a1a]/10 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F3E4C8] flex items-center justify-center text-[#B8860B] mx-auto mb-5">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-[#3d2a1a] mb-2">Message Received!</h3>
            <p className="text-sm text-[#6b5940] mb-6">
              Thanks for reaching out. Our team will get back to you shortly.
              For anything urgent, you can also reach us directly on WhatsApp.
            </p>
            <a
              href="https://wa.me/918144871964"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-[#1ebe5a] transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-[#3d2a1a]/10 space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#3d2a1a] mb-1.5 block">Your Name</label>
             <input
  type="text"
  name="name"
  required
  placeholder="Full name"
  className="w-full border border-[#3d2a1a]/15 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]"
/>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#3d2a1a] mb-1.5 block">Your Email</label>
             <input
  type="email"
  name="email"
  required
  placeholder="you@example.com"
  className="w-full border border-[#3d2a1a]/15 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]"
/>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#3d2a1a] mb-1.5 block">Message</label>
              <textarea
  name="message"
  required
  placeholder="How can we help?"
  rows="4"
  className="w-full border border-[#3d2a1a]/15 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]"
/>
            </div>
            <button
              type="submit"
              className="w-full bg-[#3d2a1a] text-white font-bold text-sm py-3.5 rounded-lg hover:bg-[#2b1d14] hover:shadow-lg transition-all"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
    </>
  )
}

export default Contact