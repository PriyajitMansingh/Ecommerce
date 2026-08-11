import Order from '../models/Order.js'
import Payment from '../models/Payment.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import GiftProduct from '../models/GiftProduct.js'
import Coupon from '../models/Coupon.js'
import { findOrCreateCart } from './cartController.js'

const buildOrderItemsFromCart = async (cart) => {
  const orderItems = []

  for (const item of cart.items || []) {
    const productType = item.productType === 'gift' ? 'gift' : 'product'

    if (productType === 'gift') {
      const giftProduct = await GiftProduct.findById(item.product)
      if (!giftProduct) {
        throw new Error('One of the gift items is no longer available.')
      }

      orderItems.push({
        productId: giftProduct._id,
        productType,
        name: giftProduct.name,
        imageUrl: giftProduct.image || '',
        price: giftProduct.price,
        quantity: item.quantity,
        lineTotal: giftProduct.price * item.quantity,
      })
      continue
    }

    const product = await Product.findById(item.product)
    if (!product || !product.isActive) {
      throw new Error(`Product "${product?.name || 'Unknown product'}" is no longer available.`)
    }
    if (product.stockQty < item.quantity) {
      throw new Error(`Only ${product.stockQty} unit(s) of "${product.name}" are available.`)
    }

    orderItems.push({
      productId: product._id,
      productType,
      name: product.name,
      imageUrl: product.imageUrl || '',
      price: product.price,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity,
    })
  }

  return orderItems
}

// POST /api/orders  — create order from current cart
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, couponCode, discountAmount, notes } = req.body

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Shipping address and payment method are required.' })
    }

    const requiredAddr = ['fullName', 'mobile', 'addressLine1', 'city', 'state', 'pincode']
    for (const field of requiredAddr) {
      if (!shippingAddress[field]?.trim()) {
        return res.status(400).json({ message: `Shipping address field "${field}" is required.` })
      }
    }

    const cart = await findOrCreateCart(req.user._id)
    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' })
    }

    const orderItems = await buildOrderItemsFromCart(cart)
    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' })
    }

    const subtotal = orderItems.reduce((s, i) => s + i.lineTotal, 0)
    const validDiscount = typeof discountAmount === 'number' && discountAmount > 0 ? Math.min(discountAmount, subtotal) : 0
    const shippingCharge = subtotal >= 499 ? 0 : 49
    const grandTotal = Math.max(0, subtotal - validDiscount + shippingCharge)

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      couponCode: couponCode || '',
      discountAmount: validDiscount,
      shippingCharge,
      grandTotal,
      paymentMethod,
      notes: notes || '',
      statusHistory: [{ status: 'placed', note: 'Order placed by customer.' }],
    })

    for (const item of orderItems) {
      if (item.productType === 'gift') continue
      await Product.findByIdAndUpdate(item.productId, { $inc: { stockQty: -item.quantity } })
    }

    // Increment coupon usedCount if a coupon was applied
    if (couponCode && validDiscount > 0) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.trim().toUpperCase() },
        { $inc: { usedCount: 1 } }
      )
    }

    cart.items = []
    await cart.save()

    res.status(201).json(order)
  } catch (error) {
    console.error('createOrder error:', error)
    res.status(500).json({ message: error.message || 'Could not place order. Please try again.' })
  }
}

// GET /api/orders  — my orders (includes statusHistory for live tracking)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error('getMyOrders error:', error)
    res.status(500).json({ message: 'Could not load orders.' })
  }
}

// GET /api/orders/:orderId
export const getOrderById = async (req, res) => {
  try {
    let order
    if (req.user && req.user.role === 'Admin') {
      order = await Order.findById(req.params.orderId).populate('userId', 'name email countryCode mobile')
    } else {
      order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id })
    }
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    res.json(order)
  } catch (error) {
    console.error('getOrderById error:', error)
    res.status(500).json({ message: 'Could not load order.' })
  }
}

// POST /api/orders/:orderId/cancel
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found.' })

    const cancellable = ['placed', 'confirmed']
    if (!cancellable.includes(order.orderStatus)) {
      return res.status(400).json({ message: `Order cannot be cancelled once it is "${order.orderStatus}".` })
    }

    order.orderStatus = 'cancelled'
    order.cancelReason = req.body.reason || 'Cancelled by customer.'
    order.statusHistory.push({ status: 'cancelled', note: order.cancelReason })

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stockQty: item.quantity } })
    }

    await order.save()
    res.json({ message: 'Order cancelled.', order })
  } catch (error) {
    console.error('cancelOrder error:', error)
    res.status(500).json({ message: 'Could not cancel order.' })
  }
}

