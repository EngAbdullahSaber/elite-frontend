// libs/axios.ts
import axios from "axios";
import { getHeaderConfig } from "./utils";

// Create axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const headerConfig = getHeaderConfig();

    // Merge headers
    config.headers = {
      ...config.headers,
      ...headerConfig.headers,
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Authentication failed. Please login again.");
      // You might want to redirect to login page or clear tokens
      // clearAuthInfo();
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
