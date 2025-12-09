import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('🔹 Axios Interceptor: Attached Token', token);
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
    const isStaffProfileRequest = originalRequest.url && originalRequest.url.includes('/staff/profile');

    // Không xử lý 401 cho login request và staff profile request
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest && !isStaffProfileRequest) {
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
// Biến cờ để kiểm soát việc Refresh Token
// let isRefreshing = false;
// // Hàng đợi lưu các request bị lỗi chờ refresh xong
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };
// try {
//         const { data } = await api.post('/auth/refresh-token'); 
        
//         const newAccessToken = data.accessToken;
//         Cookies.set("authToken", newAccessToken, {
//             expires: 1/24, 
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict'
//         });

//         api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

//         processQueue(null, newAccessToken);

//         // Gọi lại request ban đầu bị lỗi
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);

//       } catch (refreshError) {
//         // Refresh thất bại (Hết hạn cả Refresh Token hoặc bị khóa)
//         processQueue(refreshError, null);
        
//         // Logout & Redirect
//         Cookies.remove("authToken");
//         if (typeof window !== "undefined") {
//            const currentPath = window.location.pathname;
//            // Chỉ redirect nếu đang ở trang cần bảo vệ, tránh redirect loop ở trang login
//            if (!currentPath.startsWith('/login')) {
//                window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
//            }
//         }
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }