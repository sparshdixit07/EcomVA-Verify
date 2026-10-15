import api from './api.js';

export const performanceService = {
  myPerformance: () => api.get('/performance/me').then((r) => r.data),
  forVA: (vaId) => api.get(`/performance/va/${vaId}`).then((r) => r.data),
  forEngagement: (engagementId) =>
    api.get(`/performance/engagement/${engagementId}`).then((r) => r.data)
};