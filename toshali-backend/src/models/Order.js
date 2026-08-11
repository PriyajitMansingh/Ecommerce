import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productType: { type: String, enum: ['product', 'gift'], default: 'product', required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
)

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true, default: '' },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, default: 'India', trim: true },
  },
  { _id: false }
)

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderNumber: { type: String, unique: true },
    items: [orderItemSchema],
    shippingAddress: { type: addressSchema, required: true },
    subtotal: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    couponCode: { type: String, default: '', trim: true },
    discountAmount: { type: Number, default: 0, min: 0 },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'cod', 'wallet'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    statusHistory: [statusHistorySchema],
    cancelReason: { type: String, default: '' },
    trackingNumber: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
)

// Auto-generate a readable order number before first save
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date = new Date()
    const yy = String(date.getFullYear()).slice(-2)
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const rand = Math.floor(1000 + Math.random() * 9000)
    this.orderNumber = `HOT-${yy}${mm}${dd}-${rand}`
  }
  next()
})

export default mongoose.model('Order', orderSchema)
