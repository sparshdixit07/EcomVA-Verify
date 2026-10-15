import mongoose from 'mongoose';

const { Schema } = mongoose;

const vaSkillSchema = new Schema(
  {
    skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    name: { type: String, trim: true, default: '' },
    platform: {
      type: String,
      enum: ['amazon', 'shopify', 'both', 'other'],
      default: 'amazon'
    },
    yearsExperience: { type: Number, default: 0, min: 0, max: 60 },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    score: { type: Number, default: null, min: 0, max: 100 }
  },
  { _id: true, timestamps: false }
);

const vaProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    headline: { type: String, trim: true, default: '', maxlength: 160 },
    bio: { type: String, default: '', maxlength: 6000 },
    country: { type: String, trim: true, default: '', index: true },
    timezone: { type: String, trim: true, default: '', index: true },
    languages: [{ type: String, trim: true }],
    hourlyRate: { type: Number, default: null, min: 0, index: true },
    yearsExperience: { type: Number, default: 0, min: 0, max: 60 },
    englishLevel: {
      type: String,
      enum: ['basic', 'conversational', 'professional', 'fluent', 'native'],
      default: 'professional'
    },
    availability: {
      type: String,
      enum: ['full_time', 'part_time', 'project', 'hourly'],
      default: 'full_time'
    },
    portfolioUrl: { type: String, trim: true, default: '' },
    skills: { type: [vaSkillSchema], default: [] },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified',
      index: true
    },
    verifiedAt: { type: Date, default: null },
    assessmentAverage: { type: Number, default: null, min: 0, max: 100 },
    practicalAverage: { type: Number, default: null, min: 0, max: 100 },
    performance: {
      overallScore: { type: Number, default: null, min: 0, max: 100 },
      tasksCompleted: { type: Number, default: 0 },
      taskCompletionRate: { type: Number, default: null },
      onTimeRate: { type: Number, default: null },
      accuracy: { type: Number, default: null },
      responsiveness: { type: Number, default: null },
      clientRating: { type: Number, default: null, min: 0, max: 5 }
    }
  },
  { timestamps: true }
);

vaProfileSchema.index({ 'skills.skill': 1 });
vaProfileSchema.index({ 'skills.platform': 1 });
vaProfileSchema.index({ 'performance.overallScore': -1 });

export const VAProfile = mongoose.model('VAProfile', vaProfileSchema);