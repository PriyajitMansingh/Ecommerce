import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    longDescription: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    mrpPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    stockQty: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    // Temporary — a plain image URL until proper upload (Cloudinary +
    // a dedicated ProductMedia model) is built. Admin pastes a URL for now.
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    weight: {
      type: String,
      trim: true,
      default: '',
    },
    headingDescription: {
      type: String,
      trim: true,
      default: '',
    },
    productDetails: {
      healthBenefits: { type: String, trim: true, default: '' },
      countryOfOrigin: { type: String, trim: true, default: '' },
      processingMethod: { type: String, trim: true, default: '' },
      shelfLife: { type: String, trim: true, default: '' },
      manufactured: { type: String, trim: true, default: '' },
      storageInstructions: { type: String, trim: true, default: '' },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
      isUpcoming: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Product', productSchema)