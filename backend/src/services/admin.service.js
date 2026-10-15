import { User } from '../models/User.js';
import { ClientProfile } from '../models/ClientProfile.js';
import { VAProfile } from '../models/VAProfile.js';
import { Report } from '../models/Report.js';
import { Verification } from '../models/Verification.js';
import { Engagement } from '../models/Engagement.js';
import { TrialTask } from '../models/TrialTask.js';
import { AdminAction } from '../models/AdminAction.js';
import { notify } from '../utils/notify.js';
import { audit } from '../utils/audit.js';
import { ApiError } from '../utils/ApiError.js';
import { paginated, parsePagination } from '../utils/pagination.js';

export const adminService = {
  async dashboard() {
    const [
      totalUsers,
      totalClients,
      totalVAs,
      pendingVerifications,
      activeEngagements,
      openReports,
      suspendedUsers,
      totalTrialTasks
    ] = await Promise.all([
      User.countDocuments({}),
      ClientProfile.countDocuments({}),
      VAProfile.countDocuments({}),
      Verification.countDocuments({ status: 'pending' }),
      Engagement.countDocuments({ status: 'active' }),
      Report.countDocuments({ status: 'open' }),
      User.countDocuments({ status: 'suspended' }),
      TrialTask.countDocuments({})
    ]);
    return {
      stats: {
        totalUsers,
        totalClients,
        totalVAs,
        pendingVerifications,
        activeEngagements,
        openReports,
        suspendedUsers,
        totalTrialTasks
      }
    };
  },

  async stats() {
    const verifiedVAs = await VAProfile.countDocuments({ verificationStatus: 'verified' });
    const totalEngagements = await Engagement.countDocuments({});
    const base = await this.dashboard();
    return { ...base.stats, verifiedVAs, totalEngagements };
  },

  async listUsers(query) {
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 20, maxLimit: 100 });
    const filter = {};
    if (query.role) filter.role = query.role;
    if (query.status) filter.status = query.status;
    if (query.q) {
      const re = new RegExp(query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ firstName: re }, { lastName: re }, { email: re }];
    }
    const [items, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip(skip).limit(limit),
      User.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  },

  async getUser(id) {
    const user = await User.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    return { user };
  },

  async suspend(admin, id, reason) {
    const user = await User.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    if (user.role === 'admin') throw ApiError.forbidden('Cannot suspend an admin');
    user.status = 'suspended';
    user.suspensionReason = reason || '';
    user.suspendedAt = new Date();
    await user.save();
    await audit({
      actor: admin,
      action: 'user.suspend',
      targetType: 'User',
      targetId: user._id,
      description: `Suspended user ${user.email}: ${reason || ''}`,
      severity: 'warning'
    });
    await notify({
      user: user._id,
      type: 'system',
      title: 'Account suspended',
      message: reason || 'Your account has been suspended.',
      link: '/login'
    });
    return { user };
  },

  async activate(admin, id) {
    const user = await User.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    user.status = 'active';
    user.suspensionReason = '';
    user.suspendedAt = null;
    await user.save();
    await audit({
      actor: admin,
      action: 'user.activate',
      targetType: 'User',
      targetId: user._id,
      description: `Activated user ${user.email}`,
      severity: 'info'
    });
    return { user };
  },

  async listAuditLogs(query) {
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 20, maxLimit: 200 });
    const filter = {};
    if (query.severity) filter.severity = query.severity;
    if (query.action) filter.action = new RegExp(`^${query.action}`);
    const [items, total] = await Promise.all([
      AdminAction.find(filter).sort('-createdAt').skip(skip).limit(limit),
      AdminAction.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  }
};