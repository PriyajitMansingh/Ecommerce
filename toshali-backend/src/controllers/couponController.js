import Coupon from '../models/Coupon.js'

// POST /api/admin/coupons
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue, expiryDate, usageLimit } = req.body

    if (!code || !discountType || discountValue == null || !expiryDate) {
      return res.status(400).json({ message: 'code, discountType, discountValue and expiryDate are required.' })
    }

    if (!['flat', 'percentage'].includes(discountType)) {
      return res.status(400).json({ message: 'discountType must be either "flat" or "percentage".' })
    }

    if (discountType === 'percentage' && discountValue > 100) {
      return res.status(400).json({ message: 'Percentage discount cannot exceed 100.' })
    }

    if (new Date(expiryDate) <= new Date()) {
      return res.status(400).json({ message: 'Expiry date must be in the future.' })
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      expiryDate,
      usageLimit: usageLimit || undefined,
      createdBy: req.user._id,
    })

    res.status(201).json({ message: 'Coupon created.', coupon })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A coupon with this code already exists.' })
    }
    console.error('createCoupon error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

// GET /api/coupon/get-coupons — list all coupons (admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    res.status(200).json(coupons)
  } catch (error) {
    console.error('getAllCoupons error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

// GET /api/coupon/get-active — list only active, non-expired coupons (for customers)
export const getActiveCoupons = async (req, res) => {
  try {
    const now = new Date()
    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gt: now },
      $or: [
        { usageLimit: { $exists: false } },
        { usageLimit: null },
        { $expr: { $lt: ['$usedCount', '$usageLimit'] } },
      ],
    })
      .select('code discountType discountValue minOrderValue expiryDate')
      .sort({ createdAt: -1 })
    res.status(200).json(coupons)
  } catch (error) {
    console.error('getActiveCoupons error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

// GET /api/coupon/:id — get a single coupon by its Mongo _id (admin)
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) return res.status(404).json({ message: 'Coupon not found.' })
    res.status(200).json(coupon)
  } catch (error) {
    console.error('getCouponById error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

// PATCH /api/coupon/update-coupon/:id — edit one or more fields of an existing coupon
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) return res.status(404).json({ message: 'Coupon not found.' })

    const { code, discountType, discountValue, minOrderValue, expiryDate, usageLimit, isActive } = req.body

    if (discountType !== undefined && !['flat', 'percentage'].includes(discountType)) {
      return res.status(400).json({ message: 'discountType must be either "flat" or "percentage".' })
    }

    const effectiveType = discountType !== undefined ? discountType : coupon.discountType
    const effectiveValue = discountValue !== undefined ? discountValue : coupon.discountValue
    if (effectiveType === 'percentage' && effectiveValue > 100) {
      return res.status(400).json({ message: 'Percentage discount cannot exceed 100.' })
    }

    if (expiryDate !== undefined && new Date(expiryDate) <= new Date()) {
      return res.status(400).json({ message: 'Expiry date must be in the future.' })
    }

    if (code !== undefined) coupon.code = code
    if (discountType !== undefined) coupon.discountType = discountType
    if (discountValue !== undefined) coupon.discountValue = discountValue
    if (minOrderValue !== undefined) coupon.minOrderValue = minOrderValue
    if (expiryDate !== undefined) coupon.expiryDate = expiryDate
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit
    if (isActive !== undefined) coupon.isActive = isActive

    await coupon.save()
    res.status(200).json({ message: 'Coupon updated.', coupon })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A coupon with this code already exists.' })
    }
    console.error('updateCoupon error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

// PATCH /api/coupon/toggle-active/:id — toggle isActive for a coupon (admin)
export const toggleCouponActive = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) return res.status(404).json({ message: 'Coupon not found.' })
    coupon.isActive = !coupon.isActive
    await coupon.save()
    res.status(200).json({ message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'}.`, coupon })
  } catch (error) {
    console.error('toggleCouponActive error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

// DELETE /api/coupon/delete-coupon/:id
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id)
    if (!coupon) return res.status(404).json({ message: 'Coupon not found.' })
    res.status(200).json({ message: 'Coupon deleted.' })
  } catch (error) {
    console.error('deleteCoupon error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

// POST /api/coupon/apply — validate coupon against DB and compute discount
export const applyCoupon = async (req, res) => {
  try {
    const { couponCode, subtotal } = req.body

    if (!couponCode || typeof subtotal !== 'number') {
      return res.status(400).json({ message: 'couponCode and subtotal (number) are required.' })
    }

    const code = couponCode.trim().toUpperCase()
    const coupon = await Coupon.findOne({ code })

    if (!coupon) {
      return res.status(400).json({ message: 'Invalid coupon code.' })
    }
    if (!coupon.isActive) {
      return res.status(400).json({ message: 'This coupon is currently inactive.' })
    }
    if (new Date(coupon.expiryDate) <= new Date()) {
      return res.status(400).json({ message: 'This coupon has expired.' })
    }
    if (coupon.minOrderValue > 0 && subtotal < coupon.minOrderValue) {
      return res.status(400).json({
        message: `This coupon requires a minimum order of ₹${coupon.minOrderValue}.`,
      })
    }
    if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'This coupon has reached its usage limit.' })
    }

    let discountAmount = 0
    if (coupon.discountType === 'flat') {
      discountAmount = Math.min(coupon.discountValue, subtotal)
    } else {
      discountAmount = Math.round(subtotal * (coupon.discountValue / 100))
    }

    const shippingCharge = subtotal >= 499 ? 0 : 49
    const grandTotal = Math.max(0, subtotal - discountAmount + shippingCharge)

    const message =
      coupon.discountType === 'flat'
        ? `₹${discountAmount} flat discount applied successfully!`
        : `${coupon.discountValue}% discount applied successfully!`

    res.json({
      valid: true,
      couponCode: coupon.code,
      discountAmount,
      subtotal,
      shippingCharge,
      grandTotal,
      message,
    })
  } catch (error) {
    console.error('applyCoupon error:', error)
    res.status(500).json({ message: 'Could not apply coupon.' })
  }
}