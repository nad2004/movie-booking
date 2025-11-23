import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLoginRequest = originalRequest.url && originalRequest.url.includes('/auth/login');

    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
      originalRequest._retry = true;

      Cookies.remove("authToken");

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        const protectedPaths = ['/admin', '/staff', '/profile', '/order-history', '/booking'];

        if (protectedPaths.some(path => currentPath.startsWith(path))) {
           window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
        } 
        else {
           window.location.reload();
        }
      }
    }

    return Promise.reject(error);
  }
);