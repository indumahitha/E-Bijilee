// src/api/axiosClient.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from localStorage to every request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // AuthContext should store token here on login
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosClient;
