import express from 'express'
import {
  createCoupon,
  getAllCoupons,
  getActiveCoupons,
  getCouponById,
  deleteCoupon,
  updateCoupon,
  toggleCouponActive,
  applyCoupon,
} from '../controllers/couponController.js'
import { adminOnly, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

// ── Admin routes ───────────────────────────────────────────────────────────
router.post('/generation', protect, adminOnly, createCoupon)
router.get('/get-coupons', protect, adminOnly, getAllCoupons)
router.delete('/delete-coupon/:id', protect, adminOnly, deleteCoupon)
router.patch('/update-coupon/:id', protect, adminOnly, updateCoupon)
router.patch('/toggle-active/:id', protect, adminOnly, toggleCouponActive)

// ── Customer routes ────────────────────────────────────────────────────────
// Public: active, non-expired coupons (for displaying chips in checkout)
router.get('/get-active', getActiveCoupons)
// Protected: apply coupon and get discount amount
router.post('/apply', protect, applyCoupon)

export default router