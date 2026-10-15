import mongoose from 'mongoose';

const { Schema } = mongoose;

const trialTaskSchema = new Schema(
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
    title: { type: String, required: true, trim: true, maxlength: 200 },
    brief: { type: String, required: true, maxlength: 10000 },
    deadline: { type: Date, required: true },
    compensation: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: [
        'draft',
        'assigned',
        'accepted',
        'submitted',
        'reviewed',
        'passed',
        'rejected',
        'cancelled'
      ],
      default: 'assigned',
      index: true
    },
    review: {
      score: { type: Number, default: null, min: 0, max: 100 },
      feedback: { type: String, default: '' },
      passed: { type: Boolean, default: null },
      reviewedAt: { type: Date, default: null },
      reviewedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
    }
  },
  { timestamps: true }
);

trialTaskSchema.index({ va: 1, status: 1 });
trialTaskSchema.index({ client: 1, status: 1 });

export const TrialTask = mongoose.model('TrialTask', trialTaskSchema);