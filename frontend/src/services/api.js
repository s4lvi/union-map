// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Adjust based on your backend port
});

// Add a request interceptor to include the token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
