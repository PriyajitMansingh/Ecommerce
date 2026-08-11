import express from 'express'
import {
  createPayment,
  verifyPayment,
  getPaymentStatus,
  getPaymentAttempts,
} from '../controllers/paymentController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.post('/create', createPayment)                 // POST /api/payments/create
router.post('/verify', verifyPayment)                 // POST /api/payments/verify
router.get('/:orderId/status', getPaymentStatus)      // GET  /api/payments/:orderId/status
router.get('/:orderId/attempts', getPaymentAttempts)  // GET  /api/payments/:orderId/attempts

export default router
