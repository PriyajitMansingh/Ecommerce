import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import AuditLog from '../models/AuditLog.js'
import generateToken from '../utils/generateToken.js'

const REQUIRED_QUESTIONS = ['Favorite Food', 'Favorite Color', 'Favorite Birth Place']

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const {
      name, email, countryCode, mobile, password,
      addressLine1, addressLine2, city, state, pincode, country,
      securityAnswers,
    } = req.body

    // ---- Core required fields ----
    if (!name || !email || !countryCode || !mobile || !password) {
      await AuditLog.create({ action: 'REGISTER', email: email || 'unknown', status: 'FAILED', reason: 'Missing fields', ipAddress: req.ip })
      return res.status(400).json({ message: 'All required fields must be filled.' })
    }

    // ---- Address is required at registration ----
    if (!addressLine1 || !city || !state || !pincode) {
      await AuditLog.create({ action: 'REGISTER', email, status: 'FAILED', reason: 'Missing address fields', ipAddress: req.ip })
      return res.status(400).json({ message: 'Address line 1, city, state and pincode are required.' })
    }

    // ---- Security questions ----
    if (!securityAnswers || REQUIRED_QUESTIONS.some((q) => !securityAnswers[q]?.trim())) {
      await AuditLog.create({ action: 'REGISTER', email, status: 'FAILED', reason: 'Missing security answers', ipAddress: req.ip })
      return res.status(400).json({ message: 'All 3 security questions must be answered.' })
    }

    // ---- Duplicate check ----
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] })
    if (existingUser) {
      await AuditLog.create({ action: 'REGISTER', email, status: 'FAILED', reason: 'Email or mobile already exists', ipAddress: req.ip })
      return res.status(409).json({ message: 'Email or mobile already registered.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const securityQuestions = await Promise.all(
      REQUIRED_QUESTIONS.map(async (question) => ({
        question,
        answerHash: await bcrypt.hash(securityAnswers[question].trim().toLowerCase(), 10),
      }))
    )

    // ---- First saved address, built into the SAME embedded `addresses`
    // array that future add/edit/delete address endpoints will manage ----
    const initialAddresses = [
      {
        label: 'Home',
        fullName: name,
        mobile: `${countryCode}${mobile}`,
        addressLine1,
        addressLine2: addressLine2 || '',
        city,
        state,
        pincode,
        country: country || 'India',
        isPrimary: true,
      },
    ]

    const user = await User.create({
      name,
      email,
      countryCode,
      mobile,
      passwordHash,
      addresses: initialAddresses,
      securityQuestions,
    })

    await AuditLog.create({ action: 'REGISTER', email, status: 'SUCCESS', ipAddress: req.ip })

    const token = generateToken(user._id, user.role)
    res.cookie('token', token, cookieOptions)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      addresses: user.addresses,
      token,
    })
  } catch (error) {
    console.error('registerUser error:', error) // full detail — server console ONLY
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}
// export const registerUser = async (req, res) => {
//   try {
//     const {
//       name, email, countryCode, mobile, password,
//       addressLine1, addressLine2, city, state, pincode, country,
//       securityAnswers,
//     } = req.body

//     if (!name || !email || !countryCode || !mobile || !password) {
//       await AuditLog.create({ action: 'REGISTER', email: email || 'unknown', status: 'FAILED', reason: 'Missing fields', ipAddress: req.ip })
//       return res.status(400).json({ message: 'All required fields must be filled.' })
//     }

//     if (!securityAnswers || REQUIRED_QUESTIONS.some((q) => !securityAnswers[q]?.trim())) {
//       return res.status(400).json({ message: 'All 3 security questions must be answered.' })
//     }

//     const existingUser = await User.findOne({ $or: [{ email }, { mobile }] })
//     if (existingUser) {
//       await AuditLog.create({ action: 'REGISTER', email, status: 'FAILED', reason: 'Email or mobile already exists', ipAddress: req.ip })
//       return res.status(409).json({ message: 'Email or mobile already registered.' })
//     }

