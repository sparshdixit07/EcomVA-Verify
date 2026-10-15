import api from './api.js';

export const trialTaskService = {
  listMine: (params) => api.get('/trial-tasks/mine', { params }).then((r) => r.data),
  getById: (id) => api.get(`/trial-tasks/${id}`).then((r) => r.data),
  create: (payload) => api.post('/trial-tasks', payload).then((r) => r.data),
  accept: (id) => api.post(`/trial-tasks/${id}/accept`).then((r) => r.data),
  submit: (id, payload) =>
    api.post(`/trial-tasks/${id}/submit`, payload).then((r) => r.data),
  review: (id, payload) =>
    api.post(`/trial-tasks/${id}/review`, payload).then((r) => r.data),
  cancel: (id) => api.post(`/trial-tasks/${id}/cancel`).then((r) => r.data)
};