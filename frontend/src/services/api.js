import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Request failed';

    if (status === 401) {
      const path = window.location.pathname;
      const isAuthPage =
        path.startsWith('/login') ||
        path.startsWith('/register') ||
        path.startsWith('/forgot-password') ||
        path.startsWith('/reset-password');
      if (!isAuthPage) {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }

    const normalized = new Error(message);
    normalized.status = status;
    normalized.errors = error?.response?.data?.errors || null;
    normalized.original = error;
    return Promise.reject(normalized);
  }
);

export default api;