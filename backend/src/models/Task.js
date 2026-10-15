import mongoose from 'mongoose';

const { Schema } = mongoose;

const attachmentSchema = new Schema(
  {
    url: { type: String, required: true },
    filename: { type: String, default: '' },
    mime: { type: String, default: '' },
    size: { type: Number, default: 0 }
  },
  { _id: false }
);

const taskSchema = new Schema(
  {
    engagement: { type: Schema.Types.ObjectId, ref: 'Engagement', required: true, index: true },
    client: { type: Schema.Types.ObjectId, ref: 'ClientProfile', required: true, index: true },
    va: { type: Schema.Types.ObjectId, ref: 'VAProfile', required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 8000 },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    deadline: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'submitted', 'approved', 'revision', 'cancelled'],
      default: 'pending',
      index: true
    },
    submission: {
      content: { type: String, default: '' },
      attachments: { type: [attachmentSchema], default: [] },
      submittedAt: { type: Date, default: null }
    },
    revisionFeedback: { type: String, default: '' },
    completedAt: { type: Date, default: null },
    approvedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

taskSchema.index({ engagement: 1, status: 1 });
taskSchema.index({ va: 1, status: 1 });

export const Task = mongoose.model('Task', taskSchema);