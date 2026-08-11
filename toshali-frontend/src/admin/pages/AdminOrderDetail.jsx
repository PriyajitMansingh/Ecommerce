import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const allowedNextStatus = {
  placed: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'shipped', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

const fulfilmentStyles = {
  placed: 'bg-[#F3E4C8] text-[#B8860B]',
  confirmed: 'bg-blue-50 text-blue-600',
  processing: 'bg-indigo-50 text-indigo-600',
  shipped: 'bg-purple-50 text-purple-600',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

const AdminOrderDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const fetchOrderData = async () => {
    try {
      setLoading(true)
      const resOrder = await axiosInstance.get(`/orders/${id}`)
      setOrder(resOrder.data)
      try {
        const resPayment = await axiosInstance.get(`/payments/${id}/status`)
        setPaymentInfo(resPayment.data)
      } catch (pmtErr) {
        console.warn('Payment record load error:', pmtErr)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load order details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchOrderData()
    }
  }, [id])

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true)
    try {
      const res = await axiosInstance.patch(`/orders/admin/${id}/status`, { orderStatus: newStatus })
      setOrder(res.data)
      toast.success(`Order updated to ${newStatus}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-[#6b5940]">
        Loading order details...
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <p className="text-lg text-red-600 font-semibold mb-4">Order Not Found</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="px-4 py-2 bg-[#3d2a1a] text-white text-sm rounded-xl font-bold"
        >
          Back to Orders
        </button>
      </div>
    )
  }

  const currentStatus = order.orderStatus?.toLowerCase() || 'placed'
  const nextOptions = allowedNextStatus[currentStatus] || []

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/admin/orders')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b5940] hover:text-[#B8860B] transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#3d2a1a] mb-1">{order.orderNumber}</h1>
          <p className="text-sm text-[#6b5940]">Order ID: {order._id}</p>
        </div>
        <span className={`text-xs font-bold px-4 py-2 rounded-full capitalize ${fulfilmentStyles[currentStatus] || 'bg-gray-100 text-gray-700'}`}>
          {currentStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Order items */}
          <div className="bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-[#F3E4C8] flex items-center justify-center text-[#B8860B]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </span>
              <h3 className="font-serif text-lg text-[#3d2a1a]">Items</h3>
            </div>
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-[#3d2a1a]/5 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-[#3d2a1a]">{item.name}</p>
                  <p className="text-xs text-[#a89c8a]">Qty: {item.quantity} × ₹{item.price}</p>
                </div>
                <p className="text-sm font-semibold text-[#3d2a1a]">₹{item.lineTotal}</p>
              </div>
            ))}

            <div className="pt-4 mt-2 border-t border-[#3d2a1a]/10 space-y-2 text-sm">
              <div className="flex justify-between text-[#6b5940]"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
              {order.couponCode && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <span>🎟️</span> Coupon: <span className="font-mono font-bold">{order.couponCode}</span>
                  </span>
                  <span>−₹{order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6b5940]"><span>Shipping</span><span>{order.shippingCharge === 0 ? 'Free' : `₹${order.shippingCharge}`}</span></div>
              <div className="flex justify-between font-bold text-[#3d2a1a] text-base pt-2 border-t border-[#3d2a1a]/10">
                <span>Grand Total</span><span className="text-[#B8860B]">₹{order.grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-[#F3E4C8] flex items-center justify-center text-[#B8860B]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M12 21c-4-4-7-7.5-7-11a7 7 0 1114 0c0 3.5-3 7-7 11z" /><circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <h3 className="font-serif text-lg text-[#3d2a1a]">Shipping Address</h3>
            </div>
            <p className="text-sm text-[#3d2a1a] font-medium">{order.shippingAddress?.fullName}</p>
            <p className="text-sm text-[#6b5940]">{order.shippingAddress?.addressLine1} {order.shippingAddress?.addressLine2}</p>
            <p className="text-sm text-[#6b5940]">{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
            <p className="text-sm text-[#6b5940] mt-2">Mobile: {order.shippingAddress?.mobile}</p>
          </div>

          {/* Status History */}
          <div className="bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-[#F3E4C8] flex items-center justify-center text-[#B8860B]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
                </svg>
              </span>
              <h3 className="font-serif text-lg text-[#3d2a1a]">Status History</h3>
            </div>
            <div className="space-y-3">
              {order.statusHistory?.map((h, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#3d2a1a] capitalize">{h.status}</p>
                    <p className="text-xs text-[#a89c8a]">
                      {new Date(h.changedAt || Date.now()).toLocaleString()} — {h.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm p-6 space-y-4">
            <h3 className="font-serif text-base text-[#3d2a1a]">Payment Info</h3>

            {/* Payment Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#a89c8a] font-medium">Status</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                order.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {order.paymentStatus === 'paid' && (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                )}
                {order.paymentStatus?.toUpperCase() || 'PENDING'}
              </span>
            </div>

            {/* Payment Method with icon */}
            <div className="bg-[#FBF9F2] rounded-xl px-4 py-3 border border-[#3d2a1a]/8">
              <p className="text-[10px] text-[#a89c8a] font-medium uppercase tracking-wide mb-1.5">Payment Method</p>
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {order.paymentMethod === 'upi' && '📲'}
                  {order.paymentMethod === 'card' && '💳'}
                  {order.paymentMethod === 'netbanking' && '🏦'}
                  {order.paymentMethod === 'cod' && '🏠'}
                  {!['upi','card','netbanking','cod'].includes(order.paymentMethod) && '💰'}
                </span>
                <div>
                  <p className="text-sm font-bold text-[#3d2a1a] capitalize">
                    {order.paymentMethod === 'upi' && 'UPI / QR Code'}
                    {order.paymentMethod === 'card' && 'Credit / Debit Card'}
                    {order.paymentMethod === 'netbanking' && 'Net Banking'}
                    {order.paymentMethod === 'cod' && 'Cash on Delivery'}
                    {!['upi','card','netbanking','cod'].includes(order.paymentMethod) && (order.paymentMethod || 'Unknown')}
                  </p>
                  <p className="text-[11px] text-[#a89c8a]">
                    {order.paymentMethod === 'upi' && 'Google Pay / PhonePe / Paytm via Razorpay'}
                    {order.paymentMethod === 'card' && 'Visa / Mastercard / RuPay via Razorpay'}
                    {order.paymentMethod === 'netbanking' && 'Internet Banking via Razorpay'}
                    {order.paymentMethod === 'cod' && 'Pay on delivery at doorstep'}
                  </p>
                </div>
              </div>
            </div>

            {/* Coupon & Discount */}
            {order.couponCode ? (
              <div className="bg-green-50 rounded-xl px-4 py-3 border border-green-200">
                <p className="text-[10px] text-green-600 font-medium uppercase tracking-wide mb-1.5">🎟️ Coupon Applied</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-green-800 font-mono">{order.couponCode}</span>
                  <span className="text-sm font-bold text-green-700">−₹{order.discountAmount}</span>
                </div>
                <p className="text-[11px] text-green-600 mt-0.5">Customer saved ₹{order.discountAmount} on this order</p>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a89c8a]">🎟️ Coupon</span>
                <span className="text-[#a89c8a] italic">No coupon applied</span>
              </div>
            )}

            {/* Gateway Reference */}
            <div>
              <p className="text-[10px] text-[#a89c8a] font-medium uppercase tracking-wide mb-1">Gateway Ref (Razorpay ID)</p>
              <p className="text-xs font-mono text-[#3d2a1a] break-all bg-[#FBF9F2] px-3 py-2 rounded-lg border border-[#3d2a1a]/8">
                {paymentInfo?.paymentRecord?.gatewayPaymentId || 'N/A (Pending / COD)'}
              </p>
              <p className="text-[10px] text-[#a89c8a] mt-1.5 leading-relaxed">
                Recorded upon HMAC SHA-256 verification via Razorpay.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm p-6">
            <h3 className="font-serif text-base text-[#3d2a1a] mb-4">Update Fulfilment Status</h3>
            {nextOptions.length === 0 ? (
              <p className="text-sm text-[#a89c8a]">No further status change available.</p>
            ) : (
              <div className="space-y-2">
                {nextOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updating}
                    className="w-full text-sm font-semibold text-[#f8f1e2] bg-[#3d2a1a] hover:bg-[#B8860B] rounded-xl px-4 py-3 transition-all disabled:opacity-60 capitalize"
                  >
                    Mark as {status}
                  </button>
                ))}
              </div>
            )}
            <p className="text-[11px] text-[#a89c8a] mt-3 leading-relaxed">
              Only valid next steps are shown — invalid transitions are blocked by design.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderDetail
