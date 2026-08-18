import React, { useEffect, useState } from 'react'
import adminAxios from '../api/adminAxios'
 
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const stats = (totalProducts, activeOrders, outOfStockCount, pendingPaymentCount) => [
  {
    label: 'Total Products',
    value: String(totalProducts),
    accent: 'text-[#B8860B]',
    bg: 'bg-gradient-to-br from-[#F3E4C8] to-[#EAD4A0]',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: 'Active Orders',
    value: String(activeOrders),
    accent: 'text-[#3a8a5a]',
    bg: 'bg-gradient-to-br from-green-50 to-green-100',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 2h6l1 4H8l1-4z" /><path d="M5 6h14l-1 14H6L5 6z" />
      </svg>
    ),
  },
  {
    label: 'Out of Stock',
    value: String(outOfStockCount),
    accent: 'text-red-500',
    bg: 'bg-gradient-to-br from-red-50 to-red-100',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
      </svg>
    ),
  },
  {
    label: 'Pending Payment',
    value: String(pendingPaymentCount),
    accent: 'text-[#a89c8a]',
    bg: 'bg-gradient-to-br from-gray-100 to-gray-200',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
      </svg>
    ),
  },
]

const toastStyle = {
  style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
}

const AdminDashboard = () => {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', slug: '', description: '', image: '' })
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentCategoryId: '',
  })
  const [loading, setLoading] = useState(false)
  const [subLoading, setSubLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', slug: '', description: '', image: '' })
  const [editLoading, setEditLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [totalProducts, setTotalProducts] = useState('—')
  const [activeOrders, setActiveOrders] = useState('—')

  const loadCategories = async () => {
    try {
      const { data } = await axiosInstance.get('/categories')
      setCategories(data)
    } catch {
      setCategories([])
    }
  }

  useEffect(() => {
    loadCategories()
    // Fetch total product count from admin endpoint (includes inactive products)
    axiosInstance
      .get('/products/admin/all')
      .then(({ data }) => setTotalProducts(data.length))
      .catch(() => setTotalProducts('—'))
    // Fetch active orders count (exclude delivered + cancelled)
    axiosInstance
      .get('/orders/admin/all')
      .then(({ data }) => {
        const active = data.filter((o) => !['delivered', 'cancelled'].includes(o.orderStatus))
        setActiveOrders(active.length)
      })
      .catch(() => setActiveOrders('—'))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubcategoryChange = (e) => {
    const { name, value } = e.target
    setSubcategoryForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axiosInstance.post('/admin/categories', form)
      toast.success(`Category "${data.name}" created successfully.`, { icon: '✅', ...toastStyle })
      setForm({ name: '', slug: '', description: '', image: '' })
      setCategories((prev) => [data, ...prev])
    } catch (error) {
      if (error.response?.data?.suggestedSlug) {
        setForm((prev) => ({ ...prev, slug: error.response.data.suggestedSlug }))
        toast.error(`Slug already in use. Use "${error.response.data.suggestedSlug}" instead.`, toastStyle)
      } else {
        toast.error(error.response?.data?.message || 'Unable to create category.', toastStyle)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault()
    if (!subcategoryForm.parentCategoryId) {
      toast.error('Please choose a parent category first.', toastStyle)
      return
    }
    setSubLoading(true)
    try {
      const { data } = await axiosInstance.post(
        '/categories/' + subcategoryForm.parentCategoryId + '/subcategories',
        {
          name: subcategoryForm.name,
          slug: subcategoryForm.slug,
          description: subcategoryForm.description,
          image: subcategoryForm.image,
        }
      )
      toast.success(`Subcategory "${data.name}" created successfully.`, { icon: '✅', ...toastStyle })
      setSubcategoryForm({ name: '', slug: '', description: '', image: '', parentCategoryId: '' })
      await loadCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create subcategory.', toastStyle)
    } finally {
      setSubLoading(false)
    }
  }

  const openEdit = (category) => {
    setEditingId(category._id)
    setEditForm({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image: category.image || '',
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    try {
      const { data } = await axiosInstance.put('/categories/' + editingId, editForm)
      toast.success(`"${data.name}" updated.`, { icon: '✅', ...toastStyle })
      setEditingId(null)
      await loadCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed.', toastStyle)
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (category) => {
    if (deletingId === category._id) {
      // Second click — confirmed, proceed
      try {
        await axiosInstance.delete('/categories/' + category._id)
        toast.success(`"${category.name}" deleted.`, { icon: '🗑️', ...toastStyle })
        setDeletingId(null)
        setCategories((prev) => prev.filter((c) => c._id !== category._id))
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed.', toastStyle)
        setDeletingId(null)
      }
    } else {
      // First click — ask for confirmation
      setDeletingId(category._id)
      // Auto-reset confirmation after 4 seconds
      setTimeout(() => setDeletingId((id) => (id === category._id ? null : id)), 4000)
    }
  }

  const inputClass = "w-full border border-[#3d2a1a]/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all bg-[#FDFCFA] focus:bg-white"
  const labelClass = "text-xs font-semibold text-[#3d2a1a] mb-1.5 block tracking-wide"

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-3xl md:text-[2.25rem] text-[#3d2a1a] mb-1.5 tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#6b5940]">Overview of your store and category management for the catalogue.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {stats(totalProducts, activeOrders).map((s) => (
          <div
            key={s.label}
            className="group relative bg-white rounded-2xl border border-[#3d2a1a]/8 p-6 shadow-[0_1px_3px_rgba(61,42,26,0.06)] hover:shadow-[0_8px_24px_rgba(61,42,26,0.10)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-5">
              <span className={`w-11 h-11 rounded-2xl ${s.bg} ${s.accent} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                {s.icon}
              </span>
            </div>
            <p className="text-[11px] uppercase tracking-wider text-[#a89c8a] font-semibold mb-1.5">{s.label}</p>
            <p className={`font-serif text-4xl font-bold ${s.accent} leading-none`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-start">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-[#3d2a1a]/8 p-7 shadow-[0_1px_3px_rgba(61,42,26,0.06)]">
          <div className="flex items-center gap-2.5 mb-6">
            <span className="w-8 h-8 rounded-xl bg-[#3d2a1a] flex items-center justify-center text-white flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
              </svg>
            </span>
            <h3 className="font-serif text-xl text-[#3d2a1a]">Quick Actions</h3>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to="/admin/products/new"
              className="group flex items-center justify-between text-sm font-semibold text-white bg-gradient-to-r from-[#3d2a1a] to-[#2b1d14] rounded-xl px-5 py-4 transition-all hover:shadow-lg hover:-translate-y-0.5 hover:from-[#2b1d14] hover:to-[#1f150e]"
            >
              + Add New Product
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/admin/orders"
              className="group flex items-center justify-between text-sm font-semibold text-[#3d2a1a] border border-[#3d2a1a]/12 hover:border-[#3d2a1a]/25 hover:bg-[#FBF9F2] rounded-xl px-5 py-4 transition-all"
            >
              View Recent Orders
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>

             <Link
              to="/admin/gift-occasions"
              className="group flex items-center justify-between text-sm font-semibold text-[#3d2a1a] border border-[#3d2a1a]/12 hover:border-[#3d2a1a]/25 hover:bg-[#FBF9F2] rounded-xl px-5 py-4 transition-all"
            >
              View Gift Occasions
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>

             <Link
              to="/admin/coupons"
              className="group flex items-center justify-between text-sm font-semibold text-[#3d2a1a] border border-[#3d2a1a]/12 hover:border-[#3d2a1a]/25 hover:bg-[#FBF9F2] rounded-xl px-5 py-4 transition-all"
            >
             Create coupon
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Create Category + Subcategory forms */}
        <div className="bg-white rounded-2xl border border-[#3d2a1a]/8 p-7 shadow-[0_1px_3px_rgba(61,42,26,0.06)]">
          <div className="flex items-center gap-2.5 mb-6">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F3E4C8] to-[#EAD4A0] flex items-center justify-center text-[#B8860B] flex-shrink-0 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" />
              </svg>
            </span>
            <h3 className="font-serif text-xl text-[#3d2a1a]">Create Category</h3>
          </div>

          {/* ---- Category form ---- */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-7">
            <div>
              <label className={labelClass}>Category Name *</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Nuts"
              />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                type="text"
                name="slug"
                required
                value={form.slug}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. nuts"
              />
            </div>
            <div>
              <label className={labelClass}>Image URL</label>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://example.com/category-image.jpg"
              />
              {form.image && (
                <div className="mt-2.5 w-16 h-16 rounded-xl overflow-hidden border border-[#3d2a1a]/10 shadow-sm">
                  <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="2"
                className={`${inputClass} resize-none`}
                placeholder="Short category overview"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#3d2a1a] to-[#2b1d14] text-white text-sm font-bold px-5 py-3.5 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? 'Saving...' : 'Save Category'}
            </button>
          </form>

          {/* ---- Subcategory form ---- */}
          <form onSubmit={handleSubcategorySubmit} className="space-y-4 border-t border-[#3d2a1a]/10 pt-6">
            <p className="text-xs font-bold text-[#B8860B] uppercase tracking-widest mb-1">Add Subcategory</p>
            <div>
              <label className={labelClass}>Parent Category *</label>
              <select
                name="parentCategoryId"
                value={subcategoryForm.parentCategoryId}
                onChange={handleSubcategoryChange}
                className={`${inputClass} bg-white`}
                required
              >
                <option value="">Select parent category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Subcategory Name *</label>
              <input
                type="text"
                name="name"
                required
                value={subcategoryForm.name}
                onChange={handleSubcategoryChange}
                className={inputClass}
                placeholder="e.g. Almonds"
              />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                type="text"
                name="slug"
                required
                value={subcategoryForm.slug}
                onChange={handleSubcategoryChange}
                className={inputClass}
                placeholder="e.g. almonds"
              />
            </div>
            <div>
              <label className={labelClass}>Image URL</label>
              <input
                type="url"
                name="image"
                value={subcategoryForm.image}
                onChange={handleSubcategoryChange}
                className={inputClass}
                placeholder="https://example.com/subcategory-image.jpg"
              />
              {subcategoryForm.image && (
                <div className="mt-2.5 w-16 h-16 rounded-xl overflow-hidden border border-[#3d2a1a]/10 shadow-sm">
                  <img src={subcategoryForm.image} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                value={subcategoryForm.description}
                onChange={handleSubcategoryChange}
                rows="2"
                className={`${inputClass} resize-none`}
                placeholder="Short subcategory overview"
              />
            </div>
            <button
              type="submit"
              disabled={subLoading}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white text-sm font-bold px-5 py-3.5 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {subLoading ? 'Saving...' : 'Save Subcategory'}
            </button>
          </form>
        </div>
      </div>

      {/* Available Categories list */}
      <div className="bg-white rounded-2xl border border-[#3d2a1a]/8 p-7 shadow-[0_1px_3px_rgba(61,42,26,0.06)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-[#3d2a1a]">Available Categories</h3>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FBF9F2] border border-[#3d2a1a]/10 text-[#6b5940]">
            {categories.length} saved
          </span>
        </div>
        {categories.length === 0 ? (
          <p className="text-sm text-[#a89c8a] py-4 text-center">No categories yet. Create one above to populate the product form.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {categories.map((category) => (
              <div key={category._id} className="rounded-2xl border border-[#3d2a1a]/8 bg-[#FCFAF7] overflow-hidden transition-all duration-300">

                {/* ── Card row ── */}
                <div className="flex items-center gap-3.5 px-4 py-3.5">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-[#3d2a1a]/10 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F3E4C8] to-[#EAD4A0] flex items-center justify-center flex-shrink-0 text-xl select-none shadow-sm">
                      🛍️
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#3d2a1a] truncate">{category.name}</p>
                    <p className="text-xs text-[#a89c8a]">/{category.slug}</p>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-[#F3E4C8] text-[#B8860B] flex-shrink-0">
                    {category.subcategories?.length || 0} sub
                  </span>

                  {/* Edit button */}
                  <button
                    onClick={() => editingId === category._id ? setEditingId(null) : openEdit(category)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      editingId === category._id
                        ? 'bg-[#3d2a1a] text-white'
                        : 'bg-[#F3E4C8] text-[#3d2a1a] hover:bg-[#D4AF37] hover:text-white'
                    }`}
                    aria-label="Edit category"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(category)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                      deletingId === category._id
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-red-50 text-red-400 hover:bg-red-500 hover:text-white'
                    }`}
                    aria-label={deletingId === category._id ? 'Confirm delete' : 'Delete category'}
                    title={deletingId === category._id ? 'Click again to confirm delete' : 'Delete category'}
                  >
                    {deletingId === category._id ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Confirm-delete notice */}
                {deletingId === category._id && (
                  <div className="px-4 pb-3 flex items-center gap-2 text-xs font-semibold text-red-500">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
                    </svg>
                    Click the red ✓ again to confirm delete. Auto-cancels in 4s.
                  </div>
                )}

                {/* ── Inline edit form (expands below card) ── */}
                {editingId === category._id && (
                  <form
                    onSubmit={handleEditSubmit}
                    className="border-t border-[#3d2a1a]/10 bg-[#FBF9F2] px-4 py-4 space-y-3"
                  >
                    <p className="text-[11px] font-bold text-[#B8860B] uppercase tracking-widest mb-2">Edit Category</p>
                    <div>
                      <label className="text-[11px] font-semibold text-[#3d2a1a] mb-1 block">Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="w-full border border-[#3d2a1a]/15 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#3d2a1a] mb-1 block">Slug *</label>
                      <input
                        type="text"
                        name="slug"
                        required
                        value={editForm.slug}
                        onChange={handleEditChange}
                        className="w-full border border-[#3d2a1a]/15 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#3d2a1a] mb-1 block">Image URL</label>
                      <input
                        type="url"
                        name="image"
                        value={editForm.image}
                        onChange={handleEditChange}
                        placeholder="https://..."
                        className="w-full border border-[#3d2a1a]/15 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
                      />
                      {editForm.image && (
                        <div className="mt-2 w-12 h-12 rounded-lg overflow-hidden border border-[#3d2a1a]/10">
                          <img src={editForm.image} alt="preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#3d2a1a] mb-1 block">Description</label>
                      <textarea
                        name="description"
                        rows="2"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className="w-full border border-[#3d2a1a]/15 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white resize-none"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={editLoading}
                        className="flex-1 bg-[#3d2a1a] text-white text-xs font-bold py-2.5 rounded-lg hover:bg-[#B8860B] transition-colors disabled:opacity-60"
                      >
                        {editLoading ? 'Saving…' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex-1 border border-[#3d2a1a]/15 text-[#6b5940] text-xs font-bold py-2.5 rounded-lg hover:bg-[#F3E4C8] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard