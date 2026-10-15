import api from './api.js';

export const reportService = {
  create: (payload) => api.post('/reports', payload).then((r) => r.data),
  listMine: (params) => api.get('/reports/mine', { params }).then((r) => r.data),
  list: (params) => api.get('/reports', { params }).then((r) => r.data),
  resolve: (id, payload) =>
    api.post(`/reports/${id}/resolve`, payload).then((r) => r.data)
};