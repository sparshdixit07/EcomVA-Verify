import mongoose from 'mongoose';

const { Schema } = mongoose;

const adminActionSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    actorEmail: { type: String, default: '' },
    action: { type: String, required: true, index: true },
    targetType: { type: String, default: null },
    targetId: { type: String, default: null },
    description: { type: String, default: '' },
    severity: {
      type: String,
      enum: ['info', 'warning', 'error', 'critical'],
      default: 'info',
      index: true
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ip: { type: String, default: null }
  },
  { timestamps: true }
);

adminActionSchema.index({ createdAt: -1 });
adminActionSchema.index({ targetType: 1, targetId: 1 });

export const AdminAction = mongoose.model('AdminAction', adminActionSchema);