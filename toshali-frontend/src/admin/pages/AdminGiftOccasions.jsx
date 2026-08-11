import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import adminAxios from '../api/adminAxios'

const toastStyle = {
  style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
}

const initialForm = { title: '', slug: '', tagline: '', description: '', image: '' }

const AdminGiftOccasions = () => {
  const [occasions, setOccasions] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const fetchOccasions = async () => {
    setLoading(true)
    try {
      const { data } = await adminAxios.get('/admin/gift-occasions')
      setOccasions(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load gift occasions.', toastStyle)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOccasions()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const startEdit = (occasion) => {
    setEditingId(occasion._id)
    setForm({
      title: occasion.title,
      slug: occasion.slug,
      tagline: occasion.tagline || '',
      description: occasion.description || '',
      image: occasion.image || '',
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
    try {
      if (editingId) {
        const { data } = await adminAxios.put(`/admin/gift-occasions/${editingId}`, form)
        setOccasions((prev) => prev.map((o) => (o._id === editingId ? data : o)))
        toast.success('Occasion updated!', { icon: '✅', ...toastStyle })
        cancelEdit()
      } else {
        const { data } = await adminAxios.post('/admin/gift-occasions', form)
        setOccasions((prev) => [data, ...prev])
        toast.success(`"${data.title}" created!`, { icon: '🎁', ...toastStyle })
        setForm(initialForm)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.', toastStyle)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This also removes its products.`)) return
    try {
      await adminAxios.delete(`/admin/gift-occasions/${id}`)
      setOccasions((prev) => prev.filter((o) => o._id !== id))
      toast.success('Occasion deleted.', { icon: '🗑️', ...toastStyle })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete.', toastStyle)
    }
  }

  const toggleActive = async (id) => {
    try {
      const { data } = await adminAxios.patch(`/admin/gift-occasions/${id}/toggle-active`)
      setOccasions((prev) => prev.map((o) => (o._id === id ? data : o)))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status.', toastStyle)
    }
  }

  const inputClass = "w-full border border-[#3d2a1a]/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
  const labelClass = "text-xs font-semibold text-[#3d2a1a] mb-1.5 block"

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-[#3d2a1a] mb-1">Gift Occasions</h1>
        <p className="text-sm text-[#6b5940]">Create occasions (Marriage, Birthday, Festive...) — each one holds its own set of gift products.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Create / Edit form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm p-6 space-y-4">
          <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide">
            {editingId ? 'Edit Occasion' : 'Add New Occasion'}
          </p>
          <div>
            <label className={labelClass}>Title *</label>
            <input name="title" required value={form.title} onChange={handleChange} placeholder="e.g. Marriage Gifting" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input name="slug" required value={form.slug} onChange={handleChange} placeholder="e.g. marriage" className={inputClass} />
            <p className="text-[11px] text-[#a89c8a] mt-1">Used in the URL: /gifts/{form.slug || 'slug'}</p>
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input name="tagline" value={form.tagline} onChange={handleChange} placeholder="Short line shown on the hero banner" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Longer description shown on the occasion page" className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." className={inputClass} />
            {form.image && (
              <img src={form.image} alt="preview" className="mt-2 w-16 h-16 rounded-lg object-cover border border-[#3d2a1a]/10" onError={(e) => (e.target.style.display = 'none')} />
            )}
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button type="submit" disabled={saving} className="flex-1 bg-[#3d2a1a] text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-[#2b1d14] hover:shadow-lg transition-all disabled:opacity-60">
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Occasion'}
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
            <p className="text-sm font-bold text-[#3d2a1a]">All Occasions</p>
            <span className="text-xs text-[#a89c8a]">{occasions.length} total</span>
          </div>

          {loading ? (
            <p className="text-sm text-[#a89c8a] px-4 py-8 text-center">Loading...</p>
          ) : occasions.length === 0 ? (
            <p className="text-sm text-[#a89c8a] px-4 py-8 text-center">No occasions yet. Create one to get started.</p>
          ) : (
            <div className="divide-y divide-[#3d2a1a]/6">
              {occasions.map((occasion) => (
                <div key={occasion._id} className="flex items-center gap-4 px-4 py-3.5">
                  {occasion.image ? (
                    <img src={occasion.image} alt={occasion.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-[#3d2a1a]/10" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#F3E4C8] flex items-center justify-center flex-shrink-0 text-lg">🎁</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#3d2a1a] truncate">{occasion.title}</p>
                    <p className="text-xs text-[#a89c8a]">/gifts/{occasion.slug} · {occasion.productCount ?? 0} products</p>
                  </div>
                  <button
                    onClick={() => toggleActive(occasion._id)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                      occasion.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {occasion.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <Link
                    to={`/admin/gift-occasions/${occasion._id}/products`}
                    className="text-xs font-semibold text-[#B8860B] hover:text-[#3d2a1a] flex-shrink-0"
                  >
                    Products →
                  </Link>
                  <button onClick={() => startEdit(occasion)} className="text-xs font-semibold text-[#6b5940] hover:text-[#3d2a1a] flex-shrink-0">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(occasion._id, occasion.title)} className="text-xs font-semibold text-red-500 hover:text-red-600 flex-shrink-0">
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

export default AdminGiftOccasions