import { api } from '@/lib/api/axios'; // Giả sử bạn đã cấu hình axios instance
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/auth';

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  // Gọi endpoint /auth/login như trong ảnh
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
};
export const registerApi = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/auth/register', data);
  return response.data;
};