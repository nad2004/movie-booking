import { User, UserListResponse } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { ApiResponse } from "@/types/apiTemplate";

// --- Params ---
export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string; // "customer" | "staff" | "admin"
}

export interface UpdateRoleDTO {
  role: "customer" | "staff" | "admin";
}

// --- API Functions ---

// 1. Get List
export async function getUsers(params: GetUsersParams = {}) {
  try {
    const res = await api.get<UserListResponse>("/admin/users", { params });
    return res.data.data;
  } catch (error) {
    console.error("Fetch users failed", error);
    return { 
        users: [], 
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 } 
    };
  }
}

// 2. Get Detail
export async function getUserDetail(id: string) {
  // Dựa theo ảnh: GET /admin/users/{id}
  const res = await api.get<ApiResponse<User>>(`/admin/users/${id}`);
  return res.data.data;
}

// 3. Update Role
export async function updateUserRole(id: string, data: UpdateRoleDTO) {
  // Dựa theo ảnh: PUT /admin/users/{id}/role
  const res = await api.put(`/admin/users/${id}/role`, data);
  return res.data;
}

// 4. Delete User
export async function deleteUser(id: string) {
  // Dựa theo ảnh: DELETE /admin/users/{id}
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
}

export function useUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
}

export function useUserDetail(id: string | null) {
  return useQuery({
    queryKey: ["user-detail", id],
    queryFn: () => getUserDetail(id!),
    enabled: !!id, // Chỉ fetch khi có ID
  });
}

/**
 * Hook lấy staff theo theater
 * Wrapper tiện lợi cho useUsers với filter theaterId
 */
// export function useTheaterStaff(theaterId: string) {
//   return useUsers({
//     theaterId,
//     role: 'staff',
//     status: 'active',
//   });
// }