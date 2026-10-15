import api from './api.js';

export const requirementService = {
  list: (params) => api.get('/requirements', { params }).then((r) => r.data),
  mine: (params) => api.get('/requirements/mine', { params }).then((r) => r.data),
  getById: (id) => api.get(`/requirements/${id}`).then((r) => r.data),
  create: (payload) => api.post('/requirements', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/requirements/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/requirements/${id}`).then((r) => r.data),
  findMatches: (id, params) =>
    api.get(`/requirements/${id}/matches`, { params }).then((r) => r.data)
};