import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'  // ← for navigation
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'
 
const inputClass =
  "w-full border border-[#3d2a1a]/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] bg-[#FCFAF7] focus:bg-white transition-all"
const labelClass = 'text-xs font-semibold text-[#3d2a1a] mb-1.5 block'
 
const CouponsPage = () => {
  const navigate = useNavigate()  // ← hook for navigation
 
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    code: '',
    discountType: 'flat',
    discountValue: '',
    minOrderValue: '',
    expiryDate: '',
    usageLimit: '',
  })
 
  // ─── Fetch all coupons ────────────────────────────────────────────
  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.get('/coupon/get-coupons')
      setCoupons(data)
    } catch (err) {
      toast.error('Could not load coupons.')
    } finally {
      setLoading(false)
    }
  }
 
  useEffect(() => {
    fetchCoupons()
  }, [])
 
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
 
  // ─── Create coupon ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await axiosInstance.post(
        '/coupon/generation',
        {
          ...form,
          code: form.code.toUpperCase(),
          discountValue: Number(form.discountValue),
          minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
          usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        }
      )
      toast.success('Coupon created.')
      setForm({
        code: '',
        discountType: 'flat',
        discountValue: '',
        minOrderValue: '',
        expiryDate: '',
        usageLimit: '',
      })
      fetchCoupons()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon.')
    } finally {
      setSaving(false)
    }
  }
 
  // ─── Toggle active status ──────────────────────────────────────────
  const handleToggle = async (id) => {
    try {
      await axiosInstance.patch(`/coupon/toggle-active/${id}`)
      fetchCoupons()
    } catch (err) {
      toast.error('Could not update coupon.')
    }
  }
 
  // ─── Delete coupon ──────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon? This cannot be undone.')) return
    try {
      await axiosInstance.delete(`/coupon/delete-coupon/${id}`)
      toast.success('Coupon deleted.')
      fetchCoupons()
    } catch (err) {
      toast.error('Could not delete coupon.')
    }
  }
 
  // ─── Go back ────────────────────────────────────────────────────────
  const goBack = () => navigate(-1)

 
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* ─── Header with Back Button ─── */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm font-medium text-[#3d2a1a] hover:text-[#B8860B] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
        <h1 className="font-serif text-2xl text-[#3d2a1a]">Coupon Management</h1>
      </div>
 
      {/* ─── Create form ─── */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-[#3d2a1a]/10 p-6 mb-8 space-y-4"
      >
        <h2 className="font-serif text-lg text-[#3d2a1a] mb-2">Create New Coupon</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Coupon Code *</label>
            <input
              required
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="e.g. SAVE20"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Discount Type *</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="flat">Flat Amount (₹)</option>
              <option value="percentage">Percentage (%)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Discount Value *</label>
            <input
              required
              type="number"
              name="discountValue"
              value={form.discountValue}
              onChange={handleChange}
              placeholder={form.discountType === 'flat' ? 'e.g. 100' : 'e.g. 10'}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Minimum Order Value</label>
            <input
              type="number"
              name="minOrderValue"
              value={form.minOrderValue}
              onChange={handleChange}
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Expiry Date *</label>
            <input
              required
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Usage Limit (total)</label>
            <input
              type="number"
              name="usageLimit"
              value={form.usageLimit}
              onChange={handleChange}
              placeholder="Unlimited if empty"
              className={inputClass}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#3d2a1a] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#B8860B] transition-colors disabled:opacity-60"
        >
          {saving ? 'Creating…' : 'Create Coupon'}
        </button>
      </form>
 
      {/* ─── Coupon list ─── */}
      <div className="bg-white rounded-2xl border border-[#3d2a1a]/10 overflow-hidden">
        <h2 className="font-serif text-lg text-[#3d2a1a] p-6 pb-0">Existing Coupons</h2>
        {loading ? (
          <p className="text-sm text-[#a89c8a] p-6">Loading…</p>
        ) : coupons.length === 0 ? (
          <p className="text-sm text-[#a89c8a] p-6">No coupons created yet.</p>
        ) : (
          <div className="divide-y divide-[#3d2a1a]/8">
            {coupons.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="font-bold text-[#3d2a1a]">{c.code}</p>
                  <p className="text-xs text-[#6b5940]">
                    {c.discountType === 'flat'
                      ? `₹${c.discountValue} off`
                      : `${c.discountValue}% off`}
                    {c.minOrderValue > 0 && ` · Min order ₹${c.minOrderValue}`}
                    {' · Expires ' +
                      new Date(c.expiryDate).toLocaleDateString('en-IN')}
                    {c.usageLimit
                      ? ` · ${c.usedCount}/${c.usageLimit} used`
                      : ' · Unlimited uses'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(c._id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                      c.isActive
                        ? 'bg-[#F3E4C8] text-[#B8860B]'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-xs font-bold text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
 
export default CouponsPage