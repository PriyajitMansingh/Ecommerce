import React, { useEffect, useState, useCallback } from 'react'
import adminAxios from '../api/adminAxios'
import toast from 'react-hot-toast'

const toastStyle = {
  style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
}

const statusBadge = {
  new: 'bg-blue-50 text-blue-700',
  contacted: 'bg-yellow-50 text-yellow-700',
  closed: 'bg-green-50 text-green-700',
}

const AdminBulkorder = () => {
  const [bulkOrders, setBulkOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [updates, setUpdates] = useState({})

  const fetchBulkOrders = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await adminAxios.get('/bulk-orders/admin/all')
      setBulkOrders(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load bulk orders.', toastStyle)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBulkOrders()
  }, [fetchBulkOrders])

  const handleUpdate = async (orderId) => {
    const order = bulkOrders.find((o) => o._id === orderId)
    if (!order) return

    const payload = {
      status: updates[orderId]?.status || order.status,
      responseNote: updates[orderId]?.responseNote ?? order.responseNote,
    }

    setEditingId(orderId)
    try {
      const { data } = await adminAxios.put(`/bulk-orders/admin/${orderId}`, payload)
      setBulkOrders((prev) => prev.map((item) => (item._id === orderId ? data : item)))
      toast.success('Bulk order updated.', { icon: '✅', ...toastStyle })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update bulk order.', toastStyle)
    } finally {
      setEditingId(null)
    }
  }

  const filteredOrders = bulkOrders.filter((order) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return [
      order.businessName,
      order.contactPerson,
      order.email,
      order.mobile,
      order.requirementType,
      order.quantity,
      order.status,
    ]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(q))
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-[#3d2a1a] mb-1">Bulk Orders</h1>
        <p className="text-sm text-[#6b5940]">{loading ? 'Loading…' : `${bulkOrders.length} enquiries received`}</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#3d2a1a]/10 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#3d2a1a]/10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md w-full">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#B8860B] mb-2 block">Search enquiries</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by business, contact, email, type or status"
              className="w-full rounded-2xl border border-[#3d2a1a]/15 px-4 py-3 text-sm text-[#3d2a1a] outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
            />
          </div>
          <button
            onClick={fetchBulkOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#3d2a1a]/10 bg-[#F7F5F0] px-4 py-3 text-sm font-semibold text-[#3d2a1a] hover:bg-[#F3E4C8] transition-colors disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-16 rounded-2xl bg-[#F7F5F0] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-[#F7F5F0]/70 text-[#6b5940] uppercase text-[11px] tracking-[0.24em]">
                  <th className="px-4 py-4">Business</th>
                  <th className="px-4 py-4">Contact</th>
                  <th className="px-4 py-4">Requirement</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-[#3d2a1a]/10 hover:bg-[#FBF9F2]">
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-[#3d2a1a]">{order.businessName}</p>
                      <p className="text-xs text-[#6b5940]">{order.requirementType}</p>
                      <p className="text-xs text-[#6b5940]">Qty: {order.quantity}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-[#3d2a1a]">{order.contactPerson}</p>
                      <p className="text-xs text-[#6b5940]">{order.email}</p>
                      <p className="text-xs text-[#6b5940]">{order.mobile}</p>
                    </td>
                    <td className="px-4 py-4 align-top max-w-xs">
                      <p className="text-xs text-[#3d2a1a] mb-2">{order.details || 'No additional details provided.'}</p>
                      <p className="text-[11px] text-[#a89c8a]">Preferred: {order.contactMethod}</p>
                    </td>
                    <td className="px-4 py-4 align-top whitespace-nowrap text-[#6b5940] text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${statusBadge[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-3">
                        <select
                          value={updates[order._id]?.status || order.status}
                          onChange={(e) => setUpdates((prev) => ({
                            ...prev,
                            [order._id]: { ...prev[order._id], status: e.target.value },
                          }))}
                          className="w-full rounded-2xl border border-[#3d2a1a]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
                        >
                          <option value="new">new</option>
                          <option value="contacted">contacted</option>
                          <option value="closed">closed</option>
                        </select>

                        <textarea
                          rows="2"
                          placeholder="Response note"
                          value={updates[order._id]?.responseNote ?? order.responseNote}
                          onChange={(e) => setUpdates((prev) => ({
                            ...prev,
                            [order._id]: { ...prev[order._id], responseNote: e.target.value },
                          }))}
                          className="w-full rounded-2xl border border-[#3d2a1a]/15 bg-white px-3 py-2 text-sm text-[#3d2a1a] outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
                        />

                        <button
                          onClick={() => handleUpdate(order._id)}
                          disabled={editingId === order._id}
                          className="w-full rounded-2xl bg-[#3d2a1a] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#B8860B] disabled:opacity-60"
                        >
                          {editingId === order._id ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-14 text-center text-[#a89c8a] text-sm">
                      {bulkOrders.length === 0 ? 'No bulk order enquiries yet.' : 'No enquiries match your search.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBulkorder
