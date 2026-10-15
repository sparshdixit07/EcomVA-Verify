import api from './api.js';

export const vaService = {
  getProfile: () => api.get('/vas/me').then((r) => r.data),
  updateProfile: (payload) => api.put('/vas/me', payload).then((r) => r.data),
  getDashboard: () => api.get('/vas/me/dashboard').then((r) => r.data),
  search: (params) => api.get('/vas', { params }).then((r) => r.data),
  getById: (id) => api.get(`/vas/${id}`).then((r) => r.data),
  addSkill: (payload) => api.post('/vas/me/skills', payload).then((r) => r.data),
  updateSkill: (skillId, payload) =>
    api.put(`/vas/me/skills/${skillId}`, payload).then((r) => r.data),
  removeSkill: (skillId) =>
    api.delete(`/vas/me/skills/${skillId}`).then((r) => r.data),
  requestVerification: () => api.post('/vas/me/verification').then((r) => r.data)
};