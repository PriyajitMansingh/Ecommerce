import User from '../models/User.js'

// GET /api/account/profile — Customer views their own full profile
export const getProfile = async (req, res) => {
  try {
    // req.user is already set by the `protect` middleware, with
    // passwordHash and securityQuestions excluded.
    res.status(200).json(req.user)
  } catch (error) {
    console.error('getProfile error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

// PUT /api/account/profile — Customer updates their own profile/address
// (FR-AUTH-005: changes persist and appear at checkout)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    // Only these fields are editable here — email is an identity field
    // and is intentionally NOT editable through this endpoint.
    const editableFields = [
      'name', 'countryCode', 'mobile',
      'addressLine1', 'addressLine2', 'city', 'state', 'pincode', 'country',
    ]

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field]
      }
    })

    const updated = await user.save()

    res.status(200).json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      countryCode: updated.countryCode,
      mobile: updated.mobile,
      role: updated.role,
      addressLine1: updated.addressLine1,
      addressLine2: updated.addressLine2,
      city: updated.city,
      state: updated.state,
      pincode: updated.pincode,
      country: updated.country,
    })
  } catch (error) {
    console.error('updateProfile error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}