import mongoose from 'mongoose';

const { Schema } = mongoose;

const verificationSchema = new Schema(
  {
    va: { type: Schema.Types.ObjectId, ref: 'VAProfile', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
      index: true
    },
    reason: { type: String, default: '' },
    decidedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    decidedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

verificationSchema.index({ va: 1, createdAt: -1 });

export const Verification = mongoose.model('Verification', verificationSchema);