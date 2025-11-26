import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTheater, updateTheater, deleteTheater, TheaterCreateDTO, TheaterUpdateDTO } from "@/lib/api/theaters";
import { toast } from "sonner";

export function useTheaterMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: TheaterCreateDTO) => createTheater(data),
    onSuccess: () => {
      toast.success("Thêm rạp thành công!");
      queryClient.invalidateQueries({ queryKey: ["theaters"] });
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Thêm thất bại"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TheaterUpdateDTO }) => updateTheater(id, data),
    onSuccess: () => {
      toast.success("Cập nhật rạp thành công!");
      queryClient.invalidateQueries({ queryKey: ["theaters"] });
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Cập nhật thất bại"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTheater(id),
    onSuccess: () => {
      toast.success("Xóa rạp thành công!");
      queryClient.invalidateQueries({ queryKey: ["theaters"] });
    },
    onError: (error: any) => toast.error("Xóa thất bại"),
  });

  return { createMutation, updateMutation, deleteMutation };
}