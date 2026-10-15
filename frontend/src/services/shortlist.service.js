import api from './api.js';

export const shortlistService = {
  list: () => api.get('/shortlists').then((r) => r.data),
  add: (payload) => api.post('/shortlists', payload).then((r) => r.data),
  remove: (id) => api.delete(`/shortlists/${id}`).then((r) => r.data),
  compare: (vaIds) =>
    api.post('/shortlists/compare', { vaIds }).then((r) => r.data)
};