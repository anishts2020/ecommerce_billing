import axios from "axios";

// API base (for axios calls)
export const API_BASE_URL = "http://127.0.0.1:8000/api";

// Asset base (for images, files)
export const ASSET_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;