import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  let token

  if (req.cookies?.token) {
    token = req.cookies.token
  } else if (req.cookies?.toshali_token) {
    token = req.cookies.toshali_token
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-passwordHash')

      if (!req.user) {
        return res.status(401).json({ message: 'User not found. Token invalid.' })
      }

      if (!req.user.isActive) {
        return res.status(403).json({ message: 'This account has been blocked.' })
      }

      next()
    } catch (error) {
      console.log('❌ JWT verify failed:', error.message)
      return res.status(401).json({ message: 'Not authorized, token failed.', debug: error.message })
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided.' })
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next()
  } else {
    return res.status(403).json({ message: 'Access denied. Admin only.' })
  }
}