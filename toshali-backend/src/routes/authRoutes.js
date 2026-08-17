import express from 'express'
import {
  registerUser,
  loginUser,
  adminLoginUser,
  logoutUser,
  getAuditSummary,
  getSecurityQuestions,
  verifySecurityAnswers,
  resetPassword,
} from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { loginLimiter, registerLimiter, forgotPasswordLimiter } from '../middlewares/rateLimiter.js'

const router = express.Router()

router.post('/register', registerLimiter, registerUser)
router.post('/login', loginUser)
router.post('/admin-login', adminLoginUser)
router.post('/logout', logoutUser)
router.get('/me', protect, (req, res) => res.status(200).json({ user: req.user }))
router.get('/audit-summary/:email', getAuditSummary)

// Forgot password (security-question based) — all 3 steps rate-limited
router.get('/forgot-password/questions/:email', forgotPasswordLimiter, getSecurityQuestions)
router.post('/forgot-password/verify', forgotPasswordLimiter, verifySecurityAnswers)
router.post('/reset-password', forgotPasswordLimiter, resetPassword)

export default router