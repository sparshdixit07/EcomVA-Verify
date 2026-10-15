import api from './api.js';

export const hiringService = {
  create: (payload) => api.post('/hiring', payload).then((r) => r.data),
  listMine: (params) => api.get('/hiring/mine', { params }).then((r) => r.data),
  getById: (id) => api.get(`/hiring/${id}`).then((r) => r.data),
  accept: (id) => api.post(`/hiring/${id}/accept`).then((r) => r.data),
  reject: (id, reason) =>
    api.post(`/hiring/${id}/reject`, { reason }).then((r) => r.data),
  cancel: (id) => api.post(`/hiring/${id}/cancel`).then((r) => r.data),
  complete: (id) => api.post(`/hiring/${id}/complete`).then((r) => r.data)
};