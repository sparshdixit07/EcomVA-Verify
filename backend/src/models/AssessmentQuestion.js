import mongoose from 'mongoose';

const { Schema } = mongoose;

const assessmentQuestionSchema = new Schema(
  {
    assessment: {
      type: Schema.Types.ObjectId,
      ref: 'SkillAssessment',
      required: true,
      index: true
    },
    question: { type: String, required: true, maxlength: 2000 },
    type: {
      type: String,
      enum: ['single', 'multiple', 'text'],
      default: 'single'
    },
    options: [{ type: String }],
    correctAnswer: { type: String, default: '' },
    explanation: { type: String, default: '', maxlength: 2000 },
    points: { type: Number, default: 1, min: 1, max: 100 },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

assessmentQuestionSchema.index({ assessment: 1, order: 1 });

export const AssessmentQuestion = mongoose.model(
  'AssessmentQuestion',
  assessmentQuestionSchema
);