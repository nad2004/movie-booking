import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { ShiftTemplateResponse } from "@/types/shift"; 
import { useNotification } from "@/providers/NotificationProvider";
import axios from "axios"; // Import axios để check isCancel

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

// --- 1. Raw API Functions ---

// Thêm signal
export async function getShiftTemplates(params: GetShiftTemplateParams = {}, signal?: AbortSignal) {
  try {
    const res = await api.get<ShiftTemplateResponse>("/shift-templates", {
      params,
      signal, // 🟢 Truyền signal
    });
    return res.data.data; 
  } catch (error) {
    // 🟢 Check cancel
    if (axios.isCancel(error)) {
        throw error;
    }
    // Nếu lỗi khác (không phải cancel) thì trả về mảng rỗng để không crash UI
    return []; 
  }
}

// --- Mutations (Không cần signal) ---

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
    // 🟢 Lấy signal từ context
    queryFn: ({ signal }) => getShiftTemplates(params, signal),
    staleTime: 1000 * 60 * 5, // Cache 5 phút
    retry: 2,
  });
}

// Hook Mutation tổng hợp (Create / Update / Delete)
export function useShiftTemplateMutations() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification()
  
  // Create
  const createMutation = useMutation({
    mutationFn: (data: ShiftTemplateCreateDTO) => createShiftTemplate(data),
    onSuccess: () => {
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
    remove: deleteMutation, 
  };
}