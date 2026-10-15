import { Report } from '../models/Report.js';
import { ApiError } from '../utils/ApiError.js';
import { paginated, parsePagination } from '../utils/pagination.js';

export const reportService = {
  async create(user, payload) {
    const report = await Report.create({
      reporter: user?._id || null,
      reporterEmail: user?.email || '',
      type: payload.type || 'other',
      subject: payload.subject || '',
      description: payload.description,
      relatedType: payload.relatedType || null,
      relatedId: payload.relatedId || null,
      status: 'open'
    });
    return { report };
  },

  async listMine(user, query) {
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 20, maxLimit: 100 });
    const filter = { reporter: user._id };
    const [items, total] = await Promise.all([
      Report.find(filter).sort('-createdAt').skip(skip).limit(limit),
      Report.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  },

  async list(query) {
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 20, maxLimit: 100 });
    const filter = {};
    if (query.status) filter.status = query.status;
    const [items, total] = await Promise.all([
      Report.find(filter).sort('-createdAt').skip(skip).limit(limit),
      Report.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  },

  async resolve(admin, id, { status, resolution }) {
    const report = await Report.findById(id);
    if (!report) throw ApiError.notFound('Report not found');
    report.status = status;
    report.resolution = resolution || '';
    report.resolvedBy = admin._id;
    report.resolvedAt = new Date();
    await report.save();
    return { report };
  }
};