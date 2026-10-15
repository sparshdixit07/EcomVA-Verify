import api from './api.js';

export const messageService = {
  listConversations: (params) =>
    api.get('/messages/conversations', { params }).then((r) => r.data),
  startConversation: (payload) =>
    api.post('/messages/conversations', payload).then((r) => r.data),
  getConversation: (id) =>
    api.get(`/messages/conversations/${id}`).then((r) => r.data),
  listMessages: (conversationId, params) =>
    api
      .get(`/messages/conversations/${conversationId}/messages`, { params })
      .then((r) => r.data),
  send: (conversationId, payload) =>
    api
      .post(`/messages/conversations/${conversationId}/messages`, payload)
      .then((r) => r.data),
  markRead: (conversationId) =>
    api.post(`/messages/conversations/${conversationId}/read`).then((r) => r.data)
};