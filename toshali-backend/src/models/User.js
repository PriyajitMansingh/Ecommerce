import mongoose from 'mongoose'

const securityQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answerHash: {
    type: String,
    required: true,   // hashed, jaise password — kabhi plain text nahi
  },
})

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    countryCode: {
      type: String,
      required: true,   // e.g. "+91"
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Customer', 'Admin'],
      default: 'Customer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Saved Addresses array (max 7 addresses per user)
    addresses: [
      new mongoose.Schema(
        {
          label: { type: String, default: 'Home', trim: true },
          fullName: { type: String, required: true, trim: true },
          mobile: { type: String, required: true, trim: true },
          addressLine1: { type: String, required: true, trim: true },
          addressLine2: { type: String, trim: true, default: '' },
          city: { type: String, required: true, trim: true },
          state: { type: String, required: true, trim: true },
          pincode: { type: String, required: true, trim: true },
          country: { type: String, default: 'India', trim: true },
          isPrimary: { type: Boolean, default: false },
        },
        { timestamps: true }
      ),
    ],

    // Legacy address fields
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' },

    // Security questions — CLIENT REQUIREMENT, deviates from SRS FR-AUTH-004
    // (which specifies email link/OTP). Approved by Sir on [date] — see
    // project notes. Answers are hashed, never stored in plain text.
    securityQuestions: {
      type: [securityQuestionSchema],
      validate: {
        validator: (arr) => arr.length === 3,
        message: 'Exactly 3 security questions are required.',
      },
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('User', userSchema)