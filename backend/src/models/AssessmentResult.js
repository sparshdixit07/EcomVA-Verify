import mongoose from 'mongoose';

const { Schema } = mongoose;

const assessmentResultSchema = new Schema(
  {
    assessment: {
      type: Schema.Types.ObjectId,
      ref: 'SkillAssessment',
      required: true,
      index: true
    },
    va: { type: Schema.Types.ObjectId, ref: 'VAProfile', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    answers: [
      {
        question: { type: Schema.Types.ObjectId, ref: 'AssessmentQuestion' },
        answer: { type: String, default: '' },
        isCorrect: { type: Boolean, default: false },
        pointsEarned: { type: Number, default: 0 }
      }
    ],
    score: { type: Number, required: true, min: 0, max: 100 },
    passed: { type: Boolean, default: false },
    durationSeconds: { type: Number, default: 0 }
  },
  { timestamps: true }
);

assessmentResultSchema.index({ va: 1, assessment: 1 });
assessmentResultSchema.index({ assessment: 1, score: -1 });

export const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);