import api from './api.js';

export const skillService = {
  list: () => api.get('/skills').then((r) => r.data),
  getById: (id) => api.get(`/skills/${id}`).then((r) => r.data)
};