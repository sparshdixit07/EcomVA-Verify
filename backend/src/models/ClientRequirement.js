import mongoose from 'mongoose';

const { Schema } = mongoose;

const clientRequirementSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'ClientProfile', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, required: true, maxlength: 8000 },
    platform: {
      type: String,
      enum: ['amazon', 'shopify', 'both', 'other'],
      required: true,
      index: true
    },
    requiredSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
    englishLevel: {
      type: String,
      enum: ['basic', 'conversational', 'professional', 'fluent', 'native'],
      default: 'professional'
    },
    timezone: { type: String, default: '' },
    availability: {
      type: String,
      enum: ['full_time', 'part_time', 'project', 'hourly'],
      default: 'full_time'
    },
    budgetMin: { type: Number, default: 0, min: 0 },
    budgetMax: { type: Number, default: 0, min: 0 },
    budgetCurrency: { type: String, default: 'USD' },
    hoursPerWeek: { type: Number, default: 40, min: 1, max: 80 },
    status: {
      type: String,
      enum: ['draft', 'open', 'in_progress', 'closed', 'cancelled'],
      default: 'open',
      index: true
    }
  },
  { timestamps: true }
);

clientRequirementSchema.index({ client: 1, status: 1 });
clientRequirementSchema.index({ requiredSkills: 1 });

export const ClientRequirement = mongoose.model('ClientRequirement', clientRequirementSchema);