//     const salt = await bcrypt.genSalt(10)
//     const passwordHash = await bcrypt.hash(password, salt)

//     const securityQuestions = await Promise.all(
//       REQUIRED_QUESTIONS.map(async (question) => ({
//         question,
//         answerHash: await bcrypt.hash(securityAnswers[question].trim().toLowerCase(), salt),
//       }))
//     )

//     const user = await User.create({
//       name, email, countryCode, mobile, passwordHash,
//       addressLine1, addressLine2, city, state, pincode, country,
//       securityQuestions,
//     })

//     await AuditLog.create({ action: 'REGISTER', email, status: 'SUCCESS', ipAddress: req.ip })

//     const token = generateToken(user._id, user.role)

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       mobile: user.mobile,
//       role: user.role,
//       token,
//     })
//   } catch (error) {
//     console.error('registerUser error:', error) // full detail — server console ONLY
//     res.status(500).json({ message: 'Something went wrong. Please try again later.' })
//   }
// }

// POST /api/auth/admin-login

export const adminLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      await AuditLog.create({ action: 'LOGIN', email, status: 'FAILED', reason: 'Admin login: user not found', ipAddress: req.ip })
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      await AuditLog.create({ action: 'LOGIN', email, status: 'FAILED', reason: 'Admin login: wrong password', ipAddress: req.ip })
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    if (!user.isActive) {
      await AuditLog.create({ action: 'LOGIN', email, status: 'FAILED', reason: 'Admin login: account blocked', ipAddress: req.ip })
      return res.status(403).json({ message: 'This account has been blocked.' })
    }

    // Credentials are valid, but this account is NOT an Admin —
    // per FR-ADM-001, customer/public access to admin must be denied,
    // and that denial should be auditable (not just a frontend check).
    if (user.role !== 'Admin') {
      await AuditLog.create({ action: 'LOGIN', email, status: 'FAILED', reason: 'Admin login: valid credentials but non-Admin role', ipAddress: req.ip })
      return res.status(403).json({ message: 'This account does not have admin access.' })
    }

    await AuditLog.create({ action: 'LOGIN', email, status: 'SUCCESS', reason: 'Admin login', ipAddress: req.ip })

    const token = generateToken(user._id, user.role)
    res.cookie('token', token, cookieOptions)
    res.status(200).json({
      _id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role, token,
    })
  } catch (error) {
    console.error('adminLoginUser error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      await AuditLog.create({ action: 'LOGIN', email, status: 'FAILED', reason: 'User not found', ipAddress: req.ip })
      return res.status(401).json({ message: 'Invalid email or password.' })
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      await AuditLog.create({ action: 'LOGIN', email, status: 'FAILED', reason: 'Wrong password', ipAddress: req.ip })
      return res.status(401).json({ message: 'Invalid email or password.' })
    }
    if (!user.isActive) {
      await AuditLog.create({ action: 'LOGIN', email, status: 'FAILED', reason: 'Account blocked', ipAddress: req.ip })
      return res.status(403).json({ message: 'This account has been blocked.' })
    }
    await AuditLog.create({ action: 'LOGIN', email, status: 'SUCCESS', ipAddress: req.ip })
    const token = generateToken(user._id, user.role)
    res.cookie('token', token, cookieOptions)
    res.status(200).json({
      _id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role, addresses: user.addresses || [], token,
    })
  } catch (error) {
    console.error('loginUser error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

// POST /api/auth/logout
export const logoutUser = async (req, res) => {
  res.clearCookie('token', cookieOptions)
  res.clearCookie('toshali_token', cookieOptions)
  res.status(200).json({ message: 'Logged out successfully' })
}

// GET /api/auth/audit-summary/:email
export const getAuditSummary = async (req, res) => {
  try {
    const { email } = req.params

    const summary = await AuditLog.aggregate([
      { $match: { email } },
      { $group: { _id: { action: '$action', status: '$status' }, count: { $sum: 1 } } },
    ])

    const result = {
      email,
      register: { success: 0, failed: 0 },
      login: { success: 0, failed: 0 },
      forgotPasswordRequest: { success: 0, failed: 0 },
      forgotPasswordVerify: { success: 0, failed: 0 },
      passwordReset: { success: 0, failed: 0 },
    }

    const actionKeyMap = {
      REGISTER: 'register',
      LOGIN: 'login',
      FORGOT_PASSWORD_REQUEST: 'forgotPasswordRequest',
      FORGOT_PASSWORD_VERIFY: 'forgotPasswordVerify',
      PASSWORD_RESET: 'passwordReset',
    }

    summary.forEach((item) => {
      const groupKey = actionKeyMap[item._id.action]
      if (!groupKey) return
      const statusKey = item._id.status === 'SUCCESS' ? 'success' : 'failed'
      result[groupKey][statusKey] = item.count
    })

    res.status(200).json(result)
  } catch (error) {
    console.error('getAuditSummary error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

// ===== FORGOT PASSWORD FLOW =====

export const getSecurityQuestions = async (req, res) => {
  try {
    const { email } = req.params
    const user = await User.findOne({ email })

    if (!user || !user.securityQuestions?.length) {
      await AuditLog.create({
        action: 'FORGOT_PASSWORD_REQUEST', email, status: 'FAILED',
        reason: 'User not found or no security questions set', ipAddress: req.ip,
      })
      return res.status(404).json({ message: 'Unable to start password recovery for this email.' })
    }

    await AuditLog.create({ action: 'FORGOT_PASSWORD_REQUEST', email, status: 'SUCCESS', ipAddress: req.ip })

    const shuffled = [...user.securityQuestions].map((q) => q.question).sort(() => Math.random() - 0.5)

    res.status(200).json({ questions: shuffled })
  } catch (error) {
    console.error('getSecurityQuestions error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

export const verifySecurityAnswers = async (req, res) => {
  try {
    const { email, answers } = req.body
    const user = await User.findOne({ email })

    if (!user || !answers) {
      return res.status(400).json({ message: 'Unable to verify. Please try again.' })
    }

    for (const sq of user.securityQuestions) {
      const providedAnswer = answers[sq.question]?.trim().toLowerCase()
      if (!providedAnswer) {
        return res.status(400).json({ message: 'All security answers are required.' })
      }
      const isMatch = await bcrypt.compare(providedAnswer, sq.answerHash)
      if (!isMatch) {
        await AuditLog.create({
          action: 'FORGOT_PASSWORD_VERIFY', email, status: 'FAILED',
          reason: 'Security answer mismatch', ipAddress: req.ip,
        })
        return res.status(401).json({ message: 'One or more answers are incorrect.' })
      }
    }

    await AuditLog.create({ action: 'FORGOT_PASSWORD_VERIFY', email, status: 'SUCCESS', ipAddress: req.ip })

    const resetToken = jwt.sign({ id: user._id, purpose: 'password-reset' }, process.env.JWT_SECRET, { expiresIn: '15m' })

    res.status(200).json({ resetToken })
  } catch (error) {
    console.error('verifySecurityAnswers error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: 'Reset token and new password are required.' })
    }

    let decoded
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET)
    } catch {
      return res.status(401).json({ message: 'Reset link/token is invalid or expired.' })
    }

    if (decoded.purpose !== 'password-reset') {
      return res.status(401).json({ message: 'Invalid reset token.' })
    }

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const salt = await bcrypt.genSalt(10)
    user.passwordHash = await bcrypt.hash(newPassword, salt)
    await user.save()

    await AuditLog.create({
      action: 'PASSWORD_RESET', email: user.email, status: 'SUCCESS', ipAddress: req.ip,
    })

    res.status(200).json({ message: 'Password reset successful. You can now log in.' })
  } catch (error) {
    console.error('resetPassword error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}