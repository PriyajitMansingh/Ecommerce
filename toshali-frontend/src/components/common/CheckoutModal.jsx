import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { validateCheckout, createOrder, createPayment, verifyPayment, applyCoupon, getActiveCoupons } from '../../api/checkoutApi'
import { getAddresses } from '../../api/addressApi'

const toastStyle = {
  style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
}

const inputCls = 'w-full border border-[#3d2a1a]/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all bg-white'
const labelCls = 'text-xs font-semibold text-[#3d2a1a] mb-1.5 block'

const STEPS = ['Address', 'Review', 'Payment']

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutModal({ onClose }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, cartTotal, clearCart } = useCart()

  const shipping = cartTotal >= 499 || cartTotal === 0 ? 0 : 49

  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)

  // Address
  const [savedAddresses, setSavedAddresses] = useState([])
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [selectedAddressId, setSelectedAddressId] = useState('custom')
  const [addr, setAddr] = useState({
    fullName: user?.name || '',
    mobile: user?.mobile || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  })

  // Coupon
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [availableCoupons, setAvailableCoupons] = useState([])

  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0
  const finalGrandTotal = Number(Math.max(0, cartTotal - discount + shipping).toFixed(2))

  // Payment
  const [method, setMethod] = useState(null)
  const [createdOrder, setCreatedOrder] = useState(null)
  const [done, setDone] = useState(false)

  useEffect(() => { loadRazorpayScript() }, [])

  // Fetch active coupons for checkout chip display
  useEffect(() => {
    getActiveCoupons()
      .then((list) => setAvailableCoupons(Array.isArray(list) ? list : []))
      .catch(() => {}) // fail silently — chips are a convenience
  }, [])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setAddressesLoading(true)
        const list = await getAddresses()
        if (mounted && Array.isArray(list) && list.length > 0) {
          setSavedAddresses(list)
          const primary = list.find((a) => a.isPrimary) || list[0]
          if (primary) {
            setSelectedAddressId(primary._id)
            setAddr({
              fullName: primary.fullName || user?.name || '',
              mobile: primary.mobile || user?.mobile || '',
              addressLine1: primary.addressLine1 || '',
              addressLine2: primary.addressLine2 || '',
              city: primary.city || '',
              state: primary.state || '',
              pincode: primary.pincode || '',
              country: primary.country || 'India',
            })
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setAddressesLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user])

  const handleSelectSavedAddress = (sAddr) => {
    setSelectedAddressId(sAddr._id)
    setAddr({
      fullName: sAddr.fullName,
      mobile: sAddr.mobile,
      addressLine1: sAddr.addressLine1,
      addressLine2: sAddr.addressLine2 || '',
      city: sAddr.city,
      state: sAddr.state,
      pincode: sAddr.pincode,
      country: sAddr.country || 'India',
    })
  }

  const handleSelectCustomAddress = () => {
    setSelectedAddressId('custom')
    setAddr({ fullName: user?.name || '', mobile: user?.mobile || '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India' })
  }

  const handleAddrChange = (e) => {
    const { name, value } = e.target
    setAddr((p) => ({ ...p, [name]: value }))
  }

  const handleAddressNext = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const result = await validateCheckout()
      if (!result.valid) {
        const msg = result.issues.map((i) =>
          i.type === 'stock' ? `Only ${i.available} of "${i.name}" available` : `"${i.name}" is unavailable`
        ).join('. ')
        toast.error(msg, toastStyle)
        return
      }
      setStep(1)
    } catch (err) {
      toast.error(err.message, toastStyle)
    } finally {
      setBusy(false)
    }
  }

  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponInput).trim()
    if (!code) { toast.error('Please enter a coupon code.', toastStyle); return }
    setCouponLoading(true)
    try {
      const res = await applyCoupon(code, cartTotal)
      if (res.valid) {
        setAppliedCoupon({ code: res.couponCode, discountAmount: res.discountAmount, message: res.message })
        toast.success(res.message || 'Coupon applied!', toastStyle)
      }
    } catch (err) {
      toast.error(err.message || 'Invalid coupon code.', toastStyle)
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponInput('')
    toast.success('Coupon removed.', toastStyle)
  }

  // Razorpay popup
  const openRazorpayGateway = (pmtData, orderObj) => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK failed to load.', toastStyle)
      return
    }
    const options = {
      key: pmtData.razorpayKeyId,
      amount: pmtData.amount,
      currency: pmtData.currency || 'INR',
      name: 'House of Toshali',
      description: `Order #${pmtData.orderNumber}`,
      order_id: pmtData.razorpayOrderId,
      prefill: {
        name: addr.fullName,
        email: user?.email || '',
        contact: addr.mobile,
      },
      notes: { orderId: orderObj._id },
      theme: { color: '#3d2a1a' },
      handler: async function (response) {
        setBusy(true)
        try {
          await verifyPayment({
            paymentId: pmtData.paymentId,
            gatewayOrderId: response.razorpay_order_id,
            gatewayPaymentId: response.razorpay_payment_id,
            gatewaySignature: response.razorpay_signature,
            status: 'success',
          })
          setDone(true)
          clearCart()
          toast.success('Payment successful! Order placed.', { icon: '✅', ...toastStyle })
        } catch (err) {
          toast.error(err.message || 'Payment verification failed', toastStyle)
        } finally {
          setBusy(false)
        }
      },
      modal: {
        ondismiss: () => {
          toast.error('Payment cancelled.', toastStyle)
          setBusy(false)
        },
      },
    }
    try {
      new window.Razorpay(options).open()
    } catch (err) {
      console.error('Razorpay open error:', err)
    }
  }

  // Place order + open Razorpay
  const handlePayHere = async () => {
    if (!method) {
      toast.error('Please select a payment method.', toastStyle)
      return
    }
    setBusy(true)
    try {
      // Create order (with coupon details)
      let order = createdOrder
      if (!order) {
        order = await createOrder({
          shippingAddress: addr,
          paymentMethod: method,
          couponCode: appliedCoupon?.code || '',
          discountAmount: appliedCoupon?.discountAmount || 0,
        })
        setCreatedOrder(order)
      }

      // COD: mark done immediately
      if (method === 'cod') {
        await createPayment({ orderId: order._id, method })
        setDone(true)
        clearCart()
        toast.success('Order placed! Pay on delivery.', { icon: '✅', ...toastStyle })
        return
      }

      // Online: create payment record then open Razorpay
      await loadRazorpayScript()
      const pmt = await createPayment({ orderId: order._id, method })
      openRazorpayGateway(pmt, order)
    } catch (err) {
      toast.error(err.message, toastStyle)
    } finally {
      setBusy(false)
    }
  }

  const goToOrders = () => { onClose(); navigate('/account') }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative max-h-[93vh] overflow-y-auto">

        {/* ── Header ── */}
        <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-[#3d2a1a]/10 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-lg text-[#3d2a1a]">
              {done ? 'Order Confirmed' : STEPS[step]}
            </h3>
            <button onClick={onClose} className="text-[#a89c8a] hover:text-[#3d2a1a] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          {!done && (
            <div className="flex items-center gap-1">
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${i === step ? 'text-[#B8860B]' : i < step ? 'text-[#3a8a5a]' : 'text-[#a89c8a]'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${i === step ? 'bg-[#B8860B] text-white border-[#B8860B]' : i < step ? 'bg-[#3a8a5a] text-white border-[#3a8a5a]' : 'border-[#a89c8a] text-[#a89c8a]'}`}>
                      {i < step ? '✓' : i + 1}
                    </span>
                    {s}
                  </div>
                  {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-[#3a8a5a]' : 'bg-[#e0d4c0]'}`} />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-5">

          {/* ══════════ STEP 0 — ADDRESS ══════════ */}
          {step === 0 && !done && (
            <form onSubmit={handleAddressNext} className="space-y-5">

              {addressesLoading ? (
                <div className="p-4 text-center text-xs text-[#a89c8a]">Loading saved addresses…</div>
              ) : savedAddresses.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide">Select Shipping Address</p>
                    <span className="text-[11px] text-[#a89c8a]">Default: Primary</span>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {savedAddresses.map((sAddr) => {
                      const isSel = selectedAddressId === sAddr._id
                      return (
                        <div
                          key={sAddr._id}
                          onClick={() => handleSelectSavedAddress(sAddr)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${isSel ? 'border-[#D4AF37] bg-[#FBF9F2] ring-1 ring-[#D4AF37]' : 'border-[#3d2a1a]/12 hover:border-[#D4AF37]/50'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <input type="radio" name="addr" checked={isSel} onChange={() => handleSelectSavedAddress(sAddr)} className="accent-[#B8860B]" />
                              <span className="text-xs font-bold text-[#3d2a1a]">{sAddr.label || 'Address'}</span>
                              {sAddr.isPrimary && <span className="text-[10px] font-bold text-[#B8860B] bg-[#F3E4C8] px-2 py-0.5 rounded-md uppercase">Primary</span>}
                            </div>
                            <span className="text-xs font-semibold text-[#3d2a1a]">{sAddr.fullName}</span>
                          </div>
                          <p className="text-xs text-[#6b5940] mt-1 pl-6">
                            {sAddr.addressLine1}{sAddr.addressLine2 ? `, ${sAddr.addressLine2}` : ''}, {sAddr.city}, {sAddr.state} – {sAddr.pincode}
                          </p>
                          <p className="text-[11px] text-[#a89c8a] mt-0.5 pl-6">Mobile: {sAddr.mobile}</p>
                        </div>
                      )
                    })}
                    <div
                      onClick={handleSelectCustomAddress}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2 ${selectedAddressId === 'custom' ? 'border-[#D4AF37] bg-[#FBF9F2] ring-1 ring-[#D4AF37]' : 'border-[#3d2a1a]/12 hover:border-[#D4AF37]/50'}`}
                    >
                      <input type="radio" name="addr" checked={selectedAddressId === 'custom'} onChange={handleSelectCustomAddress} className="accent-[#B8860B]" />
                      <span className="text-xs font-semibold text-[#3d2a1a]">+ Use a temporary / custom address for this order</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#FBF9F2] border border-[#3d2a1a]/8 text-center">
                  <p className="text-xs text-[#6b5940]">No saved addresses found. Fill in your shipping details below.</p>
                </div>
              )}

              <div className="text-[11px] text-[#6b5940] bg-[#FBF9F2] rounded-xl px-3.5 py-2 border border-[#3d2a1a]/8 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#B8860B] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Address is stored with this <strong>Order</strong>. Profile addresses are not changed.</span>
              </div>

              {(selectedAddressId === 'custom' || savedAddresses.length === 0) && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className={labelCls}>Full Name *</label>
                    <input required name="fullName" value={addr.fullName} onChange={handleAddrChange} className={inputCls} placeholder="As on ID" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className={labelCls}>Mobile *</label>
                    <input required name="mobile" value={addr.mobile} onChange={handleAddrChange} className={inputCls} placeholder="10-digit number" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Address Line 1 *</label>
                    <input required name="addressLine1" value={addr.addressLine1} onChange={handleAddrChange} className={inputCls} placeholder="House / Flat / Building" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Address Line 2</label>
                    <input name="addressLine2" value={addr.addressLine2} onChange={handleAddrChange} className={inputCls} placeholder="Street / Locality (optional)" />
                  </div>
                  <div>
                    <label className={labelCls}>City *</label>
                    <input required name="city" value={addr.city} onChange={handleAddrChange} className={inputCls} placeholder="City" />
                  </div>
                  <div>
                    <label className={labelCls}>Pincode *</label>
                    <input required name="pincode" value={addr.pincode} onChange={handleAddrChange} className={inputCls} placeholder="6-digit pincode" maxLength={6} />
                  </div>
                  <div>
                    <label className={labelCls}>State *</label>
                    <input required name="state" value={addr.state} onChange={handleAddrChange} className={inputCls} placeholder="State" />
                  </div>
                  <div>
                    <label className={labelCls}>Country</label>
                    <input name="country" value={addr.country} onChange={handleAddrChange} className={inputCls} />
                  </div>
                </div>
              )}

              {selectedAddressId !== 'custom' && savedAddresses.length > 0 && (
                <div className="bg-[#F3E4C8]/30 rounded-xl border border-[#B8860B]/20 px-4 py-3">
                  <p className="text-xs text-[#6b5940]">Using saved address: <span className="font-semibold text-[#3d2a1a]">{addr.fullName}</span></p>
                  <p className="text-xs text-[#6b5940] mt-0.5">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city}, {addr.state} – {addr.pincode}</p>
                </div>
              )}

              <button type="submit" disabled={busy} className="w-full bg-[#3d2a1a] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#B8860B] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {busy ? 'Validating…' : 'Continue to Review'}
                {!busy && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>}
              </button>
            </form>
          )}

          {/* ══════════ STEP 1 — REVIEW & COUPON ══════════ */}
          {step === 1 && !done && (
            <div className="space-y-5">

              {/* Order items */}
              <div>
                <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide mb-3">Order Summary</p>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={`${item.productType || 'product'}-${item.productId}`} className="flex items-center gap-3 bg-[#FBF9F2] rounded-xl px-3 py-2.5">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-contain rounded-lg flex-shrink-0 bg-white p-1" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#3d2a1a] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#a89c8a]">
                          Qty: {item.quantity}{item.productType === 'gift' ? ' · Gift item' : ''}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-[#B8860B] flex-shrink-0">₹{Number(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery recap */}
              <div className="bg-[#FBF9F2] rounded-xl border border-[#3d2a1a]/8 px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide">Delivering to</p>
                  <button onClick={() => setStep(0)} className="text-[11px] text-[#a89c8a] hover:text-[#B8860B] transition-colors">Edit</button>
                </div>
                <p className="text-sm font-semibold text-[#3d2a1a]">{addr.fullName} · {addr.mobile}</p>
                <p className="text-xs text-[#6b5940]">{addr.addressLine1}{addr.addressLine2 ? ', ' + addr.addressLine2 : ''}, {addr.city}, {addr.state} – {addr.pincode}</p>
              </div>

              {/* Coupon code */}
              <div className="bg-[#FBF9F2] rounded-xl border border-[#3d2a1a]/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide flex items-center gap-1.5">
                    <span>🎟️</span> Coupon / Promo Code
                  </p>
                  {appliedCoupon && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full">Applied!</span>}
                </div>

                {!appliedCoupon ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code (e.g. TOSHALI10)"
                        className="flex-1 border border-[#3d2a1a]/15 rounded-xl px-3 py-2 text-xs font-mono uppercase outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
                      />
                      <button
                        onClick={() => handleApplyCoupon(couponInput)}
                        disabled={couponLoading || !couponInput.trim()}
                        className="bg-[#3d2a1a] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#B8860B] transition-colors disabled:opacity-50"
                      >
                        {couponLoading ? 'Checking…' : 'Apply'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {availableCoupons.length > 0 ? (
                        <>
                         
                         
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-white border border-green-200 rounded-xl p-3 text-xs">
                    <div>
                      <p className="font-bold text-green-800">✅ Coupon "{appliedCoupon.code}" Applied</p>
                      <p className="text-[11px] text-green-600">You save ₹{Number(appliedCoupon.discountAmount).toFixed(2)}</p>
                    </div>
                    <button type="button" onClick={handleRemoveCoupon} className="text-[11px] font-semibold text-red-500 hover:underline">Remove</button>
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div className="border-t border-[#3d2a1a]/10 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-[#6b5940]"><span>Subtotal</span><span>₹{Number(cartTotal).toFixed(2)}</span></div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>-₹{Number(appliedCoupon.discountAmount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6b5940]"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${Number(shipping).toFixed(2)}`}</span></div>
                <div className="flex justify-between font-bold text-[#3d2a1a] text-base pt-2 border-t border-[#3d2a1a]/10">
                  <span>Final Price</span>
                  <span className="text-[#B8860B]">₹{finalGrandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={busy}
                className="w-full bg-[#3d2a1a] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#B8860B] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                Proceed to Payment · ₹{finalGrandTotal.toFixed(2)}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </button>

              <button onClick={() => setStep(0)} className="w-full text-xs text-[#a89c8a] hover:text-[#3d2a1a] transition-colors">
                ← Back to Address
              </button>
            </div>
          )}

          {/* ══════════ STEP 2 — PAYMENT PANEL ══════════ */}
          {step === 2 && !done && (
            <div className="space-y-4">

              {/* Order total recap */}
              <div className="bg-[#FBF9F2] rounded-xl border border-[#3d2a1a]/8 px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="text-xs text-[#a89c8a]">
                    {appliedCoupon ? `Coupon ${appliedCoupon.code} Applied (-₹${appliedCoupon.discountAmount})` : 'Order Total'}
                  </p>
                  <p className="text-base font-bold text-[#B8860B]">₹{finalGrandTotal.toFixed(2)} payable</p>
                </div>
                {method && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#3d2a1a]/5 text-[#3d2a1a] uppercase">{method}</span>
                )}
              </div>

              {/* Select payment method */}
              <div>
                <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide mb-3">Select Payment Method</p>
                <div className="space-y-2">
                  {[
                    { id: 'upi',        label: 'UPI / QR Code',        sub: 'Google Pay, PhonePe, Paytm & QR via Razorpay', icon: '📲' },
                    { id: 'card',       label: 'Credit / Debit Card',   sub: 'Visa, Mastercard, RuPay via Razorpay',          icon: '💳' },
                    { id: 'netbanking', label: 'Net Banking',            sub: 'All major banks via Razorpay',                 icon: '🏦' },
                    { id: 'cod',        label: 'Cash on Delivery',       sub: 'Pay when your order arrives',                  icon: '🏠' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setMethod(opt.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${method === opt.id ? 'border-[#D4AF37] bg-[#FBF9F2] ring-1 ring-[#D4AF37]' : 'border-[#3d2a1a]/12 hover:border-[#D4AF37] hover:bg-[#FBF9F2]'}`}
                    >
                      <span className="text-xl w-8 text-center flex-shrink-0">{opt.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#3d2a1a]">{opt.label}</p>
                        <p className="text-xs text-[#a89c8a]">{opt.sub}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${method === opt.id ? 'border-[#B8860B] bg-[#B8860B]' : 'border-[#a89c8a]'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* ── PAY HERE button ── opens Razorpay */}
              <button
                onClick={handlePayHere}
                disabled={busy || !method}
                className="w-full bg-[#002970] text-white text-base font-bold py-4 rounded-xl hover:bg-[#001d52] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 mt-2"
              >
                {busy ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#00BAF2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                )}
                <span>{busy ? 'Opening Payment Gateway…' : `Pay Here · ₹${finalGrandTotal.toFixed(2)}`}</span>
              </button>

              <p className="text-center text-[10px] text-[#a89c8a]">
                🔒 Secured & powered by Razorpay Payment Gateway
              </p>

              <button onClick={() => setStep(1)} className="w-full text-xs text-[#a89c8a] hover:text-[#3d2a1a] transition-colors pt-1">
                ← Back to Review &amp; Coupon
              </button>
            </div>
          )}

          {/* ══════════ ORDER CONFIRMED ══════════ */}
          {done && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-600 mx-auto mb-4 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h4 className="font-serif text-xl text-[#3d2a1a] mb-1">Order Placed!</h4>
              <p className="text-sm text-[#6b5940] mb-1">Order #{createdOrder?.orderNumber}</p>
              {appliedCoupon && (
                <p className="text-xs font-semibold text-green-700 mb-2">
                  You saved ₹{Number(appliedCoupon.discountAmount).toFixed(2)} with coupon {appliedCoupon.code}! 🎉
                </p>
              )}
              <p className="text-xs text-[#a89c8a] mb-6">
                We'll send updates to your account. Track your order from My Orders.
              </p>
              <button
                onClick={goToOrders}
                className="w-full bg-[#3d2a1a] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#B8860B] transition-colors mb-3"
              >
                View My Orders
              </button>
              <button onClick={onClose} className="text-xs text-[#a89c8a] hover:text-[#3d2a1a] transition-colors">
                Continue Shopping
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
