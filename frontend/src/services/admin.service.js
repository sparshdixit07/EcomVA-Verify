import api from './api.js';

export const adminService = {
  dashboard: () => api.get('/admin/dashboard').then((r) => r.data),
  listUsers: (params) => api.get('/admin/users', { params }).then((r) => r.data),
  getUser: (id) => api.get(`/admin/users/${id}`).then((r) => r.data),
  suspendUser: (id, reason) =>
    api.post(`/admin/users/${id}/suspend`, { reason }).then((r) => r.data),
  activateUser: (id) => api.post(`/admin/users/${id}/activate`).then((r) => r.data),
  listAuditLogs: (params) => api.get('/admin/audit-logs', { params }).then((r) => r.data),
  stats: () => api.get('/admin/stats').then((r) => r.data)
};