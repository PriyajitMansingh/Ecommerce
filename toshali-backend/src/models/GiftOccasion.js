import mongoose from 'mongoose'

const giftOccasionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    image: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Virtual count of products — populated in controller when needed
giftOccasionSchema.virtual('productCount')

export default mongoose.model('GiftOccasion', giftOccasionSchema)
