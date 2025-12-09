import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000/api";
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Add token to every request (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export { BASE_URL };
export default api;  