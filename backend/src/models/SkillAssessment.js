import mongoose from 'mongoose';

const { Schema } = mongoose;

const skillAssessmentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: '', maxlength: 2000 },
    skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true, index: true },
    platform: {
      type: String,
      enum: ['amazon', 'shopify', 'both', 'other'],
      default: 'both'
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    durationMinutes: { type: Number, default: 30, min: 5, max: 240 },
    passingScore: { type: Number, default: 70, min: 0, max: 100 },
    active: { type: Boolean, default: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

export const SkillAssessment = mongoose.model('SkillAssessment', skillAssessmentSchema);