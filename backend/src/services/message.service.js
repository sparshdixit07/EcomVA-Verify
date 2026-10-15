import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { ClientProfile } from '../models/ClientProfile.js';
import { VAProfile } from '../models/VAProfile.js';
import { ApiError } from '../utils/ApiError.js';
import { paginated, parsePagination } from '../utils/pagination.js';

async function loadConversationForUser(user, id) {
  const conv = await Conversation.findById(id)
    .populate('clientUser', 'firstName lastName avatarUrl role')
    .populate('vaUser', 'firstName lastName avatarUrl role');
  if (!conv) throw ApiError.notFound('Conversation not found');
  const isParticipant =
    String(conv.clientUser._id) === String(user._id) ||
    String(conv.vaUser._id) === String(user._id) ||
    user.role === 'admin';
  if (!isParticipant) throw ApiError.forbidden();
  return conv;
}

export const messageService = {
  async listConversations(user) {
    const filter =
      user.role === 'client'
        ? { clientUser: user._id }
        : user.role === 'va'
        ? { vaUser: user._id }
        : {};

    const items = await Conversation.find(filter)
      .populate('clientUser', 'firstName lastName avatarUrl role')
      .populate('vaUser', 'firstName lastName avatarUrl role')
      .sort('-updatedAt');

    const decorated = items.map((c) => {
      const unread = (c.unreadByUser || []).find((u) => String(u.user) === String(user._id));
      return { ...c.toObject(), unreadCount: unread?.count || 0 };
    });

    return { items: decorated };
  },

  async startConversation(user, { vaId, clientId }) {
    let clientUser;
    let vaUser;

    if (user.role === 'client') {
      const va = await VAProfile.findById(vaId);
      if (!va) throw ApiError.notFound('VA not found');
      clientUser = user._id;
      vaUser = va.user;
    } else if (user.role === 'va') {
      const client = await ClientProfile.findById(clientId);
      if (!client) throw ApiError.notFound('Client not found');
      clientUser = client.user;
      vaUser = user._id;
    } else {
      throw ApiError.forbidden();
    }

    let conv = await Conversation.findOne({ clientUser, vaUser });
    if (!conv) {
      conv = await Conversation.create({
        participants: [clientUser, vaUser],
        participantRoles: ['client', 'va'],
        clientUser,
        vaUser
      });
    }
    await conv.populate('clientUser', 'firstName lastName avatarUrl role');
    await conv.populate('vaUser', 'firstName lastName avatarUrl role');
    return { conversation: conv };
  },

  async getConversation(user, id) {
    const conv = await loadConversationForUser(user, id);
    return { conversation: conv };
  },

  async listMessages(user, conversationId, query) {
    await loadConversationForUser(user, conversationId);
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 50, maxLimit: 200 });
    const filter = { conversation: conversationId };
    const [items, total] = await Promise.all([
      Message.find(filter)
        .populate('sender', 'firstName lastName avatarUrl role')
        .sort('createdAt')
        .skip(skip)
        .limit(limit),
      Message.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  },

  async send(user, conversationId, { content }) {
    const conv = await loadConversationForUser(user, conversationId);
    const message = await Message.create({
      conversation: conv._id,
      sender: user._id,
      senderRole: user.role,
      content
    });

    conv.lastMessage = {
      content: content.slice(0, 200),
      sender: user._id,
      createdAt: new Date()
    };

    const otherUserId =
      String(conv.clientUser._id) === String(user._id) ? conv.vaUser._id : conv.clientUser._id;

    const unreadArr = conv.unreadByUser || [];
    const existing = unreadArr.find((u) => String(u.user) === String(otherUserId));
    if (existing) existing.count = (existing.count || 0) + 1;
    else unreadArr.push({ user: otherUserId, count: 1 });

    const selfEntry = unreadArr.find((u) => String(u.user) === String(user._id));
    if (selfEntry) selfEntry.count = 0;

    conv.unreadByUser = unreadArr;
    await conv.save();

    await message.populate('sender', 'firstName lastName avatarUrl role');
    return { message };
  },

  async markRead(user, conversationId) {
    const conv = await loadConversationForUser(user, conversationId);
    const unreadArr = conv.unreadByUser || [];
    const entry = unreadArr.find((u) => String(u.user) === String(user._id));
    if (entry) entry.count = 0;
    conv.unreadByUser = unreadArr;
    await conv.save();
    await Message.updateMany(
      { conversation: conv._id, readBy: { $ne: user._id } },
      { $push: { readBy: user._id } }
    );
    return { ok: true };
  }
};