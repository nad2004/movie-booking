import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMovie, updateMovie, deleteMovie } from "@/lib/api/movies";
import { MovieCreateDTO, MovieUpdateDTO } from "@/types/movie";
import { toast } from "sonner";

export function useMovieMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: MovieCreateDTO) => createMovie(data),
    onSuccess: () => {
      toast.success("Thêm phim thành công!");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Thêm phim thất bại"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MovieUpdateDTO }) => updateMovie(id, data),
    onSuccess: () => {a
      toast.success("Cập nhật phim thành công!");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Cập nhật thất bại"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMovie(id),
    onSuccess: () => {
      toast.success("Xóa phim thành công!");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Xóa phim thất bại"),
  });

  return { createMutation, updateMutation, deleteMutation };
}