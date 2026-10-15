import mongoose from 'mongoose';

const { Schema } = mongoose;

const reportSchema = new Schema(
  {
    reporter: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    reporterEmail: { type: String, default: '' },
    type: {
      type: String,
      enum: ['review', 'user', 'message', 'task', 'contact', 'other'],
      default: 'other'
    },
    subject: { type: String, default: '', maxlength: 200 },
    description: { type: String, required: true, maxlength: 8000 },
    relatedType: { type: String, default: null },
    relatedId: { type: String, default: null },
    status: {
      type: String,
      enum: ['open', 'reviewing', 'resolved', 'dismissed'],
      default: 'open',
      index: true
    },
    resolution: { type: String, default: '' },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    resolvedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

reportSchema.index({ status: 1, createdAt: -1 });

export const Report = mongoose.model('Report', reportSchema);