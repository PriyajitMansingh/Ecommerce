import mongoose from 'mongoose'

const bulkOrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    businessName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    state: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    requirementType: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true },
    requiredDate: { type: String, required: true, trim: true },
    details: { type: String, trim: true, default: '' },
    contactMethod: {
      type: String,
      enum: ['whatsapp', 'email', 'call'],
      default: 'whatsapp',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
    responseNote: { type: String, trim: true, default: '' },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('BulkOrder', bulkOrderSchema)
