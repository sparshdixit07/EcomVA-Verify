import { SkillAssessment } from '../models/SkillAssessment.js';
import { AssessmentQuestion } from '../models/AssessmentQuestion.js';
import { AssessmentResult } from '../models/AssessmentResult.js';
import { VAProfile } from '../models/VAProfile.js';
import { ApiError } from '../utils/ApiError.js';
import { paginated, parsePagination } from '../utils/pagination.js';

function normalize(str) {
  return String(str || '').trim().toLowerCase();
}

async function recomputeAssessmentAverage(vaId) {
  const results = await AssessmentResult.find({ va: vaId });
  if (!results.length) {
    await VAProfile.findByIdAndUpdate(vaId, { assessmentAverage: null });
    return;
  }
  const avg = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
  await VAProfile.findByIdAndUpdate(vaId, { assessmentAverage: avg });
}

export const assessmentService = {
  async list(query) {
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 50, maxLimit: 200 });
    const filter = { active: true };
    if (query.skillId) filter.skill = query.skillId;
    const [items, total] = await Promise.all([
      SkillAssessment.find(filter).populate('skill', 'name category').sort('-createdAt').skip(skip).limit(limit),
      SkillAssessment.countDocuments(filter)
    ]);

    const enriched = await Promise.all(
      items.map(async (a) => {
        const qCount = await AssessmentQuestion.countDocuments({ assessment: a._id });
        return { ...a.toObject(), questionsCount: qCount };
      })
    );

    return paginated(enriched, total, page, limit);
  },

  async getById(id) {
    const assessment = await SkillAssessment.findById(id).populate('skill', 'name category');
    if (!assessment) throw ApiError.notFound('Assessment not found');
    const questions = await AssessmentQuestion.find({ assessment: id }).sort('order');
    const sanitized = questions.map((q) => ({
      _id: q._id,
      question: q.question,
      type: q.type,
      options: q.options,
      points: q.points,
      order: q.order
    }));
    return { assessment, questions: sanitized };
  },

  async create(user, payload) {
    const assessment = await SkillAssessment.create({
      ...payload,
      skill: payload.skillId,
      createdBy: user._id
    });
    return { assessment };
  },

  async update(id, payload) {
    const assessment = await SkillAssessment.findById(id);
    if (!assessment) throw ApiError.notFound('Assessment not found');
    const fields = ['title', 'description', 'platform', 'difficulty', 'durationMinutes', 'passingScore', 'active'];
    for (const f of fields) if (payload[f] !== undefined) assessment[f] = payload[f];
    if (payload.skillId) assessment.skill = payload.skillId;
    await assessment.save();
    return { assessment };
  },

  async remove(id) {
    const assessment = await SkillAssessment.findById(id);
    if (!assessment) throw ApiError.notFound('Assessment not found');
    await Promise.all([
      AssessmentQuestion.deleteMany({ assessment: id }),
      AssessmentResult.deleteMany({ assessment: id }),
      assessment.deleteOne()
    ]);
    return { ok: true };
  },

  async listQuestions(assessmentId) {
    const questions = await AssessmentQuestion.find({ assessment: assessmentId }).sort('order');
    return { items: questions };
  },

  async createQuestion(assessmentId, payload) {
    const assessment = await SkillAssessment.findById(assessmentId);
    if (!assessment) throw ApiError.notFound('Assessment not found');
    const question = await AssessmentQuestion.create({ ...payload, assessment: assessmentId });
    return { question };
  },

  async updateQuestion(assessmentId, qid, payload) {
    const question = await AssessmentQuestion.findOne({ _id: qid, assessment: assessmentId });
    if (!question) throw ApiError.notFound('Question not found');
    const fields = ['question', 'type', 'options', 'correctAnswer', 'explanation', 'points', 'order'];
    for (const f of fields) if (payload[f] !== undefined) question[f] = payload[f];
    await question.save();
    return { question };
  },

  async deleteQuestion(assessmentId, qid) {
    const question = await AssessmentQuestion.findOneAndDelete({ _id: qid, assessment: assessmentId });
    if (!question) throw ApiError.notFound('Question not found');
    return { ok: true };
  },

  async submit(user, assessmentId, { answers }) {
    const assessment = await SkillAssessment.findById(assessmentId);
    if (!assessment) throw ApiError.notFound('Assessment not found');

    const va = await VAProfile.findOne({ user: user._id });
    if (!va) throw ApiError.forbidden('Only VAs can take assessments');

    const questions = await AssessmentQuestion.find({ assessment: assessmentId });
    if (!questions.length) throw ApiError.badRequest('Assessment has no questions');

    const answerMap = new Map(answers.map((a) => [String(a.questionId), a.answer]));
    let earned = 0;
    let total = 0;
    const graded = questions.map((q) => {
      const points = q.points || 1;
      total += points;
      const given = answerMap.get(String(q._id)) || '';
      let isCorrect = false;
      if (q.type === 'text') {
        isCorrect =
          q.correctAnswer && normalize(q.correctAnswer) === normalize(given);
      } else if (q.type === 'multiple') {
        const expected = normalize(q.correctAnswer).split(',').map((s) => s.trim()).filter(Boolean).sort();
        const provided = normalize(given).split(',').map((s) => s.trim()).filter(Boolean).sort();
        isCorrect = expected.length > 0 && expected.join('|') === provided.join('|');
      } else {
        isCorrect = normalize(q.correctAnswer) === normalize(given);
      }
      const pointsEarned = isCorrect ? points : 0;
      earned += pointsEarned;
      return {
        question: q._id,
        answer: given,
        isCorrect,
        pointsEarned
      };
    });

    const score = total > 0 ? Math.round((earned / total) * 100) : 0;
    const passed = score >= (assessment.passingScore || 70);

    const result = await AssessmentResult.create({
      assessment: assessmentId,
      va: va._id,
      user: user._id,
      answers: graded,
      score,
      passed
    });

    // Update VA skill score if we can map to a skill
    if (assessment.skill) {
      const skillRow = va.skills.find((s) => String(s.skill) === String(assessment.skill));
      if (skillRow) {
        skillRow.score = score;
        await va.save();
      }
    }

    await recomputeAssessmentAverage(va._id);

    return { result };
  },

  async myResults(user) {
    const va = await VAProfile.findOne({ user: user._id });
    if (!va) return { items: [] };
    const items = await AssessmentResult.find({ va: va._id })
      .populate('assessment', 'title difficulty passingScore')
      .sort('-createdAt');
    return { items };
  }
};