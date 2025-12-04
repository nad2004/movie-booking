// lib/api/work-schedules.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios"; // Đường dẫn axios instance của bạn
import { 
  WorkSchedule, 
  GenerateWorkScheduleDTO, 
  GetWorkScheduleParams,
  WorkScheduleResponseData
} from "@/types/work-schedule";
import { useNotification } from "@/providers/NotificationProvider";
// --- 1. Raw API Functions ---

// GET: Lấy danh sách lịch làm việc
export async function getWorkSchedules(params: GetWorkScheduleParams) {
  // Chỉ gọi API khi có đủ params quan trọng (ví dụ: theaterId)
  // Tuy nhiên, logic này có thể để ở component hoặc hook
  const res = await api.get<WorkScheduleResponseData>("/work-schedules", {
    params,
  });
  return res.data.data;
}

// POST: Sinh lịch làm việc tự động
export async function generateWorkSchedules(data: GenerateWorkScheduleDTO) {
  const res = await api.post("/work-schedules/generate", data);
  return res.data;
}

// DELETE: Xóa một lịch làm việc (Thường cần cho chức năng xóa slot trên UI)
export async function deleteWorkSchedule(id: string) {
  const res = await api.delete(`/work-schedules/${id}`);
  return res.data;
}

// --- 2. Custom Hooks (React Query) ---

// Hook lấy danh sách lịch (Tự động refetch khi params thay đổi)
export function useWorkSchedules(params: GetWorkScheduleParams) {
  return useQuery({
    // Query Key bao gồm params để cache riêng biệt cho từng tháng/rạp
    queryKey: ["work-schedules", params], 
    queryFn:  () => getWorkSchedules(params),
    // Chỉ fetch khi có theaterId (để tránh gọi lỗi khi chưa chọn rạp)
    enabled: !!params.theaterId && !!params.from && !!params.to,
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
}

// Hook Mutation cho các hành động thay đổi dữ liệu
export function useWorkScheduleMutations() {
  const queryClient = useQueryClient();
  const {showSuccess, showError} = useNotification();
  // Generate Schedule Mutation
  const generateMutation = useMutation({
    mutationFn: (data: GenerateWorkScheduleDTO) => generateWorkSchedules(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["work-schedules"] });
      showSuccess("Tạo lịch thành công")
    },
    onError: (error: any) => showError('Lỗi!', error.response?.data?.message),
  });

  // Delete Schedule Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWorkSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-schedules"] });
      showSuccess("Xoá lịch thành công")
    },
    onError: (error: any) => showError('Lỗi!', error.response?.data?.message),
  });

  return {
    generate: generateMutation,
    remove: deleteMutation,
  };
}