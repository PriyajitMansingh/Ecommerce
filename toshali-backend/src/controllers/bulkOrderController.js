import BulkOrder from '../models/BulkOrder.js'

export const createBulkOrder = async (req, res) => {
  try {
    const {
      businessName,
      contactPerson,
      mobile,
      email,
      state,
      city,
      requirementType,
      quantity,
      requiredDate,
      details,
      contactMethod,
    } = req.body

    if (!businessName || !contactPerson || !mobile || !email || !requirementType || !quantity || !requiredDate) {
      return res.status(400).json({ message: 'Please complete all required bulk order fields.' })
    }

    const bulkOrder = await BulkOrder.create({
      businessName,
      contactPerson,
      mobile,
      email,
      state: state || '',
      city: city || '',
      requirementType,
      quantity,
      requiredDate,
      details: details || '',
      contactMethod: contactMethod || 'whatsapp',
    })

    res.status(201).json({ message: 'Bulk order inquiry submitted successfully.', bulkOrder })
  } catch (error) {
    console.error('createBulkOrder error:', error)
    res.status(500).json({ message: 'Could not submit bulk order inquiry. Please try again.' })
  }
}

export const getAllBulkOrdersAdmin = async (req, res) => {
  try {
    const bulkOrders = await BulkOrder.find().sort({ createdAt: -1 })
    res.json(bulkOrders)
  } catch (error) {
    console.error('getAllBulkOrdersAdmin error:', error)
    res.status(500).json({ message: 'Could not load bulk order inquiries.' })
  }
}

export const updateBulkOrderAdmin = async (req, res) => {
  try {
    const { bulkOrderId } = req.params
    const { status, responseNote } = req.body

    const bulkOrder = await BulkOrder.findById(bulkOrderId)
    if (!bulkOrder) {
      return res.status(404).json({ message: 'Bulk order inquiry not found.' })
    }

    if (status) {
      bulkOrder.status = status
    }
    if (responseNote !== undefined) {
      bulkOrder.responseNote = responseNote
    }

    await bulkOrder.save()
    res.json(bulkOrder)
  } catch (error) {
    console.error('updateBulkOrderAdmin error:', error)
    res.status(500).json({ message: 'Could not update bulk order inquiry.' })
  }
}
