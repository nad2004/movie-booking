import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveReview, rejectReview, deleteReview, RejectReviewDTO } from "@/lib/api/reviews";
import { toast } from "sonner";

export function useReviewMutations() {
  const queryClient = useQueryClient();

  // Duyệt
  const approveMutation = useMutation({
    mutationFn: (id: string) => approveReview(id),
    onSuccess: () => {
      toast.success("Đã duyệt đánh giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: any) => toast.error("Duyệt thất bại"),
  });

  // Từ chối
  const rejectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RejectReviewDTO }) => rejectReview(id, data),
    onSuccess: () => {
      toast.success("Đã từ chối đánh giá!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: any) => toast.error("Thao tác thất bại"),
  });

  // Xóa
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      toast.success("Xóa đánh giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: any) => toast.error("Xóa thất bại"),
  });

  return { approveMutation, rejectMutation, deleteMutation };
}