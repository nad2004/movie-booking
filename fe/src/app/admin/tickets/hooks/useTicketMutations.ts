import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookingStatus, deleteBooking } from "@/lib/api/booking";
import { BookingStatus } from "@/types/booking";
import { toast } from "sonner";

export function useTicketMutations() {
  const queryClient = useQueryClient();

  // Cập nhật trạng thái
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) => 
      updateBookingStatus(id, status),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái vé thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: (error: any) => toast.error("Cập nhật thất bại"),
  });

  // Xóa vé
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      toast.success("Xóa vé thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: (error: any) => toast.error("Xóa thất bại"),
  });

  return { updateStatusMutation, deleteMutation };
}