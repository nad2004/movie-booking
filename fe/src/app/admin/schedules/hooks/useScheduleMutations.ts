import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSchedule, updateSchedule, deleteSchedule, ScheduleCreateDTO, ScheduleUpdateDTO } from "@/lib/api/schedules";
import { toast } from "sonner";

export function useScheduleMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: ScheduleCreateDTO) => createSchedule(data),
    onSuccess: () => {
      toast.success("Tạo lịch chiếu thành công!");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Tạo thất bại"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ScheduleUpdateDTO }) => updateSchedule(id, data),
    onSuccess: () => {
      toast.success("Cập nhật lịch chiếu thành công!");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error: any) => toast.error("Cập nhật thất bại"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSchedule(id),
    onSuccess: () => {
      toast.success("Xóa lịch chiếu thành công!");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error: any) => toast.error("Xóa thất bại"),
  });

  return { createMutation, updateMutation, deleteMutation };
}