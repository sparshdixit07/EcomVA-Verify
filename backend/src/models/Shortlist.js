import mongoose from 'mongoose';

const { Schema } = mongoose;

const shortlistSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'ClientProfile', required: true, index: true },
    clientUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    va: { type: Schema.Types.ObjectId, ref: 'VAProfile', required: true, index: true },
    requirement: {
      type: Schema.Types.ObjectId,
      ref: 'ClientRequirement',
      default: null
    },
    notes: { type: String, default: '', maxlength: 2000 }
  },
  { timestamps: true }
);

shortlistSchema.index({ client: 1, va: 1 }, { unique: true });
shortlistSchema.index({ client: 1, requirement: 1 });

export const Shortlist = mongoose.model('Shortlist', shortlistSchema);