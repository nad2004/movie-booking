import { api } from '@/lib/api/axios';
import { 
  LoginRequest, LoginResponse, 
  RegisterRequest, RegisterResponse,
  ForgotPasswordRequest, ForgotPasswordResponse,
  ResetPasswordRequest, ResetPasswordResponse,
  ChangePasswordRequest, ChangePasswordResponse,
  GoogleLoginRequest
} from '@/types/auth';

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
};

export const registerApi = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/auth/register', data);
  return response.data;
};

export const forgotPasswordApi = async (email: string): Promise<ForgotPasswordResponse> => {
  const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
  return response.data;
};

export const resetPasswordApi = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const response = await api.post<ResetPasswordResponse>('/auth/reset-password', data);
  return response.data;
};
export const changePasswordApi = async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  const response = await api.put<ChangePasswordResponse>('/auth/change-password', data);
  return response.data;
};

export const googleLoginApi = async (data: GoogleLoginRequest): Promise<LoginResponse> => {
  // Gửi trực tiếp thông tin user sang Backend để lưu/đăng nhập
  const response = await api.post<LoginResponse>('/auth/google-login', data);
  return response.data;
};