import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { User } from "@/types/user"; // Đảm bảo bạn đã có type User
import { ApiResponse } from "@/types/apiTemplate"; // Hoặc type response chung của bạn

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

// --- (Giữ lại logic getUsers cũ nếu cần cho Admin) ---
export async function getUsers(page = 1, limit = 10, role?: string) {
  try {
    const res = await api.get(`/users`, {
      params: { page, limit, role },
    });
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch users", err);
    return {
      users: [],
      pagination: { currentPage: 0, totalPages: 0, totalItems: 0, itemsPerPage: 0 },
    };
  }
}

export function useUsers(page = 1, limit = 10, role?: string) {
  return useQuery({
    queryKey: ["users", page, limit, role],
    queryFn: () => getUsers(page, limit, role),
    staleTime: 1000 * 60 * 10,
  });
}