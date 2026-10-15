import api from './api.js';

export const userService = {
  updateMe: (payload) => api.patch('/users/me', payload).then((r) => r.data),
  uploadAvatar: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api
      .post('/users/me/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((r) => r.data);
  },
  getPublicVA: (id) => api.get(`/users/vas/${id}`).then((r) => r.data)
};