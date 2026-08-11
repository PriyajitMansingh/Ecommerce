import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        'REGISTER',
        'LOGIN',
        'FORGOT_PASSWORD_REQUEST',
        'FORGOT_PASSWORD_VERIFY',
        'PASSWORD_RESET',
      ],
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      required: true,
    },
    reason: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('AuditLog', auditLogSchema)