import mongoose from 'mongoose'

const paymentAttemptSchema = new mongoose.Schema(
  {
    method: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['initiated', 'pending', 'success', 'failed'],
      default: 'initiated',
    },
    gatewayRef: { type: String, default: '' }, // gateway transaction id / UTR
    failureReason: { type: String, default: '' },
    attemptedAt: { type: Date, default: Date.now },
  },
  { _id: true }
)

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    method: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'cod', 'wallet'],
      required: true,
    },
    status: {
      type: String,
      enum: ['initiated', 'pending', 'success', 'failed', 'refunded'],
      default: 'initiated',
    },
    gatewayOrderId: { type: String, default: '' },
    gatewayPaymentId: { type: String, default: '' },
    gatewaySignature: { type: String, default: '' },
    upiId: { type: String, default: '' }, // for UPI method
    attempts: [paymentAttemptSchema],
  },
  { timestamps: true }
)

export default mongoose.model('Payment', paymentSchema)
