import api from './api.js';

export const taskService = {
  listByEngagement: (engagementId, params) =>
    api.get(`/tasks/engagement/${engagementId}`, { params }).then((r) => r.data),
  listMine: (params) => api.get('/tasks/mine', { params }).then((r) => r.data),
  getById: (id) => api.get(`/tasks/${id}`).then((r) => r.data),
  create: (payload) => api.post('/tasks', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/tasks/${id}`, payload).then((r) => r.data),
  start: (id) => api.post(`/tasks/${id}/start`).then((r) => r.data),
  submit: (id, payload) => api.post(`/tasks/${id}/submit`, payload).then((r) => r.data),
  approve: (id, payload) =>
    api.post(`/tasks/${id}/approve`, payload || {}).then((r) => r.data),
  requestRevision: (id, payload) =>
    api.post(`/tasks/${id}/revision`, payload).then((r) => r.data),
  cancel: (id) => api.post(`/tasks/${id}/cancel`).then((r) => r.data)
};