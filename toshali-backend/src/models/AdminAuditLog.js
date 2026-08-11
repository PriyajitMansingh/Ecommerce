import mongoose from 'mongoose'

const adminAuditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'TOGGLE_ACTIVE', 'TOGGLE_SALE', 'TOGGLE_FEATURED'],
      required: true,
    },
    entityType: {
      type: String,
      required: true, // e.g. "Product"
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    before: {
      type: mongoose.Schema.Types.Mixed, 
      default: null,
    },
    after: {
      type: mongoose.Schema.Types.Mixed, 
      default: null,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('AdminAuditLog', adminAuditLogSchema)