

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import { useAuth } from '../../context/AuthContext'
import { getMyOrders, getInvoice, cancelOrder, updateOrderShippingAddress, retryPayment, verifyPayment } from '../../api/checkoutApi'
import { getAddresses, addAddress, updateAddress, deleteAddress, setPrimaryAddress } from '../../api/addressApi'

const toastStyle = {
  style: { background: '#241A12', color: '#FBF7EF', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
}

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

const inputClass = "w-full border border-[#241A12]/14 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A9792F]/40 focus:border-[#A9792F] transition-all bg-[#FBF7EF] focus:bg-white text-[#241A12] placeholder:text-[#8C7B65]/70"
const labelClass = "text-[11px] font-semibold text-[#8C7B65] mb-1.5 block tracking-[0.06em] uppercase"

/* ── Minimal line-icon set (replaces emoji for a steadier, premium register) ── */
const Icon = ({ path, className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    {path}
  </svg>
)
const IconBox      = (p) => <Icon {...p} path={<><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>} />
const IconCheck     = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.3 2.3L16 10" /></>} />
const IconGear      = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V21a2 2 0 11-4 0v-.09a1.7 1.7 0 00-1-1.55 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.7 1.7 0 004.6 15a1.7 1.7 0 00-1.55-1H3a2 2 0 110-4h.09A1.7 1.7 0 004.6 9a1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06A1.7 1.7 0 009 4.6a1.7 1.7 0 001-1.55V3a2 2 0 114 0v.09a1.7 1.7 0 001 1.55 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06A1.7 1.7 0 0019.4 9a1.7 1.7 0 001.55 1H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.55 1z" /></>} />
const IconTruck     = (p) => <Icon {...p} path={<><rect x="1" y="6" width="14" height="11" rx="1.3" /><path d="M15 10h4l3 3.4V17h-7" /><circle cx="6" cy="19" r="1.8" /><circle cx="17.5" cy="19" r="1.8" /></>} />
const IconFlag       = (p) => <Icon {...p} path={<><path d="M5 3v18" /><path d="M5 4h11l-2.5 3.5L16 11H5" /></>} />
const IconX          = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5l5 5M14.5 9.5l-5 5" /></>} />
const IconStar        = (p) => <Icon {...p} path={<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L12 17l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5z" />} />
const IconPin          = (p) => <Icon {...p} path={<><path d="M12 21s7-6.7 7-12a7 7 0 10-14 0c0 5.3 7 12 7 12z" /><circle cx="12" cy="9" r="2.4" /></>} />
const IconPencil       = (p) => <Icon {...p} path={<><path d="M4 17.5V20h2.5L18.9 7.6a1.8 1.8 0 000-2.5l-.9-.9a1.8 1.8 0 00-2.5 0L4 17.5z" /><path d="M14 6l2 2" /></>} />
const IconTrash        = (p) => <Icon {...p} path={<><path d="M4 7h16" /><path d="M9 7V4.8A1.8 1.8 0 0110.8 3h2.4A1.8 1.8 0 0115 4.8V7" /><path d="M6 7l1 12.2A1.8 1.8 0 008.8 21h6.4a1.8 1.8 0 001.8-1.8L18 7" /></>} />
const IconRefresh      = (p) => <Icon {...p} path={<><path d="M3 12a9 9 0 009 9 9.75 9.75 0 006.74-2.74M3 12a9 9 0 0112-8.46M21 12a9 9 0 01-2.33 6.18" /></>} />
const IconChevron      = (p) => <Icon {...p} path={<path d="M6 9l6 6 6-6" />} />
const IconDownload     = (p) => <Icon {...p} path={<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><path d="M7 10l5 5 5-5M12 15V3" /></>} />
const IconCard         = (p) => <Icon {...p} path={<><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>} />
const IconLogout       = (p) => <Icon {...p} path={<><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>} />
const IconBag           = (p) => <Icon {...p} path={<><path d="M9 2h6l1 4H8l1-4z" /><path d="M5 6h14l-1 14H6L5 6z" /></>} />

/* ── Status meta: labels, sub-labels, icon component ───────────────────── */
const TRACK_STEPS = [
  { key: 'placed',     label: 'Order Placed', subLabel: 'We received your order',          Icon: IconBox },
  { key: 'confirmed',  label: 'Confirmed',    subLabel: 'Seller has confirmed your order',  Icon: IconCheck },
  { key: 'processing', label: 'Processing',   subLabel: 'Your order is being packed',       Icon: IconGear },
  { key: 'shipped',    label: 'Shipped',      subLabel: 'On its way to you',                Icon: IconTruck },
  { key: 'delivered',  label: 'Delivered',    subLabel: 'Successfully delivered',           Icon: IconFlag },
]

const normalizeTrackingStatus = (value) => {
  const status = String(value || '').trim().toLowerCase()
  return ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)
    ? status
    : 'placed'
}

const formatTrackingDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatTrackingDateTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const getTrackingData = (order) => {
  const currentStatus = normalizeTrackingStatus(order?.orderStatus)
  const currentIndex  = TRACK_STEPS.findIndex((step) => step.key === currentStatus)

  // Build a timestamp lookup from real statusHistory if available
  const historyMap = {}
  if (Array.isArray(order?.statusHistory)) {
    for (const entry of order.statusHistory) {
      const s = normalizeTrackingStatus(entry?.status)
      // keep the first occurrence (earliest) for each status
      if (!historyMap[s]) {
        historyMap[s] = entry?.changedAt || entry?.timestamp || entry?.createdAt || null
      }
    }
  }

  const steps = TRACK_STEPS.map((step, index) => {
    const completed = currentStatus === 'cancelled' ? false : index < currentIndex
    const current   = currentStatus === 'cancelled' ? false : step.key === currentStatus
    const pending   = currentStatus === 'cancelled' ? true  : index > currentIndex
    const ts = historyMap[step.key] || (completed || current ? (order?.updatedAt || order?.createdAt) : null)
    return { ...step, completed, current, pending, timestamp: ts }
  })

  if (currentStatus === 'cancelled') {
    const cancelTs = historyMap['cancelled'] || order?.updatedAt || order?.createdAt
    steps.push({
      key: 'cancelled', label: 'Cancelled', subLabel: order?.cancelReason || 'Order was cancelled',
      Icon: IconX, completed: false, current: true, pending: false, timestamp: cancelTs,
    })
  }

  // Build a rich history list from statusHistory or fallback
  const historySource = Array.isArray(order?.statusHistory) && order.statusHistory.length > 0
    ? order.statusHistory
    : TRACK_STEPS
        .filter((_, i) => currentStatus !== 'cancelled' && i <= currentIndex)
        .map((step) => ({ status: step.key, changedAt: order?.updatedAt || order?.createdAt }))

  const history = [
    ...historySource,
    ...(currentStatus === 'cancelled' && !historySource.some(h => normalizeTrackingStatus(h.status) === 'cancelled')
      ? [{ status: 'cancelled', changedAt: order?.updatedAt || order?.createdAt, note: order?.cancelReason }]
      : []),
  ].map((entry) => {
    const status = normalizeTrackingStatus(entry?.status)
    const config = TRACK_STEPS.find((s) => s.key === status) || { key: status, label: status, Icon: IconBox, subLabel: '' }
    let label = config.label, StepIcon = config.Icon, subLabel = config.subLabel
    if (status === 'cancelled') {
      label = 'Cancelled'; StepIcon = IconX; subLabel = entry?.note || order?.cancelReason || ''
    }
    const stepIdx   = TRACK_STEPS.findIndex((s) => s.key === status)
    const isCurrent = status === currentStatus
    const isCompleted = currentStatus === 'cancelled' ? false : stepIdx < currentIndex || isCurrent
    const ts = entry?.changedAt || entry?.timestamp || entry?.createdAt || order?.updatedAt || order?.createdAt
    return {
      ...entry, status, label, StepIcon,
      subLabel: entry?.note || subLabel,
      isCurrent, isCompleted, timestamp: ts,
    }
  })

  return { steps, history, currentStatus }
}

const AccountPage = () => {
  const { user, isAuthenticated, logout, fetchFullProfile, updateProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [activeTab, setActiveTab] = useState('profile')

  // ── Personal Info Editing ──
  const [profileEditing, setProfileEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({})
  const [profileSaving, setProfileSaving] = useState(false)

  // ── Saved Addresses State ──
  const [savedAddresses, setSavedAddresses] = useState([])
  const [addressesLoading, setAddressesLoading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [addressSaving, setAddressSaving] = useState(false)
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    fullName: '',
    mobile: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isPrimary: false,
  })

  // ── Orders State ──
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersFetched, setOrdersFetched] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)
  const [confirmCancelId, setConfirmCancelId] = useState(null)

  // ── Order Address Editing State ──
  const [editingOrderAddrId, setEditingOrderAddrId] = useState(null)
  const [orderAddrForm, setOrderAddrForm] = useState({})
  const [orderAddrSaving, setOrderAddrSaving] = useState(false)
  const [retryingPaymentId, setRetryingPaymentId] = useState(null)

  // ── Timer refs for cleanup ──
  const cancelConfirmTimerRef = useRef(null)

  // ── Load Saved Addresses ──
  const fetchUserAddresses = useCallback(async () => {
    setAddressesLoading(true)
    try {
      const data = await getAddresses()
      setSavedAddresses(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error(err.message || 'Could not load addresses.', toastStyle)
    } finally {
      setAddressesLoading(false)
    }
  }, [])

  // ── Load Orders ──
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true)
    try {
      const data = await getMyOrders()
      setOrders(Array.isArray(data) ? data : [])
      setOrdersFetched(true)
    } catch (err) {
      toast.error(err.message || 'Could not load orders.', toastStyle)
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  // ── Initial data load ──
  useEffect(() => {
  if (!isAuthenticated) return
  fetchFullProfile()
  fetchUserAddresses()
  // intentionally omit fetchFullProfile / fetchUserAddresses if they are stable;
  // with useCallback above, including them is fine
}, [isAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Set profile form when user changes ──
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        countryCode: user.countryCode || '+91',
        mobile: user.mobile || '',
      })
    }
  }, [user])

  // ── Load orders when switching to orders tab ──
  useEffect(() => {
    if (activeTab === 'orders' && !ordersFetched) {
      fetchOrders()
    }
  }, [activeTab, ordersFetched, fetchOrders])

  // ── Cleanup timeout on unmount ──
  useEffect(() => {
    return () => {
      if (cancelConfirmTimerRef.current) {
        clearTimeout(cancelConfirmTimerRef.current)
      }
    }
  }, [])

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  const handleLogout = async () => {
    await logout()
    toast('You have been signed out.', { icon: '👋' })
    navigate('/')
  }

  // ── Profile Handlers ──
  const handleProfileChange = (e) => setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setProfileSaving(true)
    const result = await updateProfile(profileForm)
    setProfileSaving(false)
    if (result.success) {
      toast.success('Profile updated successfully!', { icon: '✅', ...toastStyle })
      setProfileEditing(false)
    } else {
      toast.error(result.message || 'Failed to update profile.', toastStyle)
    }
  }

  // ── Address Handlers ──
  const handleOpenAddAddress = () => {
    if (savedAddresses.length >= 7) {
      toast.error('Maximum 7 saved addresses allowed per user ID.', toastStyle)
      return
    }
    setEditingAddressId(null)
    setAddressForm({
      label: 'Home',
      fullName: user?.name || '',
      mobile: user?.mobile ? `${user.countryCode || ''}${user.mobile}` : '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      isPrimary: savedAddresses.length === 0,
    })
    setShowAddressForm(true)
  }

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr._id)
    setAddressForm({
      label: addr.label || 'Home',
      fullName: addr.fullName || '',
      mobile: addr.mobile || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      country: addr.country || 'India',
      isPrimary: !!addr.isPrimary,
    })
    setShowAddressForm(true)
  }

  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSaveAddress = async (e) => {
    e.preventDefault()
    setAddressSaving(true)
    try {
      if (editingAddressId) {
        const res = await updateAddress(editingAddressId, addressForm)
        setSavedAddresses(res.addresses || [])
        toast.success('Address updated successfully!', { icon: '✅', ...toastStyle })
      } else {
        const res = await addAddress(addressForm)
        setSavedAddresses(res.addresses || [])
        toast.success('New address added!', { icon: '📍', ...toastStyle })
      }
      setShowAddressForm(false)
      setEditingAddressId(null)
    } catch (err) {
      toast.error(err.message || 'Failed to save address.', toastStyle)
    } finally {
      setAddressSaving(false)
    }
  }

  const handleSetPrimaryAddress = async (addressId) => {
    try {
      const res = await setPrimaryAddress(addressId)
      setSavedAddresses(res.addresses || [])
      toast.success('Primary address updated!', { icon: '⭐', ...toastStyle })
    } catch (err) {
      toast.error(err.message || 'Could not set primary address.', toastStyle)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    if (savedAddresses.length <= 1) {
      toast.error('You must keep at least 1 saved address.', toastStyle)
      return
    }
    try {
      const res = await deleteAddress(addressId)
      setSavedAddresses(res.addresses || [])
      toast.success('Address deleted.', { icon: '🗑️', ...toastStyle })
    } catch (err) {
      toast.error(err.message || 'Could not delete address.', toastStyle)
    }
  }

  // ── Order History Handlers ──
  const handleCancelOrder = async (orderId) => {
    if (confirmCancelId !== orderId) {
      setConfirmCancelId(orderId)
      // Clear any existing timer
      if (cancelConfirmTimerRef.current) {
        clearTimeout(cancelConfirmTimerRef.current)
      }
      cancelConfirmTimerRef.current = setTimeout(() => {
        setConfirmCancelId(null)
        cancelConfirmTimerRef.current = null
      }, 4000)
      return
    }
    setCancellingId(orderId)
    try {
      await cancelOrder(orderId, 'Cancelled by customer.')
      toast.success('Order cancelled.', { icon: '🗑️', ...toastStyle })
      setConfirmCancelId(null)
      // Clear timer
      if (cancelConfirmTimerRef.current) {
        clearTimeout(cancelConfirmTimerRef.current)
        cancelConfirmTimerRef.current = null
      }
      await fetchOrders()
    } catch (err) {
      toast.error(err.message || 'Could not cancel order.', toastStyle)
    } finally {
      setCancellingId(null)
    }
  }

  const handleStartEditOrderAddr = (order) => {
    setEditingOrderAddrId(order._id)
    setOrderAddrForm({
      fullName: order.shippingAddress?.fullName || '',
      mobile: order.shippingAddress?.mobile || '',
      addressLine1: order.shippingAddress?.addressLine1 || '',
      addressLine2: order.shippingAddress?.addressLine2 || '',
      city: order.shippingAddress?.city || '',
      state: order.shippingAddress?.state || '',
      pincode: order.shippingAddress?.pincode || '',
      country: order.shippingAddress?.country || 'India',
    })
  }

  const handleSaveOrderAddr = async (e, orderId) => {
    e.preventDefault()
    setOrderAddrSaving(true)
    try {
      const res = await updateOrderShippingAddress(orderId, orderAddrForm)
      toast.success('Order shipping address updated!', { icon: '📦', ...toastStyle })
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.order : o))
      )
      setEditingOrderAddrId(null)
    } catch (err) {
      toast.error(err.message || 'Could not update order shipping address.', toastStyle)
    } finally {
      setOrderAddrSaving(false)
    }
  }

  const handleRetryPayment = async (order) => {
    setRetryingPaymentId(order._id)
    try {
      await loadRazorpayScript()
      // Use dedicated retry endpoint which creates a fresh Razorpay order
      const pmt = await retryPayment({ orderId: order._id })
      openRazorpayGateway(pmt, order)
    } catch (err) {
      toast.error(err.message || 'Could not initiate payment. Please try again.', toastStyle)
      setRetryingPaymentId(null)
    }
  }

  const openRazorpayGateway = (pmtData, orderObj) => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK failed to load.', toastStyle)
      setRetryingPaymentId(null)
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
        name: orderObj.shippingAddress?.fullName || user?.name,
        email: user?.email || '',
        contact: orderObj.shippingAddress?.mobile || user?.mobile,
      },
      notes: { orderId: orderObj._id },
      theme: { color: '#241A12' },
      handler: async function (response) {
        try {
          await verifyPayment({
            paymentId: pmtData.paymentId,
            gatewayOrderId: response.razorpay_order_id,
            gatewayPaymentId: response.razorpay_payment_id,
            gatewaySignature: response.razorpay_signature,
            status: 'success',
          })
          toast.success('Payment successful!', { icon: '✅', ...toastStyle })
          fetchOrders()
        } catch (err) {
          toast.error(err.message || 'Payment verification failed', toastStyle)
        } finally {
          setRetryingPaymentId(null)
        }
      },
      modal: {
        ondismiss: () => {
          toast.error('Payment cancelled.', toastStyle)
          setRetryingPaymentId(null)
        },
      },
    }
    try {
      new window.Razorpay(options).open()
    } catch (err) {
      console.error('Razorpay open error:', err)
      setRetryingPaymentId(null)
    }
  }

  const handleDownloadInvoice = async (orderId, orderNumber) => {
    try {
      const inv = await getInvoice(orderId)

      // Safe access with fallbacks
      const safeAccess = (obj, path, fallback = '') => {
        return path.split('.').reduce((acc, key) => acc?.[key] ?? fallback, obj)
      }

      const html = `<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${safeAccess(inv, 'invoiceNumber', 'N/A')}</title>
  <style>
    body{font-family:Arial,sans-serif;margin:30px;color:#333;}
    .container{max-width:900px;margin:auto;border:1px solid #ccc;padding:20px;}
    .header{display:flex;justify-content:space-between;flex-wrap:wrap;}
    .address-section{display:flex;justify-content:space-between;margin-top:20px;flex-wrap:wrap;}
    .address-box{width:45%;font-size:13px;min-width:200px;}
    table{width:100%;border-collapse:collapse;margin-top:20px;}
    table th, table td{border:1px solid #ccc;padding:8px;text-align:left;}
    table th{background:#f3f3f3;}
    .totals{width:300px;margin-left:auto;margin-top:20px;}
    .signature{text-align:right;margin-top:80px;}
    .title{font-size:25px;font-weight:bold;}
    @media print{body{margin:15px;}}
  </style>
</head>
<body>
<div class="container">
  <div class="header">
    <div>
      <div class="title">HOUSE OF TOSHALI</div>
      <p>Seller Name<br>Seller Address</p>
    </div>
    <div>
      <p><b>Invoice No:</b> ${safeAccess(inv, 'invoiceNumber', 'N/A')}</p>
      <p><b>Date:</b> ${safeAccess(inv, 'issuedAt') ? new Date(inv.issuedAt).toLocaleDateString() : 'N/A'}</p>
      <p><b>GSTIN:</b> 21XXXXXXXXXXX</p>
    </div>
  </div>
  <hr>
  <div class="address-section">
    <div class="address-box">
      <h4>Billing Customer</h4>
      ${safeAccess(inv, 'customer.name', 'N/A')}<br>
      ${safeAccess(inv, 'customer.email', 'N/A')}<br>
      ${safeAccess(inv, 'customer.mobile', 'N/A')}
    </div>
    <div class="address-box">
      <h4>Shipping Address</h4>
      ${safeAccess(inv, 'shippingAddress.fullName', 'N/A')}<br>
      ${safeAccess(inv, 'shippingAddress.addressLine1', 'N/A')}
      ${safeAccess(inv, 'shippingAddress.addressLine2') ? `<br>${inv.shippingAddress.addressLine2}` : ''}<br>
      ${safeAccess(inv, 'shippingAddress.city', 'N/A')}, ${safeAccess(inv, 'shippingAddress.state', 'N/A')} – ${safeAccess(inv, 'shippingAddress.pincode', 'N/A')}
    </div>
  </div>
  <table>
    <tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr>
    ${(inv.items || []).map((item) => `<tr><td>${item.name || 'Unknown'}</td><td>${item.quantity || 0}</td><td>₹${item.price || 0}</td><td>₹${item.lineTotal || 0}</td></tr>`).join('')}
  </table>
  <div class="totals">
    <p><b>Subtotal:</b> ₹${inv.subtotal || 0}</p>
    <p><b>Shipping:</b> ₹${inv.shippingCharge || 0}</p>
    <h3>Grand Total: ₹${inv.grandTotal || 0}</h3>
  </div>
  <div class="signature">
    <p>Authorized Signature</p>
    <strong>HOUSE OF TOSHALI</strong>
  </div>
</div>
</body>
</html>`

      const win = window.open('', '_blank')
      if (win) {
        win.document.write(html)
        win.document.close()
        win.print()
      } else {
        toast.error('Please allow popups to download the invoice.', toastStyle)
      }
    } catch (err) {
      toast.error(err.message || 'Could not load invoice.', toastStyle)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'address', label: `Addresses (${savedAddresses.length}/7)` },
    { id: 'orders', label: 'Order History' },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] bg-[#FBF7EF] px-4 md:px-6 py-10 md:py-14">
        <div className="max-w-3xl mx-auto">

          {/* Header Card */}
          <div className="bg-white rounded-[24px] border border-[#241A12]/10 shadow-[0_1px_2px_rgba(36,26,18,0.04)] p-7 md:p-8 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-[#241A12] flex items-center justify-center text-[#F1E6C8] font-serif font-semibold text-2xl flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-serif text-2xl text-[#241A12] mb-1 tracking-tight">{user?.name || 'User'}</h1>
              <p className="text-sm text-[#8C7B65] mb-2.5">{user?.email || 'No email'}</p>
              <span className="inline-block text-[10px] font-bold text-[#A9792F] bg-[#F1E6C8] px-3 py-1 rounded-full uppercase tracking-[0.08em]">
                {user?.role || 'Customer'} Account
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold text-[#241A12] border border-[#241A12]/14 hover:border-[#241A12]/30 hover:bg-[#FBF7EF] px-5 py-2.5 rounded-xl transition-colors flex-shrink-0"
            >
              <IconLogout className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 mb-6 border-b border-[#241A12]/10 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative text-sm font-semibold px-4 py-3 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'text-[#241A12]' : 'text-[#8C7B65] hover:text-[#241A12]'
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#A9792F] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* ══════════ TAB 1: PROFILE ══════════ */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-[24px] border border-[#241A12]/10 p-7 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-[#241A12]">Personal Information</h3>
                {!profileEditing && (
                  <button onClick={() => setProfileEditing(true)} className="flex items-center gap-1.5 text-xs font-bold text-[#A9792F] hover:text-[#241A12] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#FBF7EF]">
                    <IconPencil className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
              </div>

              {!profileEditing ? (
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-[#241A12]/6 pb-3.5">
                    <span className="text-[#8C7B65]">Full Name</span>
                    <span className="font-semibold text-[#241A12]">{user?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#241A12]/6 pb-3.5">
                    <span className="text-[#8C7B65]">Email</span>
                    <span className="font-semibold text-[#241A12]">{user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C7B65]">Mobile</span>
                    <span className="font-semibold text-[#241A12] tabular-nums">{user?.countryCode || ''} {user?.mobile || 'N/A'}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input name="name" value={profileForm.name} onChange={handleProfileChange} className={inputClass} />
                  </div>
                  <div className="flex gap-2">
                    <input name="countryCode" value={profileForm.countryCode} onChange={handleProfileChange} className={`${inputClass} w-20 flex-shrink-0`} />
                    <input name="mobile" value={profileForm.mobile} onChange={handleProfileChange} className={`${inputClass} flex-1`} />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="submit" disabled={profileSaving} className="bg-[#241A12] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#3a2a1c] transition-colors disabled:opacity-60">
                      {profileSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => setProfileEditing(false)} className="text-sm font-semibold text-[#8C7B65] hover:text-[#241A12] transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ══════════ TAB 2: ADDRESS ══════════ */}
          {activeTab === 'address' && (
            <div className="bg-white rounded-[24px] border border-[#241A12]/10 p-7 md:p-8 space-y-6">

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl text-[#241A12]">Saved Addresses</h3>
                  <p className="text-xs text-[#8C7B65] mt-0.5">
                    Save up to 7 addresses per account. Set one as your primary address.
                  </p>
                </div>

                {!showAddressForm && (
                  <button
                    onClick={handleOpenAddAddress}
                    disabled={savedAddresses.length >= 7}
                    className="bg-[#241A12] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#3a2a1c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <span>+ Add New Address</span>
                    <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full tabular-nums">{savedAddresses.length}/7</span>
                  </button>
                )}
              </div>

              {/* Add / Edit Form */}
              {showAddressForm && (
                <div className="bg-[#FBF7EF] rounded-2xl border border-[#A9792F]/30 p-6 space-y-4">
                  <h4 className="font-serif text-base text-[#241A12] border-b border-[#241A12]/8 pb-2">
                    {editingAddressId ? 'Edit Address' : 'Add New Address (Max 7 Total)'}
                  </h4>

                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Address Label</label>
                        <select name="label" value={addressForm.label} onChange={handleAddressFormChange} className={inputClass}>
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Office">Office</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Full Name *</label>
                        <input required name="fullName" value={addressForm.fullName} onChange={handleAddressFormChange} className={inputClass} placeholder="Full Name" />
                      </div>
                      <div>
                        <label className={labelClass}>Mobile Number *</label>
                        <input required name="mobile" value={addressForm.mobile} onChange={handleAddressFormChange} className={inputClass} placeholder="10-digit mobile" />
                      </div>
                      <div>
                        <label className={labelClass}>Pincode *</label>
                        <input required name="pincode" value={addressForm.pincode} onChange={handleAddressFormChange} className={inputClass} placeholder="6-digit pincode" maxLength={6} />
                      </div>
                      <div className="col-span-2">
                        <label className={labelClass}>Address Line 1 *</label>
                        <input required name="addressLine1" value={addressForm.addressLine1} onChange={handleAddressFormChange} className={inputClass} placeholder="House / Building / Street" />
                      </div>
                      <div className="col-span-2">
                        <label className={labelClass}>Address Line 2</label>
                        <input name="addressLine2" value={addressForm.addressLine2} onChange={handleAddressFormChange} className={inputClass} placeholder="Landmark / Locality (optional)" />
                      </div>
                      <div>
                        <label className={labelClass}>City *</label>
                        <input required name="city" value={addressForm.city} onChange={handleAddressFormChange} className={inputClass} placeholder="City" />
                      </div>
                      <div>
                        <label className={labelClass}>State *</label>
                        <input required name="state" value={addressForm.state} onChange={handleAddressFormChange} className={inputClass} placeholder="State" />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className={labelClass}>Country</label>
                        <input name="country" value={addressForm.country} onChange={handleAddressFormChange} className={inputClass} />
                      </div>
                    </div>

                    <label htmlFor="isPrimaryCheck" className="flex items-center gap-2 pt-1 cursor-pointer w-fit">
                      <input
                        type="checkbox"
                        id="isPrimaryCheck"
                        name="isPrimary"
                        checked={addressForm.isPrimary}
                        onChange={handleAddressFormChange}
                        className="accent-[#A9792F] w-4 h-4"
                      />
                      <span className="text-xs font-semibold text-[#241A12]">
                        Set as Primary Address (default at checkout)
                      </span>
                    </label>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={addressSaving}
                        className="bg-[#241A12] text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#3a2a1c] transition-colors disabled:opacity-60"
                      >
                        {addressSaving ? 'Saving…' : editingAddressId ? 'Update Address' : 'Save Address'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowAddressForm(false); setEditingAddressId(null) }}
                        className="text-xs font-semibold text-[#8C7B65] hover:text-[#241A12] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Saved Addresses Cards */}
              {addressesLoading ? (
                <div className="p-8 text-center text-sm text-[#8C7B65]">Loading saved addresses…</div>
              ) : savedAddresses.length === 0 ? (
                <div className="text-center py-10 bg-[#FBF7EF] rounded-2xl border border-dashed border-[#241A12]/15">
                  <IconPin className="w-6 h-6 text-[#A9792F] mx-auto mb-3" />
                  <p className="text-sm text-[#8C7B65] mb-3">No saved addresses yet.</p>
                  <button onClick={handleOpenAddAddress} className="bg-[#241A12] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#3a2a1c] transition-colors">
                    + Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr._id}
                      className={`rounded-2xl p-5 border transition-colors ${addr.isPrimary
                          ? 'border-[#A9792F]/40 bg-[#FBF7EF]'
                          : 'border-[#241A12]/10 bg-white hover:border-[#241A12]/20'
                        }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#241A12] bg-[#241A12]/5 px-3 py-1 rounded-lg uppercase tracking-wide">
                            {addr.label || 'Home'}
                          </span>
                          {addr.isPrimary && (
                            <span className="text-[11px] font-bold text-[#A9792F] bg-[#F1E6C8] px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                              <IconStar className="w-3 h-3" /> Primary Address
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {!addr.isPrimary && (
                            <button
                              onClick={() => handleSetPrimaryAddress(addr._id)}
                              className="text-xs font-semibold text-[#A9792F] border border-[#A9792F]/30 hover:bg-[#F1E6C8] px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Set Primary
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEditAddress(addr)}
                            className="text-xs font-semibold text-[#241A12] border border-[#241A12]/15 hover:bg-[#FBF7EF] px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            disabled={savedAddresses.length <= 1}
                            className="text-xs font-semibold text-[#B3503A] border border-[#B3503A]/25 hover:bg-[#F8E9E4] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-sm font-bold text-[#241A12] mb-1">{addr.fullName} · {addr.mobile}</p>
                      <p className="text-xs text-[#6b5940] leading-relaxed">
                        {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                        {addr.city}, {addr.state} – {addr.pincode}, {addr.country || 'India'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════ TAB 3: ORDER HISTORY ══════════ */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-[#241A12]">Order History</h3>
                <button
                  onClick={fetchOrders}
                  disabled={ordersLoading}
                  className="text-xs font-semibold text-[#A9792F] hover:text-[#241A12] transition-colors disabled:opacity-50 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#241A12]/10"
                >
                  <IconRefresh className={`w-3.5 h-3.5 ${ordersLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {ordersLoading && (
                <div className="bg-white rounded-[24px] border border-[#241A12]/10 p-12 text-center">
                  <div className="w-8 h-8 border-[3px] border-[#A9792F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-[#8C7B65]">Loading orders…</p>
                </div>
              )}

              {!ordersLoading && orders.length === 0 && (
                <div className="bg-white rounded-[24px] border border-[#241A12]/10 p-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#F1E6C8] flex items-center justify-center text-[#A9792F] mx-auto mb-5">
                    <IconBag className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl text-[#241A12] mb-2">No orders yet</h3>
                  <p className="text-sm text-[#6b5940] mb-6">Browse our products and place your first order.</p>
                  <Link to="/products" className="inline-block bg-[#241A12] text-white text-sm font-bold px-7 py-3 rounded-xl hover:bg-[#3a2a1c] transition-colors">
                    Shop Now
                  </Link>
                </div>
              )}

              {!ordersLoading && orders.map((order) => {
                const isExpanded = expandedOrder === order._id
                const isCancellable = ['placed', 'confirmed'].includes(order.orderStatus)
                const isAddressEditable = ['placed', 'confirmed', 'processing'].includes(order.orderStatus)
                const isCancelled = order.orderStatus === 'cancelled'
                const tracking = getTrackingData(order)

                const statusColor = {
                  placed: 'bg-[#EDF1F6] text-[#4A6183]',
                  confirmed: 'bg-[#F1E6C8] text-[#A9792F]',
                  processing: 'bg-[#FBF1DD] text-[#9C7A1E]',
                  shipped: 'bg-[#EFEAF6] text-[#6C5A9C]',
                  delivered: 'bg-[#E9EFE7] text-[#5C7A5A]',
                  cancelled: 'bg-[#F8E9E4] text-[#B3503A]',
                }[order.orderStatus] || 'bg-gray-100 text-gray-500'

                const payColor = {
                  pending: 'text-[#9C7A1E]',
                  paid: 'text-[#5C7A5A]',
                  failed: 'text-[#B3503A]',
                }[order.paymentStatus] || 'text-[#8C7B65]'

                return (
                  <div key={order._id} className="bg-white rounded-2xl border border-[#241A12]/10 overflow-hidden">

                    {/* Order Header Row — receipt-stub style */}
                    <div className="px-6 py-5 flex flex-wrap items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#241A12] font-mono tracking-tight">#{order.orderNumber || 'N/A'}</p>
                        <p className="text-xs text-[#8C7B65] mt-0.5">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</p>
                      </div>

                      <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full capitalize ${statusColor}`}>
                        {order.orderStatus || 'unknown'}
                      </span>

                      <div className="text-right">
                        <p className="text-sm font-bold text-[#241A12] tabular-nums">₹{Number(order.grandTotal || 0).toFixed(2)}</p>
                        <p className={`text-[11px] font-semibold capitalize ${payColor}`}>{order.paymentStatus || 'unknown'}</p>
                      </div>

                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                        className="w-8 h-8 rounded-full bg-[#FBF7EF] flex items-center justify-center text-[#8C7B65] hover:text-[#241A12] hover:bg-[#F1E6C8] transition-colors flex-shrink-0"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <IconChevron className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Expanded Order Details */}
                    {isExpanded && (
                      <div className="border-t border-dashed border-[#241A12]/15 px-6 py-6 space-y-5 bg-[#FEFDFB]">
                        {/* Order Progress Stepper */}
                        <div className="rounded-2xl border border-[#241A12]/8 bg-[#FBF7EF] p-4">
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#A9792F]">Order Progress</p>
                            <span className="rounded-full border border-[#241A12]/10 bg-white px-3 py-1 text-[11px] font-semibold capitalize text-[#241A12]">
                              {tracking.currentStatus === 'cancelled'
                                ? 'Cancelled'
                                : (tracking.steps.find((step) => step.current)?.label || 'Placed')}
                            </span>
                          </div>

                          {/* Stepper nodes */}
                          <div className="flex items-start overflow-x-auto pb-1">
                            {tracking.steps.map((step, idx) => {
                              const isLast = idx === tracking.steps.length - 1
                              const isCancel = step.key === 'cancelled'
                              const StepIcon = step.Icon
                              return (
                                <React.Fragment key={step.key}>
                                  <div className="flex flex-col items-center flex-shrink-0" style={{ minWidth: 64, maxWidth: 84 }}>
                                    {/* Node */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                      step.current
                                        ? isCancel
                                          ? 'bg-[#B3503A] border-[#B3503A] text-white'
                                          : 'bg-[#241A12] border-[#241A12] text-white'
                                        : step.completed
                                          ? 'bg-[#A9792F] border-[#A9792F] text-white'
                                          : 'bg-white border-[#241A12]/15 text-[#c8bfb0]'
                                    }`}>
                                      {step.completed
                                        ? <IconCheck className="w-3.5 h-3.5" />
                                        : StepIcon ? <StepIcon className="w-3.5 h-3.5" /> : idx + 1}
                                    </div>
                                    {/* Label */}
                                    <p className={`mt-1.5 text-[9px] font-bold text-center leading-tight ${
                                      step.current ? (isCancel ? 'text-[#B3503A]' : 'text-[#241A12]')
                                      : step.completed ? 'text-[#A9792F]'
                                      : 'text-[#c8bfb0]'
                                    }`}>{step.label}</p>
                                    {/* Timestamp */}
                                    {(step.current || step.completed) && step.timestamp && (
                                      <p className="text-[8px] text-[#a89c8a] text-center mt-0.5 leading-tight font-mono">
                                        {formatTrackingDate(step.timestamp)}
                                      </p>
                                    )}
                                  </div>
                                  {/* Connector line (not after last) */}
                                  {!isLast && (
                                    <div className={`flex-1 h-0.5 mt-4 mx-0.5 min-w-[16px] transition-all ${
                                      step.completed ? 'bg-[#A9792F]'
                                      : step.current  ? 'bg-gradient-to-r from-[#241A12] to-[#241A12]/15'
                                      : 'bg-[#241A12]/10'
                                    }`} />
                                  )}
                                </React.Fragment>
                              )
                            })}
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-[#A9792F] uppercase tracking-[0.08em]">Items</p>
                          {(order.items || []).map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-[#FBF7EF] rounded-xl px-3.5 py-3 border border-[#241A12]/6">
                              {item.imageUrl && (
                                <img src={item.imageUrl} alt={item.name} className="w-11 h-11 object-contain rounded-lg bg-white p-1 flex-shrink-0 border border-[#241A12]/8" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[#241A12] truncate">{item.name || 'Unknown'}</p>
                                <p className="text-[11px] text-[#8C7B65] mt-0.5 tabular-nums">Qty: {item.quantity || 0} × ₹{Number(item.price || 0).toFixed(2)}</p>
                              </div>
                              <p className="text-xs font-bold text-[#241A12] flex-shrink-0 tabular-nums">₹{Number(item.lineTotal || 0).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Pricing Breakdown */}
                        <div className="border-t border-[#241A12]/8 pt-4 space-y-1.5 text-sm">
                          <div className="flex justify-between text-[#6b5940]">
                            <span>Subtotal</span><span className="tabular-nums">₹{Number(order.subtotal || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-[#6b5940]">
                            <span>Shipping</span><span className="tabular-nums">{order.shippingCharge === 0 || !order.shippingCharge ? 'Free' : '₹' + Number(order.shippingCharge).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-[#241A12] pt-1">
                            <span>Total</span><span className="text-[#A9792F] tabular-nums">₹{Number(order.grandTotal || 0).toFixed(2)}</span>
                          </div>
                        </div>

                        {/* ── Stitched ledger timeline ── */}
                        <div className="rounded-2xl border border-[#241A12]/8 bg-[#FBF7EF] p-4 sm:p-5">
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#A9792F]">Tracking Timeline</p>
                            <span className="text-[11px] text-[#6b5940] font-mono">
                              Last update: {formatTrackingDate(order.updatedAt || order.createdAt) || 'Pending'}
                            </span>
                          </div>

                          {isCancelled && order.cancelReason && (
                            <div className="mb-4 bg-[#F8E9E4] border border-[#B3503A]/25 rounded-xl px-3.5 py-3 flex items-start gap-2.5">
                              <IconX className="w-4 h-4 text-[#B3503A] flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-[#B3503A]">Order Cancelled</p>
                                <p className="text-[11px] text-[#B3503A]/85 mt-0.5">Reason: {order.cancelReason}</p>
                              </div>
                            </div>
                          )}

                          {tracking.history.length > 0 ? (
                            <div className="relative pl-8">
                              {/* stitched vertical thread */}
                              <div className="absolute left-[13px] top-1.5 bottom-1.5 border-l-2 border-dashed border-[#A9792F]/35" />
                              <div className="space-y-3">
                                {[...tracking.history].reverse().map((entry, index) => {
                                  const EntryIcon = entry.StepIcon || IconBox
                                  return (
                                    <div key={`${entry.status}-${index}`} className="relative">
                                      {/* node on the thread */}
                                      <div className={`absolute -left-8 top-0 w-[26px] h-[26px] rounded-full flex items-center justify-center border-2 border-[#FBF7EF] ${
                                        entry.isCurrent
                                          ? entry.status === 'cancelled' ? 'bg-[#B3503A] text-white' : 'bg-[#241A12] text-white'
                                          : entry.isCompleted ? 'bg-[#A9792F] text-white'
                                          : 'bg-[#F1E6C8] text-[#A9792F]'
                                      }`}>
                                        <EntryIcon className="w-3 h-3" />
                                      </div>
                                      <div className={`rounded-xl border px-3.5 py-3 transition-colors ${
                                        entry.isCurrent
                                          ? entry.status === 'cancelled'
                                            ? 'border-[#B3503A]/30 bg-white'
                                            : 'border-[#A9792F]/40 bg-white'
                                          : 'border-[#241A12]/6 bg-white'
                                      }`}>
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                          <p className={`text-xs font-bold capitalize ${
                                            entry.status === 'cancelled' ? 'text-[#B3503A]'
                                            : entry.isCurrent ? 'text-[#241A12]'
                                            : 'text-[#6b5940]'
                                          }`}>{entry.label || entry.status}</p>
                                          {entry.timestamp && (
                                            <span className="text-[10px] text-[#8C7B65] font-mono">
                                              {formatTrackingDateTime(entry.timestamp)}
                                            </span>
                                          )}
                                        </div>
                                        {entry.subLabel && (
                                          <p className="text-[11px] text-[#8C7B65] mt-0.5 italic">{entry.subLabel}</p>
                                        )}
                                        {entry.isCurrent && entry.status !== 'cancelled' && (
                                          <p className="text-[10px] font-semibold text-[#A9792F] mt-1 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#A9792F] inline-block" /> Currently in progress
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-center text-[#6b5940] py-4">
                              Tracking information will appear once the order starts moving.
                            </p>
                          )}
                        </div>

                        {/* Delivery Address Section */}
                        {order.shippingAddress && (
                          <div className="bg-[#FBF7EF] rounded-xl px-4 py-3.5 border border-[#241A12]/8 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[10px] font-bold text-[#A9792F] uppercase tracking-[0.08em]">Delivery Address (Order Record)</p>
                                <span className="text-[10px] text-[#8C7B65]">Updates this order only</span>
                              </div>
                              {isAddressEditable && editingOrderAddrId !== order._id && (
                                <button
                                  onClick={() => handleStartEditOrderAddr(order)}
                                  className="flex items-center gap-1.5 text-xs font-bold text-[#A9792F] hover:text-[#241A12] border border-[#A9792F]/30 hover:bg-[#F1E6C8] px-3 py-1 rounded-lg transition-colors"
                                >
                                  <IconPencil className="w-3 h-3" /> Change Address
                                </button>
                              )}
                            </div>

                            {/* View Mode */}
                            {editingOrderAddrId !== order._id ? (
                              <div>
                                <p className="text-sm font-semibold text-[#241A12]">{order.shippingAddress.fullName} · {order.shippingAddress.mobile}</p>
                                <p className="text-xs text-[#6b5940] mt-0.5">
                                  {order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''}, {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                                </p>
                              </div>
                            ) : (
                              /* Inline Edit Order Shipping Address Form */
                              <form onSubmit={(e) => handleSaveOrderAddr(e, order._id)} className="space-y-3 bg-white p-4 rounded-xl border border-[#A9792F]/40 mt-2">
                                <p className="text-xs font-bold text-[#241A12]">Modify Shipping Address for Order #{order.orderNumber}</p>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className={labelClass}>Full Name *</label>
                                    <input required name="fullName" value={orderAddrForm.fullName || ''} onChange={(e) => setOrderAddrForm((p) => ({ ...p, fullName: e.target.value }))} className={inputClass} />
                                  </div>
                                  <div>
                                    <label className={labelClass}>Mobile *</label>
                                    <input required name="mobile" value={orderAddrForm.mobile || ''} onChange={(e) => setOrderAddrForm((p) => ({ ...p, mobile: e.target.value }))} className={inputClass} />
                                  </div>
                                  <div className="col-span-2">
                                    <label className={labelClass}>Address Line 1 *</label>
                                    <input required name="addressLine1" value={orderAddrForm.addressLine1 || ''} onChange={(e) => setOrderAddrForm((p) => ({ ...p, addressLine1: e.target.value }))} className={inputClass} />
                                  </div>
                                  <div className="col-span-2">
                                    <label className={labelClass}>Address Line 2</label>
                                    <input name="addressLine2" value={orderAddrForm.addressLine2 || ''} onChange={(e) => setOrderAddrForm((p) => ({ ...p, addressLine2: e.target.value }))} className={inputClass} />
                                  </div>
                                  <div>
                                    <label className={labelClass}>City *</label>
                                    <input required name="city" value={orderAddrForm.city || ''} onChange={(e) => setOrderAddrForm((p) => ({ ...p, city: e.target.value }))} className={inputClass} />
                                  </div>
                                  <div>
                                    <label className={labelClass}>Pincode *</label>
                                    <input required name="pincode" value={orderAddrForm.pincode || ''} onChange={(e) => setOrderAddrForm((p) => ({ ...p, pincode: e.target.value }))} className={inputClass} maxLength={6} />
                                  </div>
                                  <div>
                                    <label className={labelClass}>State *</label>
                                    <input required name="state" value={orderAddrForm.state || ''} onChange={(e) => setOrderAddrForm((p) => ({ ...p, state: e.target.value }))} className={inputClass} />
                                  </div>
                                  <div>
                                    <label className={labelClass}>Country</label>
                                    <input name="country" value={orderAddrForm.country || 'India'} onChange={(e) => setOrderAddrForm((p) => ({ ...p, country: e.target.value }))} className={inputClass} />
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                  <button
                                    type="submit"
                                    disabled={orderAddrSaving}
                                    className="bg-[#241A12] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#3a2a1c] transition-colors disabled:opacity-60"
                                  >
                                    {orderAddrSaving ? 'Saving…' : 'Save Order Address'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingOrderAddrId(null)}
                                    className="text-xs font-semibold text-[#8C7B65] hover:text-[#241A12]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        )}

                        {/* Payment Method */}
                        <div className="flex items-center gap-2 text-xs text-[#6b5940]">
                          <IconCard className="w-3.5 h-3.5 flex-shrink-0" />
                          Payment: <span className="font-semibold text-[#241A12] capitalize">{order.paymentMethod || 'N/A'}</span>
                          &nbsp;·&nbsp;
                          <span className={`font-semibold capitalize ${payColor}`}>{order.paymentStatus || 'unknown'}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2.5 pt-1">
                          <button
                            onClick={() => handleDownloadInvoice(order._id, order.orderNumber)}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#241A12] border border-[#241A12]/15 px-4 py-2.5 rounded-xl hover:bg-[#F1E6C8] hover:border-[#A9792F] transition-colors"
                          >
                            <IconDownload className="w-3.5 h-3.5" />
                            Invoice
                          </button>

                          {isCancellable && !isCancelled && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              disabled={cancellingId === order._id}
                              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all disabled:opacity-60 ${confirmCancelId === order._id
                                  ? 'bg-[#B3503A] text-white animate-pulse'
                                  : 'text-[#B3503A] border border-[#B3503A]/25 hover:bg-[#F8E9E4]'
                                }`}
                            >
                              {cancellingId === order._id
                                ? 'Cancelling…'
                                : confirmCancelId === order._id
                                  ? 'Confirm Cancel?'
                                  : 'Cancel Order'}
                            </button>
                          )}

                          {/* Retry Payment — only for non-paid, non-cancelled, non-COD orders */}
                          {order.paymentStatus !== 'paid' &&
                            order.paymentMethod !== 'cod' &&
                            !isCancelled && (
                            <button
                              onClick={() => handleRetryPayment(order)}
                              disabled={retryingPaymentId === order._id}
                              className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#A9792F] hover:bg-[#8C6226] px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60"
                            >
                              <IconCard className="w-3.5 h-3.5" />
                              {retryingPaymentId === order._id ? 'Opening...' : (
                                order.paymentStatus === 'failed' ? 'Retry Payment' : 'Complete Payment'
                              )}
                            </button>
                          )}
                        </div>

                        {isCancelled && order.cancelReason && (
                          <p className="text-xs text-[#B3503A] bg-[#F8E9E4] rounded-xl px-3.5 py-2.5">
                            Reason: {order.cancelReason}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AccountPage