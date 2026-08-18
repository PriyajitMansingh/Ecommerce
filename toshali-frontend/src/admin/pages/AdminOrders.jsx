import React, { useState, useEffect, useCallback } from 'react'
import axiosInstance from '../../api/axiosInstance'
import toast from 'react-hot-toast'

const toastStyle = {
  style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
}

// ── Status Pipeline (Flipkart-style, forward-only) ─────────────────────────
const STATUS_PIPELINE = ['placed', 'confirmed', 'processing', 'shipped', 'delivered']

const STATUS_META = {
  placed:     { label: 'Order Placed',    icon: '📦', color: 'bg-[#F3E4C8] text-[#B8860B]',     dot: 'bg-[#B8860B]',   border: 'border-[#B8860B]'   },
  confirmed:  { label: 'Confirmed',       icon: '✅', color: 'bg-blue-50 text-blue-600',         dot: 'bg-blue-500',    border: 'border-blue-400'    },
  processing: { label: 'Processing',      icon: '⚙️', color: 'bg-yellow-50 text-yellow-700',     dot: 'bg-yellow-500',  border: 'border-yellow-400'  },
  shipped:    { label: 'Shipped',         icon: '🚚', color: 'bg-purple-50 text-purple-600',     dot: 'bg-purple-500',  border: 'border-purple-400'  },
  delivered:  { label: 'Delivered',       icon: '🎉', color: 'bg-green-50 text-green-700',       dot: 'bg-green-500',   border: 'border-green-400'   },
  cancelled:  { label: 'Cancelled',       icon: '❌', color: 'bg-red-50 text-red-600',           dot: 'bg-red-500',     border: 'border-red-400'     },
}

const paymentBadge = {
  pending:  'bg-yellow-50 text-yellow-700',
  paid:     'bg-green-50 text-green-700',
  failed:   'bg-red-50 text-red-600',
  refunded: 'bg-blue-50 text-blue-600',
}

const paymentMethodInfo = {
  upi:        { icon: '📲', label: 'UPI',      color: 'bg-indigo-50 text-indigo-700' },
  card:       { icon: '💳', label: 'Card',     color: 'bg-blue-50 text-blue-700'    },
  netbanking: { icon: '🏦', label: 'Net Bank', color: 'bg-cyan-50 text-cyan-700'    },
  cod:        { icon: '🏠', label: 'COD',      color: 'bg-amber-50 text-amber-700'  },
}

/**
 * Returns allowed next statuses from current (mirrors backend logic).
 */
const getAllowedNextStatuses = (currentStatus) => {
  if (currentStatus === 'delivered' || currentStatus === 'cancelled') return []
  const idx = STATUS_PIPELINE.indexOf(currentStatus)
  if (idx === -1) return []
  const forward = STATUS_PIPELINE.slice(idx + 1)
  if (['placed', 'confirmed'].includes(currentStatus)) forward.push('cancelled')
  return forward
}

const PayMethodBadge = ({ method }) => {
  const info = paymentMethodInfo[method] || { icon: '💰', label: method || '—', color: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${info.color}`}>
      <span>{info.icon}</span>{info.label}
    </span>
  )
}

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || { label: status, color: 'bg-gray-100 text-gray-500', icon: '•' }
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full capitalize ${meta.color}`}>
      <span className="text-[11px]">{meta.icon}</span>{meta.label}
    </span>
  )
}

// ── Flipkart-style Horizontal Stepper ──────────────────────────────────────
const OrderStepper = ({ currentStatus }) => {
  const currentIdx = STATUS_PIPELINE.indexOf(currentStatus)
  const isCancelled = currentStatus === 'cancelled'

  return (
    <div className="flex items-center w-full">
      {STATUS_PIPELINE.map((step, idx) => {
        const meta = STATUS_META[step]
        const isCompleted = !isCancelled && idx < currentIdx
        const isCurrent  = !isCancelled && idx === currentIdx
        const isPending  = isCancelled || idx > currentIdx

        return (
          <React.Fragment key={step}>
            {/* Step node */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
                isCompleted ? 'bg-[#D4AF37] border-[#D4AF37] text-white'
                : isCurrent  ? `bg-[#3d2a1a] ${meta.border} text-white shadow-md`
                : 'bg-white border-[#3d2a1a]/15 text-[#a89c8a]'
              }`}>
                {isCompleted ? '✓' : isCurrent ? meta.icon : idx + 1}
              </div>
              <span className={`mt-1 text-[9px] font-semibold whitespace-nowrap ${
                isCurrent ? 'text-[#3d2a1a]' : isCompleted ? 'text-[#B8860B]' : 'text-[#a89c8a]'
              }`}>{meta.label}</span>
            </div>

            {/* Connector line */}
            {idx < STATUS_PIPELINE.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 transition-all ${
                isCompleted ? 'bg-[#D4AF37]' : 'bg-[#3d2a1a]/10'
              }`} />
            )}
          </React.Fragment>
        )
      })}

      {/* Cancelled node appended */}
      {isCancelled && (
        <>
          <div className="flex-1 h-0.5 mx-1 bg-red-200" />
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 bg-red-500 border-red-500 text-white">❌</div>
            <span className="mt-1 text-[9px] font-semibold text-red-500 whitespace-nowrap">Cancelled</span>
          </div>
        </>
      )}
    </div>
  )
}

