import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'ClientProfile', required: true, index: true },
    clientUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    va: { type: Schema.Types.ObjectId, ref: 'VAProfile', required: true, index: true },
    engagement: {
      type: Schema.Types.ObjectId,
      ref: 'Engagement',
      required: true
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 4000 },
    status: {
      type: String,
      enum: ['published', 'pending', 'hidden', 'flagged'],
      default: 'published',
      index: true
    },
    flagReason: { type: String, default: '' },
    moderatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    moderatedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

reviewSchema.index({ engagement: 1 }, { unique: true });
reviewSchema.index({ va: 1, status: 1 });

export const Review = mongoose.model('Review', reviewSchema);