import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole, deleteUser, UpdateRoleDTO } from "@/lib/api/user";
import { toast } from "sonner";

export function useUserMutations() {
  const queryClient = useQueryClient();

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleDTO }) => updateUserRole(id, data),
    onSuccess: () => {
      toast.success("Cập nhật quyền thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-detail"] });
    },
    onError: (error: any) => toast.error("Cập nhật thất bại"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.success("Xóa người dùng thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => toast.error("Xóa thất bại"),
  });

  return { updateRoleMutation, deleteMutation };
}