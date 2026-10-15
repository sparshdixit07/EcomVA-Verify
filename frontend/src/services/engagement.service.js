import api from './api.js';

export const engagementService = {
  listMine: (params) => api.get('/engagements/mine', { params }).then((r) => r.data),
  getById: (id) => api.get(`/engagements/${id}`).then((r) => r.data),
  update: (id, payload) => api.patch(`/engagements/${id}`, payload).then((r) => r.data),
  complete: (id) => api.post(`/engagements/${id}/complete`).then((r) => r.data),
  cancel: (id) => api.post(`/engagements/${id}/cancel`).then((r) => r.data)
};