// GET /api/orders/:orderId/status-history  — customer OR admin
export const getStatusHistory = async (req, res) => {
  try {
    // Admin can view any order's history; customers only their own
    const query = req.user.role === 'Admin'
      ? { _id: req.params.orderId }
      : { _id: req.params.orderId, userId: req.user._id }
    const order = await Order.findOne(query).select('statusHistory orderNumber orderStatus')
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    res.json({ orderNumber: order.orderNumber, orderStatus: order.orderStatus, statusHistory: order.statusHistory })
  } catch (error) {
    res.status(500).json({ message: 'Could not load status history.' })
  }
}

// GET /api/orders/:orderId/invoice
export const getInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id })
      .populate('userId', 'name email countryCode mobile')
    if (!order) return res.status(404).json({ message: 'Order not found.' })

    const invoice = {
      invoiceNumber: `INV-${order.orderNumber}`,
      issuedAt: order.createdAt,
      orderNumber: order.orderNumber,
      customer: {
        name: order.userId.name,
        email: order.userId.email,
        mobile: `${order.userId.countryCode} ${order.userId.mobile}`,
      },
      shippingAddress: order.shippingAddress,
      items: order.items,
      subtotal: order.subtotal,
      shippingCharge: order.shippingCharge,
      grandTotal: order.grandTotal,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
    }
    res.json(invoice)
  } catch (error) {
    console.error('getInvoice error:', error)
    res.status(500).json({ message: 'Could not generate invoice.' })
  }
}

// GET /api/orders/:orderId/tracking
export const getTracking = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id })
      .select('orderNumber orderStatus trackingNumber statusHistory')
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    res.json({
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      trackingNumber: order.trackingNumber || null,
      statusHistory: order.statusHistory,
    })
  } catch (error) {
    res.status(500).json({ message: 'Could not load tracking info.' })
  }
}

// POST /api/checkout/validate  — validate cart before proceeding to checkout
export const validateCheckout = async (req, res) => {
  try {
    const cart = await findOrCreateCart(req.user._id)
    const issues = []

    for (const item of cart.items || []) {
      const productType = item.productType === 'gift' ? 'gift' : 'product'

      if (productType === 'gift') {
        const giftProduct = await GiftProduct.findById(item.product)
        if (!giftProduct) {
          issues.push({ type: 'unavailable', name: 'Gift item' })
        }
        continue
      }

      const product = await Product.findById(item.product)
      if (!product || !product.isActive) {
        issues.push({ type: 'unavailable', name: product?.name || 'Unknown product' })
      } else if (product.stockQty < item.quantity) {
        issues.push({
          type: 'stock',
          name: product.name,
          available: product.stockQty,
          requested: item.quantity,
        })
      }
    }

    if (issues.length > 0) {
      return res.status(200).json({ valid: false, issues })
    }

    let subtotal = 0
    for (const item of cart.items || []) {
      const productType = item.productType === 'gift' ? 'gift' : 'product'
      if (productType === 'gift') {
        const giftProduct = await GiftProduct.findById(item.product)
        if (giftProduct) subtotal += giftProduct.price * item.quantity
      } else {
        const product = await Product.findById(item.product)
        if (product?.isActive) subtotal += product.price * item.quantity
      }
    }
    const shippingCharge = subtotal >= 499 ? 0 : 49

    res.json({
      valid: true,
      subtotal,
      shippingCharge,
      grandTotal: subtotal + shippingCharge,
      itemCount: (cart.items || []).length,
    })
  } catch (error) {
    console.error('validateCheckout error:', error)
    res.status(500).json({ message: 'Validation failed.' })
  }
}

// GET /api/orders/admin/all  — admin: all orders, newest first
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email countryCode mobile')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error('getAllOrdersAdmin error:', error)
    res.status(500).json({ message: 'Could not load orders.' })
  }
}

// ── Forward-only status pipeline (Flipkart-style) ──────────────────────────
const STATUS_PIPELINE = ['placed', 'confirmed', 'processing', 'shipped', 'delivered']

