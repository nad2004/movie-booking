import axios from "axios";
import Cookies from "js-cookie";

// 1. Tạo instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: false -> Đúng nếu bạn dùng Bearer Token ở Header. 
  // Nếu Backend dùng HttpOnly Cookie tự động set thì mới cần để true.
  withCredentials: false, 
});

// 2. Request Interceptor: Tự động gắn Token vào Header trước khi gửi đi
api.interceptors.request.use(
  (config) => {
    // Lấy token từ Cookie (vì ở bài trước mình đã thống nhất lưu vào Cookie)
    const token = Cookies.get("authToken");

    if (token) {
      // Gắn token vào header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Xử lý lỗi chung (Ví dụ: Token hết hạn)
api.interceptors.response.use(
  (response) => {
    // Nếu API trả về thành công, cứ return data bình thường
    return response;
  },
  async (error) => {
    // Xử lý các lỗi global
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) -> Token hết hạn hoặc không hợp lệ
    // Và tránh loop vô hạn nếu chính cái request logout bị lỗi
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Xử lý Logout:
      // Cách 1: Xóa cookie và reload trang (Đơn giản nhất)
      Cookies.remove("authToken");
      
      // Lưu ý: Dùng window.location để reload cứng, đảm bảo xóa sạch state cũ
      if (typeof window !== "undefined") {
          window.location.href = "/login";
      }
      
      // Cách 2 (Nâng cao): Nếu có Refresh Token, bạn sẽ gọi API refresh ở đây
      // rồi gọi lại originalRequest với token mới.
    }

    return Promise.reject(error);
  }
);