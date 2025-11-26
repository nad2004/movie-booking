import { api } from "@/lib/api/axios";
import { useQuery } from "@tanstack/react-query";

import { User } from "@/types/user"; // Đảm bảo bạn đã có type User
import { ApiResponse } from "@/types/apiTemplate"; // Hoặc type response chung của bạn

// Interface cho body request (theo ảnh Swagger)
export interface UpdateProfileDTO {
  fullName?: string;
  phoneNumber?: string;
  // Thêm các trường khác nếu backend hỗ trợ sau này (vd: dateOfBirth)
}

export async function updateProfileApi(data: UpdateProfileDTO) {
  // Gọi PUT /users/profile
  const res = await api.put("/users/profile", data);
  return res.data;
}



export async function uploadAvatarApi(file: File) {
  const formData = new FormData();
  formData.append("avatar", file); // Tên field 'avatar' phải khớp với ảnh Postman

  const res = await api.post("/users/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

// Định nghĩa response cho /auth/me
type MeResponse = ApiResponse<User>;

// --- 1. API lấy thông tin user hiện tại ---
export async function getMe() {
  try {
    // Gọi API /auth/me
    // Header Authorization đã được tự động gắn ở file axios.ts
    const res = await api.get<MeResponse>("/auth/me");
    return res.data.data;
  } catch (error) {
    // Không log lỗi 401 để tránh rác console (vì interceptor đã xử lý)
    throw error;
  }
}

// --- 2. Hook useMe ---
export function useMe() {
  return useQuery({
    queryKey: ["me"], // Key định danh cho user hiện tại
    queryFn: getMe,
    staleTime: 1000 * 60 * 5, // Cache 5 phút
    retry: 1, // Thử lại 1 lần nếu lỗi
    refetchOnWindowFocus: false, // Không fetch lại khi switch tab để đỡ lag
  });
}
