import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMovie, updateMovie, deleteMovie } from "@/lib/api/movies";
import { MovieCreateDTO, MovieUpdateDTO } from "@/types/movie";
import { toast } from "sonner";
import { useNotification } from '@/providers/NotificationProvider'

export function useMovieMutations() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification()
  const createMutation = useMutation({
    mutationFn: (data: MovieCreateDTO) => createMovie(data),
    onSuccess: () => {
      showSuccess('Thêm phim thành công!');
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (error: any) => showError('Lỗi!', error.response?.data?.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MovieUpdateDTO }) => updateMovie(id, data),
    onSuccess: () => {
      showSuccess('Cập nhập phim thành công!')
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (error: any) => {showError('Lỗi!', error.response?.data?.message)},
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMovie(id),
    onSuccess: () => {
      showSuccess('Xoá phim thành công!')
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (error: any) => showError('Lỗi!', error.response?.data?.message),
  });

  return { createMutation, updateMutation, deleteMutation };
}