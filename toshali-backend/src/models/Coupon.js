import mongoose from 'mongoose'
 
const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['flat', 'percentage'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
 
    minOrderValue: { type: Number, default: 0, min: 0 },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, min: 1 }, // total uses allowed, across all users — omit for unlimited
    usedCount: { type: Number, default: 0 },
 
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)
 
export default mongoose.model('Coupon', couponSchema)