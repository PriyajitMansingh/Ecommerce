import express from 'express'
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getStatusHistory,
  getInvoice,
  getTracking,
  validateCheckout,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  getAllowedNextStatuses,
  updateOrderShippingAddress,
} from '../controllers/orderController.js'
import { protect, adminOnly } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(protect)

// ── Admin routes (before generic /:orderId to avoid slug collision) ──
router.get('/admin/all', adminOnly, getAllOrdersAdmin)
router.patch('/admin/:orderId/status', adminOnly, updateOrderStatusAdmin)
// Admin: get allowed next statuses for a specific order (used by admin UI)
router.get('/admin/:orderId/allowed-statuses', adminOnly, async (req, res) => {
  try {
    const Order = (await import('../models/Order.js')).default
    const order = await Order.findById(req.params.orderId).select('orderStatus orderNumber')
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    res.json({
      orderNumber: order.orderNumber,
      currentStatus: order.orderStatus,
      allowedNextStatuses: getAllowedNextStatuses(order.orderStatus),
    })
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch allowed statuses.' })
  }
})
// Admin: view status history for any order
router.get('/admin/:orderId/status-history', adminOnly, getStatusHistory)

// ── Customer routes ──
router.post('/validate', validateCheckout)
router.post('/', createOrder)
router.get('/', getMyOrders)
router.get('/:orderId', getOrderById)
router.patch('/:orderId/shipping-address', updateOrderShippingAddress)
router.post('/:orderId/cancel', cancelOrder)
router.get('/:orderId/status-history', getStatusHistory)
router.get('/:orderId/invoice', getInvoice)
router.get('/:orderId/tracking', getTracking)
export default router
