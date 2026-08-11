import rateLimit from 'express-rate-limit'
import AuditLog from '../models/AuditLog.js'

// Shared handler — runs ONLY when a request actually gets blocked
// (i.e. the limit was exceeded). This logs the block itself to AuditLog,
// so repeated rate-limit hits are visible for attack-pattern detection —
// not just the requests that made it through to the real controller.
const makeBlockedHandler = (action) => async (req, res) => {
  const email = req.body?.email || req.params?.email || 'unknown'
  await AuditLog.create({
    action,
    email,
    status: 'FAILED',
    reason: 'Rate limit exceeded',
    ipAddress: req.ip,
  })
  res.status(429).json({ message: 'Too many attempts. Please try again after 15 minutes.' })
}

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: makeBlockedHandler('LOGIN'),
})

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: makeBlockedHandler('REGISTER'),
})

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: makeBlockedHandler('FORGOT_PASSWORD_VERIFY'),
})