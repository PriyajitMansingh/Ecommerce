import mongoose from 'mongoose'

const giftProductSchema = new mongoose.Schema(
  {
    occasionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GiftOccasion',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0, default: null },
    weight: { type: String, trim: true, default: '' },
    image: { type: String, trim: true, default: '' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('GiftProduct', giftProductSchema)
