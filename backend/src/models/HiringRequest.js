import mongoose from 'mongoose';

const { Schema } = mongoose;

const hiringRequestSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'ClientProfile', required: true, index: true },
    clientUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    va: { type: Schema.Types.ObjectId, ref: 'VAProfile', required: true, index: true },
    vaUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    requirement: {
      type: Schema.Types.ObjectId,
      ref: 'ClientRequirement',
      default: null
    },
    trialTask: { type: Schema.Types.ObjectId, ref: 'TrialTask', default: null },
    message: { type: String, default: '', maxlength: 4000 },
    proposedRate: { type: Number, default: null, min: 0 },
    hoursPerWeek: { type: Number, default: null, min: 1, max: 80 },
    startDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'active', 'completed', 'cancelled'],
      default: 'pending',
      index: true
    },
    rejectionReason: { type: String, default: '' },
    respondedAt: { type: Date, default: null },
    engagement: { type: Schema.Types.ObjectId, ref: 'Engagement', default: null }
  },
  { timestamps: true }
);

hiringRequestSchema.index({ va: 1, status: 1 });
hiringRequestSchema.index({ client: 1, status: 1 });

export const HiringRequest = mongoose.model('HiringRequest', hiringRequestSchema);