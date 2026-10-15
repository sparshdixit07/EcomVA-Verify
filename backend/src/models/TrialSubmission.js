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

const trialSubmissionSchema = new Schema(
  {
    trialTask: { type: Schema.Types.ObjectId, ref: 'TrialTask', required: true, index: true },
    va: { type: Schema.Types.ObjectId, ref: 'VAProfile', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, default: '', maxlength: 20000 },
    attachments: { type: [attachmentSchema], default: [] },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

trialSubmissionSchema.index({ trialTask: 1, createdAt: -1 });

export const TrialSubmission = mongoose.model('TrialSubmission', trialSubmissionSchema);