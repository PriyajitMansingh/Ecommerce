import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const states = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

const requirementTypes = [
  'Corporate Gifting',
  'Festive Gifting',
  'Employee / Client Gifting',
  'Custom Gift Hampers',
  'Retail / Store Requirement',
  'Other',
]

const initialForm = {
  businessName: '',
  contactPerson: '',
  mobile: '',
  email: '',
  state: '',
  city: '',
  requirementType: '',
  quantity: '',
  requiredDate: '',
  details: '',
  contactMethod: 'whatsapp',
}

const toastStyle = {
  style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
}

const inputClass = "w-full rounded-2xl border border-[#3d2a1a]/12 bg-[#FCFAF7] px-4 py-3.5 text-sm text-[#3d2a1a] placeholder:text-[#a89c8a] outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40 focus:bg-white transition-all"
const labelClass = "text-xs font-semibold text-[#3d2a1a] mb-1.5 block tracking-wide"

const BulkOrderPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Sent straight to the backend — admin reviews it from the admin panel.
      // No mailto:/WhatsApp redirect anymore.
      await axiosInstance.post('/bulk-orders', form)
      toast.success('Enquiry submitted! We will contact you shortly.', { icon: '✅', ...toastStyle })
      setSubmitted(true)
      setForm(initialForm)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to submit right now. Please try again.', toastStyle)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FBF9F2] px-4 py-8 md:py-10 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b5940] hover:text-[#B8860B] transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-white border border-[#3d2a1a]/10 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </span>
          Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-white rounded-[28px] border border-[#3d2a1a]/10 shadow-[0_4px_20px_rgba(61,42,26,0.06)] p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B8860B]">Bulk Order / B2B</p>
          <h1 className="font-serif text-3xl md:text-4xl text-[#3d2a1a] mt-3 tracking-tight">Tell us about your business</h1>
          <p className="text-sm text-[#6b5940] mt-3 leading-relaxed">
            Share your requirements and we'll get back with a custom quotation for corporate gifting, festive hampers, or large-scale orders.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Business Name *</label>
                <input name="businessName" required value={form.businessName} onChange={handleChange} placeholder="e.g. Toshali Enterprises Pvt. Ltd." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Contact Person Name *</label>
                <input name="contactPerson" required value={form.contactPerson} onChange={handleChange} placeholder="e.g. Ramesh Patnaik" className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Mobile Number *</label>
                <div className="flex gap-2">
                  <select className="rounded-2xl border border-[#3d2a1a]/12 bg-[#FCFAF7] px-3 py-3.5 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40">
                    <option>+91</option>
                  </select>
                  <input name="mobile" required value={form.mobile} onChange={handleChange} placeholder="98765 43210" className={`flex-1 ${inputClass}`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Email Address *</label>
                <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@company.com" className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>State</label>
                <select name="state" value={form.state} onChange={handleChange} className={`${inputClass} bg-[#FCFAF7]`}>
                  <option value="">Select State</option>
                  {states.map((state) => <option key={state} value={state}>{state}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Bhubaneswar" className={inputClass} />
              </div>
            </div>

            <div className="border-t border-[#3d2a1a]/8 pt-5">
              <h2 className="font-serif text-lg text-[#3d2a1a] mb-4">What do you need?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Event / Requirement Type *</label>
                  <select name="requirementType" required value={form.requirementType} onChange={handleChange} className={`${inputClass} bg-[#FCFAF7]`}>
                    <option value="">Select Type</option>
                    {requirementTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Approximate Quantity *</label>
                  <input name="quantity" required value={form.quantity} onChange={handleChange} placeholder="e.g. 50 units" className={inputClass} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Required Date *</label>
                <input type="date" name="requiredDate" required value={form.requiredDate} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Preferred Contact Method</label>
                <select name="contactMethod" value={form.contactMethod} onChange={handleChange} className={`${inputClass} bg-[#FCFAF7]`}>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="call">Phone Call</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Requirement Details</label>
              <textarea name="details" value={form.details} onChange={handleChange} rows="5" placeholder="Share your gifting idea, budget, packaging preference, or any special instructions" className={`${inputClass} resize-none`} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-[#3d2a1a] to-[#2b1d14] px-5 py-4 text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? 'Submitting...' : 'Get Bulk Quote'}
            </button>
          </form>

          {submitted && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#3a8a5a]/20 bg-green-50 px-4 py-3.5 text-sm text-[#3a8a5a]">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" />
              </svg>
              <span>Thank you! Your enquiry has been received. Our team will contact you shortly through your preferred channel.</span>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-[#3d2a1a]/10 bg-gradient-to-br from-[#F3E4C8] to-[#EAD4A0] p-8 md:p-10 shadow-[0_4px_20px_rgba(61,42,26,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B8860B]">Why choose us</p>
          <h2 className="font-serif text-2xl md:text-3xl text-[#3d2a1a] mt-3 tracking-tight">Smooth bulk ordering for businesses</h2>
          <ul className="mt-6 space-y-4 text-sm text-[#6b5940] leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-white/70 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#B8860B] text-xs">✓</span>
              Custom gifting solutions for corporate, festive, and employee engagement needs
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-white/70 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#B8860B] text-xs">✓</span>
              Flexible quantities with premium packaging options
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-white/70 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#B8860B] text-xs">✓</span>
              Fast response for business and B2B enquiries
            </li>
          </ul>
          <div className="mt-8 rounded-2xl bg-white/70 p-5 border border-[#3d2a1a]/10 backdrop-blur-sm">
            <p className="font-semibold text-[#3d2a1a]">Need help now?</p>
            <p className="text-sm text-[#6b5940] mt-2">Call or WhatsApp us for quick assistance.</p>
            <Link to="/contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#B8860B] hover:text-[#3d2a1a] transition-colors">
              Contact us
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BulkOrderPage