/**
 * Returns the list of valid NEXT statuses for a given current status.
 * - delivered / cancelled are terminal — nothing is allowed.
 * - cancelled is allowed from placed / confirmed only.
 * - All other transitions must move strictly forward.
 */
export const getAllowedNextStatuses = (currentStatus) => {
  if (currentStatus === 'delivered' || currentStatus === 'cancelled') return []
  const idx = STATUS_PIPELINE.indexOf(currentStatus)
  if (idx === -1) return []
  const forward = STATUS_PIPELINE.slice(idx + 1)
  // Cancellation is only allowed before processing
  if (['placed', 'confirmed'].includes(currentStatus)) {
    forward.push('cancelled')
  }
  return forward
}

// PATCH /api/orders/admin/:orderId/status  — admin: update order status (forward-only)
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { orderStatus, note } = req.body
    const validStatuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status.' })
    }

    const order = await Order.findById(req.params.orderId)
    if (!order) return res.status(404).json({ message: 'Order not found.' })

    // ── Terminal state lock ───────────────────────────────────────────────────
    if (order.orderStatus === 'delivered') {
      return res.status(400).json({
        message: 'This order has already been delivered and cannot be changed.',
      })
    }
    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({
        message: 'This order is cancelled and cannot be changed.',
      })
    }

    // ── Forward-only enforcement ──────────────────────────────────────────────
    const allowed = getAllowedNextStatuses(order.orderStatus)
    if (!allowed.includes(orderStatus)) {
      const pipeline = STATUS_PIPELINE.join(' → ')
      return res.status(400).json({
        message: `Cannot move status from "${order.orderStatus}" to "${orderStatus}". Status must move forward: ${pipeline}.`,
        allowedNextStatuses: allowed,
      })
    }

    order.orderStatus = orderStatus
    order.statusHistory.push({
      status: orderStatus,
      changedAt: new Date(),
      note: note || `Status updated to "${orderStatus}" by admin.`,
      changedBy: 'admin',
    })

    // If cancelled by admin — restore stock
    if (orderStatus === 'cancelled') {
      order.cancelReason = note || 'Cancelled by admin.'
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stockQty: item.quantity } })
      }
    }

    await order.save()
    res.json({
      orderStatus: order.orderStatus,
      statusHistory: order.statusHistory,
      allowedNextStatuses: getAllowedNextStatuses(order.orderStatus),
    })
  } catch (error) {
    console.error('updateOrderStatusAdmin error:', error)
    res.status(500).json({ message: 'Could not update order status.' })
  }
}

// PATCH /api/orders/:orderId/shipping-address — update shipping address for a specific order in Order collection
export const updateOrderShippingAddress = async (req, res) => {
  try {
    const { orderId } = req.params
    const { shippingAddress } = req.body

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required.' })
    }

    const requiredAddr = ['fullName', 'mobile', 'addressLine1', 'city', 'state', 'pincode']
    for (const field of requiredAddr) {
      if (!shippingAddress[field]?.trim()) {
        return res.status(400).json({ message: `Shipping address field "${field}" is required.` })
      }
    }

    const order = await Order.findOne({ _id: orderId, userId: req.user._id })
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }

    const nonModifiable = ['shipped', 'delivered', 'cancelled']
    if (nonModifiable.includes(order.orderStatus)) {
      return res.status(400).json({ message: `Cannot change shipping address once order is ${order.orderStatus}.` })
    }

    order.shippingAddress = {
      fullName: shippingAddress.fullName.trim(),
      mobile: shippingAddress.mobile.trim(),
      addressLine1: shippingAddress.addressLine1.trim(),
      addressLine2: shippingAddress.addressLine2?.trim() || '',
      city: shippingAddress.city.trim(),
      state: shippingAddress.state.trim(),
      pincode: shippingAddress.pincode.trim(),
      country: shippingAddress.country?.trim() || 'India',
    }

    order.statusHistory.push({
      status: order.orderStatus,
      note: 'Shipping address updated by customer.',
    })

    await order.save()

    res.status(200).json({ message: 'Shipping address updated successfully for this order.', order })
  } catch (error) {
    console.error('updateOrderShippingAddress error:', error)
    res.status(500).json({ message: 'Could not update order shipping address.' })
  }
}


