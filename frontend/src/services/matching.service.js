import api from './api.js';

export const matchingService = {
  matchForRequirement: (requirementId, params) =>
    api.get(`/matching/requirements/${requirementId}`, { params }).then((r) => r.data),
  preview: (payload) => api.post('/matching/preview', payload).then((r) => r.data)
};