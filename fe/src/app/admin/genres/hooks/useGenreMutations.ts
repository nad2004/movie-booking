import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGenre, updateGenre, deleteGenre, GenreCreateDTO, GenreUpdateDTO } from "@/lib/api/genres";
import { toast } from "sonner";

export function useGenreMutations() {
  const queryClient = useQueryClient();

  // Thêm mới
  const createMutation = useMutation({
    mutationFn: (data: GenreCreateDTO) => createGenre(data),
    onSuccess: () => {
      toast.success("Thêm thể loại thành công!");
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Thêm thất bại"),
  });

  // Cập nhật
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: GenreUpdateDTO }) => updateGenre(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Cập nhật thất bại"),
  });

  // Xóa
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGenre(id),
    onSuccess: () => {
      toast.success("Xóa thể loại thành công!");
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Xóa thất bại"),
  });

  return { createMutation, updateMutation, deleteMutation };
}