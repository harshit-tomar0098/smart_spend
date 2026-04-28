import axios from 'axios';

const api = axios.create({
  baseURL: `http://${window.location.hostname}:5001/api`,
});

// Interceptor to add JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
