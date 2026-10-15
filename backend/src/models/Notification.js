import mongoose from 'mongoose';

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: [
        'hiring_request',
        'hiring_status',
        'trial_task',
        'trial_submission',
        'task_assigned',
        'task_submitted',
        'task_approved',
        'task_revision',
        'review',
        'verification',
        'message',
        'system'
      ],
      required: true
    },
    title: { type: String, required: true, maxlength: 200 },
    message: { type: String, default: '', maxlength: 1000 },
    link: { type: String, default: null },
    relatedType: { type: String, default: null },
    relatedId: { type: String, default: null },
    read: { type: Boolean, default: false, index: true },
    readAt: { type: Date, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);