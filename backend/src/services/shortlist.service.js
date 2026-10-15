import { Shortlist } from '../models/Shortlist.js';
import { ClientProfile } from '../models/ClientProfile.js';
import { VAProfile } from '../models/VAProfile.js';
import { ApiError } from '../utils/ApiError.js';

async function ensureClient(user) {
  let p = await ClientProfile.findOne({ user: user._id });
  if (!p) p = await ClientProfile.create({ user: user._id });
  return p;
}

export const shortlistService = {
  async list(user) {
    const client = await ensureClient(user);
    const items = await Shortlist.find({ client: client._id })
      .populate({
        path: 'va',
        populate: [
          { path: 'user', select: 'firstName lastName avatarUrl' },
          { path: 'skills.skill', select: 'name' }
        ]
      })
      .sort('-createdAt');
    return { items };
  },

  async add(user, { vaId, requirementId }) {
    const client = await ensureClient(user);
    const va = await VAProfile.findById(vaId);
    if (!va) throw ApiError.notFound('VA not found');
    const existing = await Shortlist.findOne({ client: client._id, va: va._id });
    if (existing) return { item: existing };
    const item = await Shortlist.create({
      client: client._id,
      clientUser: user._id,
      va: va._id,
      requirement: requirementId || null
    });
    return { item };
  },

  async remove(user, id) {
    const client = await ensureClient(user);
    const item = await Shortlist.findOne({ _id: id, client: client._id });
    if (!item) throw ApiError.notFound('Shortlist entry not found');
    await item.deleteOne();
    return { ok: true };
  },

  async compare(user, { vaIds }) {
    if (!Array.isArray(vaIds) || vaIds.length < 2 || vaIds.length > 3) {
      throw ApiError.badRequest('Compare requires 2 to 3 VAs');
    }
    const items = await VAProfile.find({ _id: { $in: vaIds } })
      .populate('user', 'firstName lastName avatarUrl')
      .populate('skills.skill', 'name');
    return { items };
  }
};