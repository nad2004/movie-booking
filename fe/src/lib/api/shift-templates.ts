import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { ShiftTemplateResponse } from "@/types/shift"; // Đảm bảo đường dẫn import đúng file shift.ts của bạn
import { useNotification } from "@/providers/NotificationProvider";
// --- DTO Types ---

// Params để lọc danh sách (nếu cần sau này)
export interface GetShiftTemplateParams {
  search?: string;   // Tìm theo tên hoặc code
  isActive?: boolean; // Lọc theo trạng thái
}

// Data object khi tạo mới (loại bỏ id)
export interface ShiftTemplateCreateDTO {
  code: string;
  name: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  color: string;
  isActive: boolean;
}

// --- 1. Raw API Functions (Giống mẫu schedules.ts) ---

export async function getShiftTemplates(params: GetShiftTemplateParams = {}) {
  try {
    const res = await api.get<ShiftTemplateResponse>("/shift-templates", {
      params,
    });
    return res.data.data; 
  } catch (error) {
    console.log("Failed to fetch shift templates", error);
    return []; 
  }
}

export async function createShiftTemplate(data: ShiftTemplateCreateDTO) {
  const res = await api.post("/shift-templates", data);
  return res.data;
}

export async function updateShiftTemplate(id: string, data: ShiftTemplateCreateDTO) {
  const res = await api.put(`/shift-templates/${id}`, data);
  return res.data;
}

export async function deleteShiftTemplate(id: string) {
  const res = await api.delete(`/shift-templates/${id}`);
  return res.data;
}

// --- 2. Custom Hooks (React Query) ---

// Hook lấy danh sách (GET)
export function useShiftTemplates(params: GetShiftTemplateParams = {}) {
  return useQuery({
    queryKey: ["shift-templates", params],
    queryFn: () => getShiftTemplates(params),
    staleTime: 1000 * 60 * 5, // Cache 5 phút
    retry: 2,
  });
}

// Hook Mutation tổng hợp (Create / Update / Delete)
// Giúp bạn gọi hàm và tự động reload lại danh sách sau khi thành công
export function useShiftTemplateMutations() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification()
  // Create
  const createMutation = useMutation({
    mutationFn: (data: ShiftTemplateCreateDTO) => createShiftTemplate(data),
    onSuccess: () => {
      // Sau khi tạo thành công, báo cho React Query data đã cũ -> tự động fetch lại
      queryClient.invalidateQueries({ queryKey: ["shift-templates"] });
      showSuccess('Tạo thành công')
    },
    onError: (error: any) => showError('Lỗi!', error.response?.data?.message),
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ShiftTemplateCreateDTO }) =>
      updateShiftTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shift-templates"] });
      showSuccess('Cập nhập thành công')
    },
    onError: (error: any) => showError('Lỗi!', error.response?.data?.message),
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteShiftTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shift-templates"] });
      showSuccess('Xoá thành công')
    },
    onError: (error: any) => showError('Lỗi!', error.response?.data?.message),
  });

  return {
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation, // Đổi tên thành remove để tránh trùng từ khóa delete
  };
}