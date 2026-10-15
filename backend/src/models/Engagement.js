import mongoose from 'mongoose';

const { Schema } = mongoose;

const engagementSchema = new Schema(
  {
    hiringRequest: {
      type: Schema.Types.ObjectId,
      ref: 'HiringRequest',
      required: true,
      unique: true
    },
    client: { type: Schema.Types.ObjectId, ref: 'ClientProfile', required: true, index: true },
    clientUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    va: { type: Schema.Types.ObjectId, ref: 'VAProfile', required: true, index: true },
    vaUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: '', maxlength: 200 },
    rate: { type: Number, default: null, min: 0 },
    hoursPerWeek: { type: Number, default: null, min: 1, max: 80 },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ['active', 'paused', 'completed', 'cancelled'],
      default: 'active',
      index: true
    }
  },
  { timestamps: true }
);

engagementSchema.index({ client: 1, status: 1 });
engagementSchema.index({ va: 1, status: 1 });

export const Engagement = mongoose.model('Engagement', engagementSchema);