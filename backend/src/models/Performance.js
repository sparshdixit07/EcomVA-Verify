import mongoose from 'mongoose';

const { Schema } = mongoose;

const performanceSchema = new Schema(
  {
    va: { type: Schema.Types.ObjectId, ref: 'VAProfile', required: true, index: true },
    engagement: {
      type: Schema.Types.ObjectId,
      ref: 'Engagement',
      default: null,
      index: true
    },
    tasksCompleted: { type: Number, default: 0, min: 0 },
    taskCompletionRate: { type: Number, default: null, min: 0, max: 100 },
    onTimeRate: { type: Number, default: null, min: 0, max: 100 },
    accuracy: { type: Number, default: null, min: 0, max: 100 },
    responsiveness: { type: Number, default: null, min: 0, max: 100 },
    clientRating: { type: Number, default: null, min: 0, max: 5 },
    overallScore: { type: Number, default: null, min: 0, max: 100 },
    lastCalculatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

performanceSchema.index({ va: 1, engagement: 1 }, { unique: true });

export const Performance = mongoose.model('Performance', performanceSchema);