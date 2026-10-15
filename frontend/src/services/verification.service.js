import api from './api.js';

export const verificationService = {
  myStatus: () => api.get('/verification/me').then((r) => r.data),
  list: (params) => api.get('/verification', { params }).then((r) => r.data),
  decide: (id, payload) =>
    api.post(`/verification/${id}/decide`, payload).then((r) => r.data)
};