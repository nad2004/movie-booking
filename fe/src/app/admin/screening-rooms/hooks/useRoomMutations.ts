import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoom, updateRoom, deleteRoom, RoomCreateDTO, RoomUpdateDTO } from "@/lib/api/rooms";
import { toast } from "sonner";

export function useRoomMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: ({ theaterId, data }: { theaterId: string; data: RoomCreateDTO }) => 
      createRoom(theaterId, data),
    onSuccess: () => {
      toast.success("Thêm phòng chiếu thành công!");
      queryClient.invalidateQueries({ queryKey: ["theaters"] }); // Refresh lại theaters để lấy rooms mới
    },
    onError: (error: any) => toast.error("Thêm thất bại"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ theaterId, roomId, data }: { theaterId: string; roomId: string; data: RoomUpdateDTO }) => 
      updateRoom(theaterId, roomId, data),
    onSuccess: () => {
      toast.success("Cập nhật phòng chiếu thành công!");
      queryClient.invalidateQueries({ queryKey: ["theaters"] });
    },
    onError: (error: any) => toast.error("Cập nhật thất bại"),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ theaterId, roomId }: { theaterId: string; roomId: string }) => 
      deleteRoom(theaterId, roomId),
    onSuccess: () => {
      toast.success("Xóa phòng chiếu thành công!");
      queryClient.invalidateQueries({ queryKey: ["theaters"] });
    },
    onError: (error: any) => toast.error("Xóa thất bại"),
  });

  return { createMutation, updateMutation, deleteMutation };
}