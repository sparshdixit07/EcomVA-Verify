import api from './api.js';

export const reviewService = {
  listForVA: (vaId, params) =>
    api.get(`/reviews/va/${vaId}`, { params }).then((r) => r.data),
  listMine: (params) => api.get('/reviews/mine', { params }).then((r) => r.data),
  create: (payload) => api.post('/reviews', payload).then((r) => r.data),
  flag: (id, reason) =>
    api.post(`/reviews/${id}/flag`, { reason }).then((r) => r.data),
  listAll: (params) => api.get('/reviews', { params }).then((r) => r.data),
  moderate: (id, payload) =>
    api.post(`/reviews/${id}/moderate`, payload).then((r) => r.data)
};