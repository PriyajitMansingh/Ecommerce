import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import adminAxios from '../api/adminAxios'

const toastStyle = {
  style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
}

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await adminAxios.get('/products/admin/all')
      setProducts(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load products.', toastStyle)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const toggleActive = async (id) => {
    try {
      const { data } = await adminAxios.patch(`/products/${id}/toggle-active`)
      setProducts((prev) => prev.map((p) => (p._id === id ? data.product : p)))
      toast.success(data.message, toastStyle)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status.', toastStyle)
    }
  }

  // Sale on/off is separate from Active/Inactive — this controls whether the
  // product's discount is currently applied/shown, without hiding it from the store.
  // Assumes backend route PATCH /products/:id/toggle-sale toggling `isOnSale`.
  const toggleSale = async (id) => {
    try {
      const { data } = await adminAxios.patch(`/products/${id}/toggle-sale`)
      setProducts((prev) => prev.map((p) => (p._id === id ? data.product : p)))
      toast.success(data.message || 'Sale status updated.', toastStyle)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update sale status.', toastStyle)
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#3d2a1a] mb-1">Products</h1>
          <p className="text-sm text-[#6b5940]">Maintain product data, price, stock and visibility.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-[#3d2a1a] text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-[#2b1d14] hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap text-center flex items-center gap-2 justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#3d2a1a]/10">
          <div className="relative max-w-sm">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89c8a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-[#3d2a1a]/15 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#a89c8a] text-xs uppercase tracking-wide border-b border-[#3d2a1a]/10 bg-[#F7F5F0]/50">
                <th className="px-4 py-3.5">Product</th>
                <th className="px-4 py-3.5">SKU</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Stock</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Sale</th>
                <th className="px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-[#a89c8a]">Loading products...</td></tr>
              )}

              {!loading && filtered.map((p) => (
                <tr key={p._id} className="border-b border-[#3d2a1a]/5 hover:bg-[#F7F5F0]/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-semibold text-[#3d2a1a]">{p.name}</p>
                      {p.isFeatured && (
                        <span className="text-[10px] text-[#B8860B] font-bold">★ Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[#6b5940] font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3.5 text-[#6b5940]">{p.categoryId?.name || '—'}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-[#3d2a1a] font-semibold">₹{p.price}</p>
                    {p.mrpPrice && p.mrpPrice > p.price && (
                      <p className="text-[11px] text-[#a89c8a] line-through">₹{p.mrpPrice}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {p.stockQty === 0 ? (
                      <span className="text-red-500 font-semibold">Out of Stock</span>
                    ) : (
                      <span className="text-[#3d2a1a]">{p.stockQty}</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleActive(p._id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 ${
                        p.isActive
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {p.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleSale(p._id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 ${
                        p.isOnSale
                          ? 'bg-[#FBF3DD] text-[#B8860B] hover:bg-[#F3E4C8]'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.isOnSale ? 'bg-[#D4AF37]' : 'bg-gray-400'}`} />
                      {p.isOnSale ? 'Sale On' : 'Sale Off'}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/product/${p._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#6b5940] hover:text-[#3d2a1a] transition-colors inline-flex items-center gap-1"
                        title="View product on storefront"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                        Detail
                      </Link>
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        className="text-xs font-semibold text-[#B8860B] hover:text-[#3d2a1a] transition-colors inline-flex items-center gap-1"
                      >
                        Edit
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-[#a89c8a]">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminProducts