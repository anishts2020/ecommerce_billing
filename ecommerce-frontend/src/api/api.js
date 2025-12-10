import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000/api"; 
// or "http://127.0.0.1:8000/api" locally

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// OPTIONAL → Add token automatically if you use auth
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;