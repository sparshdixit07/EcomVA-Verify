import api from './api.js';

export const clientService = {
  getProfile: () => api.get('/clients/me').then((r) => r.data),
  updateProfile: (payload) => api.put('/clients/me', payload).then((r) => r.data),
  getDashboard: () => api.get('/clients/me/dashboard').then((r) => r.data),
  list: (params) => api.get('/clients', { params }).then((r) => r.data),
  getById: (id) => api.get(`/clients/${id}`).then((r) => r.data)
};