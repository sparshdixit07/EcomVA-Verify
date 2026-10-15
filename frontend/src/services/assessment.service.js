import api from './api.js';

export const assessmentService = {
  list: (params) => api.get('/assessments', { params }).then((r) => r.data),
  getById: (id) => api.get(`/assessments/${id}`).then((r) => r.data),
  start: (id) => api.post(`/assessments/${id}/start`).then((r) => r.data),
  submit: (id, answers) =>
    api.post(`/assessments/${id}/submit`, { answers }).then((r) => r.data),
  myResults: () => api.get('/assessments/me/results').then((r) => r.data),
  createAssessment: (payload) => api.post('/assessments', payload).then((r) => r.data),
  updateAssessment: (id, payload) =>
    api.put(`/assessments/${id}`, payload).then((r) => r.data),
  deleteAssessment: (id) => api.delete(`/assessments/${id}`).then((r) => r.data),
  listQuestions: (assessmentId) =>
    api.get(`/assessments/${assessmentId}/questions`).then((r) => r.data),
  createQuestion: (assessmentId, payload) =>
    api.post(`/assessments/${assessmentId}/questions`, payload).then((r) => r.data),
  updateQuestion: (assessmentId, qid, payload) =>
    api.put(`/assessments/${assessmentId}/questions/${qid}`, payload).then((r) => r.data),
  deleteQuestion: (assessmentId, qid) =>
    api.delete(`/assessments/${assessmentId}/questions/${qid}`).then((r) => r.data)
};