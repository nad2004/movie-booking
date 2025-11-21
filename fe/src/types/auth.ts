// types/auth.ts
import type { User } from '@/types/user' 

export interface LoginRequest {
  email: string;
  password: string;
}

// Structure dựa trên hình ảnh Swagger (data -> token, user)
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User; // User này phải khớp với interface trong userStore của bạn
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  // Có thể có data hoặc không tùy backend, nhưng thường đăng ký chỉ cần success msg
}