// ── Status History Timeline ────────────────────────────────────────────────
const HistoryTimeline = ({ history }) => {
  if (!history || history.length === 0) {
    return <p className="text-xs text-[#a89c8a] italic">No history available.</p>
  }

  return (
    <div className="space-y-3">
      {[...history].reverse().map((h, i) => {
        const meta = STATUS_META[h.status] || { dot: 'bg-gray-400', icon: '•', label: h.status }
        const dateStr = h.changedAt || h.timestamp
          ? new Date(h.changedAt || h.timestamp).toLocaleString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })
          : '—'
        return (
          <div key={i} className={`flex items-start gap-3 relative ${i === 0 ? 'opacity-100' : 'opacity-80'}`}>
            <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] ${meta.dot}`}>
                {meta.icon}
              </div>
              {i < history.length - 1 && <div className="w-px flex-1 bg-[#3d2a1a]/10 mt-1 h-4" />}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-xs font-bold text-[#3d2a1a] capitalize">{meta.label || h.status}</span>
                {h.changedBy && (
                  <span className="text-[9px] font-semibold uppercase tracking-wide bg-[#3d2a1a]/5 text-[#6b5940] px-1.5 py-0.5 rounded-full">
                    by {h.changedBy}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#a89c8a] mt-0.5">{dateStr}</p>
              {h.note && (
                <p className="text-[11px] text-[#6b5940] mt-0.5 italic">"{h.note}"</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Status Update Panel (forward-only + confirmation) ─────────────────────
const StatusUpdatePanel = ({ order, onUpdate, updating }) => {
  const allowed = getAllowedNextStatuses(order.orderStatus)
  const isTerminal = allowed.length === 0

  const [selected, setSelected] = useState('')
  const [note, setNote] = useState('')
  const [confirmMode, setConfirmMode] = useState(false)

  // Reset when order changes
  useEffect(() => { setSelected(''); setNote(''); setConfirmMode(false) }, [order._id, order.orderStatus])

  const handleProceed = () => {
    if (!selected) { toast('Please select a status to proceed.', toastStyle); return }
    setConfirmMode(true)
  }

  const handleConfirm = () => {
    onUpdate(order._id, selected, note)
    setConfirmMode(false)
  }

  if (isTerminal) {
    const meta = STATUS_META[order.orderStatus] || {}
    return (
      <div className={`rounded-xl border px-3 py-2.5 ${order.orderStatus === 'delivered' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <p className="text-xs font-bold text-[#3d2a1a]">
          {order.orderStatus === 'delivered' ? '✅ Order Complete' : '🔒 Order Locked'}
        </p>
        <p className="text-[11px] text-[#6b5940] mt-0.5">
          {order.orderStatus === 'delivered'
            ? 'This order has been delivered. No further changes allowed.'
            : 'This order is cancelled. No further changes allowed.'}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[#3d2a1a]/8 px-3 py-3 space-y-2.5">
      <p className="text-[11px] font-bold text-[#3d2a1a] uppercase tracking-wide flex items-center gap-1.5">
        <span>🔄</span> Update Status
        <span className="text-[9px] font-normal text-[#a89c8a] normal-case tracking-normal">(forward-only)</span>
      </p>

      {!confirmMode ? (
        <>
          {/* Forward-only status select */}
          <div className="flex flex-wrap gap-1.5">
            {allowed.map((s) => {
              const meta = STATUS_META[s] || {}
              const isCancel = s === 'cancelled'
              return (
                <button
                  key={s}
                  onClick={() => setSelected(s)}
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    selected === s
                      ? isCancel
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-[#3d2a1a] text-white border-[#3d2a1a]'
                      : isCancel
                        ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                        : 'bg-[#F7F5F0] text-[#3d2a1a] border-[#3d2a1a]/15 hover:bg-[#F3E4C8] hover:border-[#B8860B]'
                  }`}
                >
                  <span>{meta.icon}</span>
                  {meta.label}
                </button>
              )
            })}
          </div>

          {/* Optional note */}
          {selected && (
            <input
              type="text"
              placeholder="Optional note (e.g. AWB number, delay reason…)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-[#3d2a1a]/15 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
            />
          )}

          <button
            onClick={handleProceed}
            disabled={!selected || updating}
            className="w-full bg-[#3d2a1a] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#B8860B] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Proceed →
          </button>
        </>
      ) : (
        /* ── Confirmation Step ── */
        <div className="space-y-2">
          <div className="bg-[#FBF9F2] rounded-lg px-3 py-2 border border-[#D4AF37]/40">
            <p className="text-[11px] text-[#6b5940]">Confirm status change for</p>
            <p className="text-xs font-bold text-[#3d2a1a]">#{order.orderNumber}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <StatusBadge status={order.orderStatus} />
              <span className="text-[#a89c8a] text-xs">→</span>
              <StatusBadge status={selected} />
            </div>
            {note && <p className="text-[11px] text-[#6b5940] mt-1 italic">Note: "{note}"</p>}
          </div>
          <p className="text-[10px] text-red-500 font-semibold">
            ⚠️ This action is irreversible. Status cannot go back.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              disabled={updating}
              className={`flex-1 text-white text-xs font-bold py-2 rounded-lg transition-colors disabled:opacity-60 ${
                selected === 'cancelled' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#3d2a1a] hover:bg-[#B8860B]'
              }`}
            >
              {updating ? 'Updating…' : 'Confirm Update'}
            </button>
            <button
              onClick={() => setConfirmMode(false)}
              className="flex-1 bg-[#F7F5F0] text-[#6b5940] text-xs font-semibold py-2 rounded-lg hover:bg-[#F3E4C8] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [statusHistory, setStatusHistory] = useState({})
  const [historyLoading, setHistoryLoading] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.get('/orders/admin/all')
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load orders.', toastStyle)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const loadHistory = async (orderId) => {
    if (statusHistory[orderId]) return
    setHistoryLoading(orderId)
    try {
      const { data } = await axiosInstance.get(`/orders/admin/${orderId}/status-history`)
      setStatusHistory((prev) => ({ ...prev, [orderId]: data.statusHistory }))
    } catch {
      toast.error('Could not load status history.', toastStyle)
    } finally {
      setHistoryLoading(null)
    }
  }

  const toggleExpand = (orderId) => {
    if (expandedId === orderId) {
      setExpandedId(null)
    } else {
      setExpandedId(orderId)
      loadHistory(orderId)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus, note) => {
    setUpdatingId(orderId)
    try {
      const { data } = await axiosInstance.patch(`/orders/admin/${orderId}/status`, {
        orderStatus: newStatus,
        note,
      })
      // Update the order's status in local state
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, orderStatus: data.orderStatus }
            : o
        )
      )
      // Refresh the status history with the newly returned history
      if (data.statusHistory) {
        setStatusHistory((prev) => ({ ...prev, [orderId]: data.statusHistory }))
      }
      toast.success(`Order status → "${STATUS_META[newStatus]?.label || newStatus}"`, { icon: '✅', ...toastStyle })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.', toastStyle)
    } finally {
      setUpdatingId(null)
    }
  }

  // ── Filtering ──
  const filtered = orders.filter((o) => {
    const q = search.toLowerCase()
    const matchesSearch =
      o.orderNumber?.toLowerCase().includes(q) ||
      o.userId?.email?.toLowerCase().includes(q) ||
      o.userId?.name?.toLowerCase().includes(q) ||
      o.userId?.mobile?.includes(q)
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  // ── Summary counts ──
  const counts = orders.reduce((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1
    return acc
  }, {})
  const activeCount = orders.filter((o) => !['delivered', 'cancelled'].includes(o.orderStatus)).length
  const pendingPayment = orders.filter((o) => o.paymentStatus === 'pending').length

  const filterTabs = [
    { key: 'all', label: 'All', count: orders.length },
    { key: 'placed', label: 'Placed', count: counts.placed || 0 },
    { key: 'confirmed', label: 'Confirmed', count: counts.confirmed || 0 },
    { key: 'processing', label: 'Processing', count: counts.processing || 0 },
    { key: 'shipped', label: 'Shipped', count: counts.shipped || 0 },
    { key: 'delivered', label: 'Delivered', count: counts.delivered || 0 },
    { key: 'cancelled', label: 'Cancelled', count: counts.cancelled || 0 },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-[#3d2a1a] mb-1">Orders</h1>
        <p className="text-sm text-[#6b5940]">
          {loading
            ? 'Loading…'
            : `${orders.length} total · ${activeCount} active · ${pendingPayment} pending payment`}
        </p>
      </div>

      {/* Summary stat pills */}
      {!loading && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filterTabs.filter(t => t.key !== 'all').map((tab) => {
            const meta = STATUS_META[tab.key]
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key === statusFilter ? 'all' : tab.key)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                  statusFilter === tab.key
                    ? 'bg-[#3d2a1a] text-white border-[#3d2a1a]'
                    : `${meta?.color || 'bg-gray-100 text-gray-500'} border-transparent hover:border-[#3d2a1a]/20`
                }`}
              >
                <span>{meta?.icon}</span>
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-black/5'
                }`}>{tab.count}</span>
              </button>
            )
          })}
          {statusFilter !== 'all' && (
            <button
              onClick={() => setStatusFilter('all')}
              className="text-xs font-semibold text-[#a89c8a] hover:text-[#3d2a1a] px-2 py-1 rounded-full transition-colors"
            >
              Clear filter ✕
            </button>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm overflow-hidden">
        {/* Search + refresh */}
        <div className="p-4 border-b border-[#3d2a1a]/10 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89c8a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search order no., customer name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-[#3d2a1a]/15 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            />
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#B8860B] hover:text-[#3d2a1a] disabled:opacity-50 transition-colors px-3 py-2.5 rounded-xl border border-[#3d2a1a]/10 hover:bg-[#F7F5F0]"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M3 12a9 9 0 009 9 9.75 9.75 0 006.74-2.74M3 12a9 9 0 0112-8.46M21 12a9 9 0 01-2.33 6.18" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-[#F7F5F0] animate-pulse" />
            ))}
          </div>
        )}

        {/* Orders Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#a89c8a] text-xs uppercase tracking-wide border-b border-[#3d2a1a]/10 bg-[#F7F5F0]/50">
                  <th className="px-4 py-3.5">Order No.</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Pay Type</th>
                  <th className="px-4 py-3.5">Pay Status</th>
                  <th className="px-4 py-3.5">Order Status</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const isExpanded = expandedId === order._id
                  const allowed = getAllowedNextStatuses(order.orderStatus)
                  const isTerminal = allowed.length === 0

                  return (
                    <React.Fragment key={order._id}>
                      {/* ── Main row ── */}
                      <tr className={`border-b border-[#3d2a1a]/5 transition-colors ${isExpanded ? 'bg-[#FBF9F2]' : 'hover:bg-[#F7F5F0]/60'}`}>
                        <td className="px-4 py-3.5 font-mono text-xs text-[#3d2a1a] font-semibold whitespace-nowrap">
                          {order.orderNumber}
                          {order.couponCode && (
                            <div className="mt-1">
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                                🎟️ {order.couponCode}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-[#3d2a1a] font-medium">{order.userId?.name || '—'}</p>
                          <p className="text-xs text-[#a89c8a]">{order.userId?.email || '—'}</p>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <p className="text-[#3d2a1a] font-bold text-sm">₹{order.grandTotal}</p>
                          {order.discountAmount > 0 && (
                            <p className="text-[10px] text-green-700 font-semibold">−₹{order.discountAmount} off</p>
                          )}
                        </td>
                        <td className="px-4 py-3.5"><PayMethodBadge method={order.paymentMethod} /></td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${paymentBadge[order.paymentStatus] || 'bg-gray-100 text-gray-500'}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={order.orderStatus} />
                          {isTerminal && (
                            <div className="mt-1">
                              <span className="text-[9px] font-bold text-[#a89c8a] uppercase tracking-wide">🔒 Locked</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-[#6b5940] whitespace-nowrap text-xs">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => toggleExpand(order._id)}
                            className="flex items-center gap-1 text-xs font-semibold text-[#B8860B] hover:text-[#3d2a1a] transition-colors"
                          >
                            {isExpanded ? 'Close' : 'Details'}
                            <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </button>
                        </td>
                      </tr>

                      {/* ── Expanded row ── */}
                      {isExpanded && (
                        <tr className="bg-[#FBF9F2] border-b border-[#3d2a1a]/8">
                          <td colSpan={8} className="px-4 py-5">

                            {/* Stepper */}
                            <div className="mb-5 bg-white rounded-xl border border-[#3d2a1a]/8 px-4 py-3">
                              <p className="text-[11px] font-bold text-[#B8860B] uppercase tracking-wide mb-3">Order Pipeline</p>
                              <OrderStepper currentStatus={order.orderStatus} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                              {/* ── Left: items + address ── */}
                              <div className="space-y-4">
                                <div>
                                  <p className="text-[11px] font-bold text-[#B8860B] uppercase tracking-wide mb-2">Items</p>
                                  <div className="space-y-1.5">
                                    {order.items?.map((item, i) => (
                                      <div key={i} className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2 border border-[#3d2a1a]/8">
                                        {item.imageUrl && (
                                          <img src={item.imageUrl} alt={item.name} className="w-8 h-8 object-contain rounded-lg bg-[#F7F5F0] p-0.5 flex-shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-semibold text-[#3d2a1a] truncate">{item.name}</p>
                                          <p className="text-[11px] text-[#a89c8a]">Qty {item.quantity} × ₹{item.price}</p>
                                        </div>
                                        <p className="text-xs font-bold text-[#B8860B] flex-shrink-0">₹{item.lineTotal}</p>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-2 text-xs text-[#6b5940] space-y-0.5 pl-1">
                                    <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                                    {order.couponCode && (
                                      <div className="flex justify-between text-green-700 font-semibold">
                                        <span className="flex items-center gap-1">🎟️ <span className="font-mono">{order.couponCode}</span></span>
                                        <span>−₹{order.discountAmount}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between"><span>Shipping</span><span>{order.shippingCharge === 0 ? 'Free' : '₹' + order.shippingCharge}</span></div>
                                    <div className="flex justify-between font-bold text-[#3d2a1a] border-t border-[#3d2a1a]/10 pt-0.5 mt-0.5">
                                      <span>Grand Total</span><span className="text-[#B8860B]">₹{order.grandTotal}</span>
                                    </div>
                                  </div>
                                  <div className="mt-2 flex items-center gap-2 pl-1">
                                    <span className="text-[10px] text-[#a89c8a] font-medium uppercase tracking-wide">Payment:</span>
                                    <PayMethodBadge method={order.paymentMethod} />
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700'
                                      : order.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-700'
                                      : 'bg-gray-100 text-gray-600'
                                    }`}>{order.paymentStatus}</span>
                                  </div>
                                </div>

                                {order.shippingAddress && (
                                  <div className="bg-white rounded-xl border border-[#3d2a1a]/8 px-3 py-2.5">
                                    <p className="text-[11px] font-bold text-[#B8860B] uppercase tracking-wide mb-1">Ship To</p>
                                    <p className="text-xs font-semibold text-[#3d2a1a]">{order.shippingAddress.fullName} · {order.shippingAddress.mobile}</p>
                                    <p className="text-[11px] text-[#6b5940]">
                                      {order.shippingAddress.addressLine1}
                                      {order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''},{' '}
                                      {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* ── Right: history + update ── */}
                              <div className="space-y-4">
                                {/* Status history */}
                                <div className="bg-white rounded-xl border border-[#3d2a1a]/8 px-3 py-3">
                                  <p className="text-[11px] font-bold text-[#B8860B] uppercase tracking-wide mb-3">Status History</p>
                                  {historyLoading === order._id ? (
                                    <div className="flex items-center gap-2 text-xs text-[#a89c8a]">
                                      <div className="w-3.5 h-3.5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                                      Loading…
                                    </div>
                                  ) : (
                                    <HistoryTimeline history={statusHistory[order._id]} />
                                  )}
                                </div>

                                {/* Status update panel */}
                                <StatusUpdatePanel
                                  order={order}
                                  onUpdate={handleStatusUpdate}
                                  updating={updatingId === order._id}
                                />
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-14 text-center text-[#a89c8a] text-sm">
                      {search ? 'No orders match your search.' : 'No orders yet.'}
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

export default AdminOrders
