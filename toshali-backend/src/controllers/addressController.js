import User from '../models/User.js'

// GET /api/address — list all saved addresses for the logged-in user
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.status(200).json(user.addresses)
  } catch (error) {
    console.error('getAddresses error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

// POST /api/address — add a new address to the array
export const addAddress = async (req, res) => {
  try {
    const { label, fullName, mobile, addressLine1, addressLine2, city, state, pincode, country, isPrimary } = req.body

    if (!addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({ message: 'addressLine1, city, state and pincode are required.' })
    }

    const user = await User.findById(req.user._id)

    if (user.addresses.length >= 7) {
      return res.status(400).json({ message: 'You can save a maximum of 7 addresses.' })
    }

    // If this new address is meant to be primary, unset any existing
    // primary FIRST — the schema's "at most one primary" validator will
    // reject the save outright if two end up true at the same time.
    const shouldBePrimary = user.addresses.length === 0 ? true : !!isPrimary

    if (shouldBePrimary) {
      user.addresses.forEach((addr) => { addr.isPrimary = false })
    }

    user.addresses.push({
      label: label || 'Home',
      fullName: fullName || user.name,
      mobile: mobile || `${user.countryCode || ''}${user.mobile || ''}`,
      addressLine1,
      addressLine2: addressLine2 || '',
      city,
      state,
      pincode,
      country: country || 'India',
      isPrimary: shouldBePrimary,
    })

    await user.save()

    res.status(201).json({ message: 'Address added.', addresses: user.addresses })
  } catch (error) {
    console.error('addAddress error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

// PUT /api/address/:addressId — edit one specific address
const ADDRESS_UPDATABLE_FIELDS = ['label', 'fullName', 'mobile', 'addressLine1', 'addressLine2', 'city', 'state', 'pincode', 'country']

export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const address = user.addresses.id(req.params.addressId)

    if (!address) {
      return res.status(404).json({ message: 'Address not found.' })
    }

    // Explicitly reject any attempt to change immutable/identity fields —
    // rather than silently ignoring them, tell the client clearly.
    if (req.body._id !== undefined || req.body.id !== undefined) {
      return res.status(400).json({ message: 'The address ID cannot be changed.' })
    }

    ADDRESS_UPDATABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) address[field] = req.body[field]
    })

    const { isPrimary } = req.body
    if (isPrimary === true) {
      user.addresses.forEach((a) => { a.isPrimary = false })
      address.isPrimary = true
    } else if (isPrimary === false) {
      address.isPrimary = false
    }

    await user.save()

    res.status(200).json({ message: 'Address updated.', addresses: user.addresses })
  } catch (error) {
    console.error('updateAddress error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}
// DELETE /api/address/:addressId — remove one specific address
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const address = user.addresses.id(req.params.addressId)

    if (!address) {
      return res.status(404).json({ message: 'Address not found.' })
    }

    // Block deleting the only remaining address — a customer must always
    // have at least one saved address to check out against.
    if (user.addresses.length === 1) {
      return res.status(400).json({ message: 'You must have at least one saved address. Add a new one before deleting this.' })
    }

    const wasPrimary = address.isPrimary
    address.deleteOne()

    if (wasPrimary && user.addresses.length > 0) {
      user.addresses[0].isPrimary = true
    }

    await user.save()

    res.status(200).json({ message: 'Address deleted.', addresses: user.addresses })
  } catch (error) {
    console.error('deleteAddress error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}



export const setPrimaryAddress = async (req, res) => {
  try {
    const { addressId } = req.params
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const targetAddress = user.addresses.id(addressId)
    if (!targetAddress) {
      return res.status(404).json({ message: 'Address not found.' })
    }

    user.addresses.forEach((addr) => {
      addr.isPrimary = addr._id.toString() === addressId
    })

    await user.save()
    res.status(200).json({ message: 'Primary address updated successfully.', addresses: user.addresses })
  } catch (error) {
    console.error('setPrimaryAddress error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}