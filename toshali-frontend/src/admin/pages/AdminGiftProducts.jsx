import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import adminAxios from '../api/adminAxios'

const toastStyle = {
  style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
}

const initialForm = { name: '', price: '', oldPrice: '', weight: '', image: '' }

const AdminGiftProducts = () => {
  const { occasionId } = useParams()
  const [occasion, setOccasion] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [occRes, prodRes] = await Promise.all([
        adminAxios.get(`/admin/gift-occasions/${occasionId}`),
        adminAxios.get(`/admin/gift-occasions/${occasionId}/products`),
      ])
      setOccasion(occRes.data)
      setProducts(prodRes.data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load data.', toastStyle)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occasionId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const startEdit = (product) => {
    setEditingId(product._id)
    setForm({
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice ?? '',
      weight: product.weight || '',
      image: product.image || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(initialForm)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: form.name,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      weight: form.weight,
      image: form.image,
    }
    try {
      if (editingId) {
        const { data } = await adminAxios.put(`/admin/gift-products/${editingId}`, payload)
        setProducts((prev) => prev.map((p) => (p._id === editingId ? data : p)))
        toast.success('Product updated!', { icon: '✅', ...toastStyle })
        cancelEdit()
      } else {
        const { data } = await adminAxios.post(`/admin/gift-occasions/${occasionId}/products`, payload)
        setProducts((prev) => [data, ...prev])
        toast.success(`"${data.name}" added!`, { icon: '🎁', ...toastStyle })
        setForm(initialForm)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.', toastStyle)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from this occasion?`)) return
    try {
      await adminAxios.delete(`/admin/gift-products/${id}`)
      setProducts((prev) => prev.filter((p) => p._id !== id))
      toast.success('Product removed.', { icon: '🗑️', ...toastStyle })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete.', toastStyle)
    }
  }

  const inputClass = "w-full border border-[#3d2a1a]/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
  const labelClass = "text-xs font-semibold text-[#3d2a1a] mb-1.5 block"

  if (loading) return <p className="text-sm text-[#a89c8a]">Loading...</p>

  return (
    <div>
      <Link to="/admin/gift-occasions" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b5940] hover:text-[#B8860B] transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        All Gift Occasions
      </Link>

      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-[#3d2a1a] mb-1">
          Products for "{occasion?.title}"
        </h1>
        <p className="text-sm text-[#6b5940]">Add the gift hampers/products that appear on this occasion's page.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Create / Edit form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm p-6 space-y-4">
          <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide">
            {editingId ? 'Edit Product' : 'Add Product'}
          </p>
          <div>
            <label className={labelClass}>Product Name *</label>
            <input name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Premium Dry Fruits Hamper" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Price (₹) *</label>
              <input type="number" name="price" required min="0" value={form.price} onChange={handleChange} placeholder="1299" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>MRP / Old Price (₹)</label>
              <input type="number" name="oldPrice" min="0" value={form.oldPrice} onChange={handleChange} placeholder="1599" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Weight / Pack Size</label>
            <input name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 1 kg mixed box" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." className={inputClass} />
            {form.image && (
              <img src={form.image} alt="preview" className="mt-2 h-20 object-contain" onError={(e) => (e.target.style.display = 'none')} />
            )}
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button type="submit" disabled={saving} className="flex-1 bg-[#3d2a1a] text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-[#2b1d14] hover:shadow-lg transition-all disabled:opacity-60">
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Product'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="text-sm font-semibold text-[#6b5940] hover:text-[#3d2a1a]">
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* List */}
        <div className="bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#3d2a1a]/10 flex items-center justify-between">
            <p className="text-sm font-bold text-[#3d2a1a]">Products in this Occasion</p>
            <span className="text-xs text-[#a89c8a]">{products.length} total</span>
          </div>

          {products.length === 0 ? (
            <p className="text-sm text-[#a89c8a] px-4 py-8 text-center">No products yet. Add one using the form.</p>
          ) : (
            <div className="divide-y divide-[#3d2a1a]/6">
              {products.map((product) => (
                <div key={product._id} className="flex items-center gap-4 px-4 py-3.5">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-contain bg-[#FBF9F2] p-1 flex-shrink-0 border border-[#3d2a1a]/10" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#F3E4C8] flex items-center justify-center flex-shrink-0 text-lg">🎁</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#3d2a1a] truncate">{product.name}</p>
                    <p className="text-xs text-[#a89c8a]">
                      ₹{product.price}{product.oldPrice ? ` · was ₹${product.oldPrice}` : ''}{product.weight ? ` · ${product.weight}` : ''}
                    </p>
                  </div>
                  <button onClick={() => startEdit(product)} className="text-xs font-semibold text-[#B8860B] hover:text-[#3d2a1a] flex-shrink-0">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product._id, product.name)} className="text-xs font-semibold text-red-500 hover:text-red-600 flex-shrink-0">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminGiftProducts