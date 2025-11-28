import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { User } from '@/types/user'
import { useUserMutations } from '../hooks/useUserMutations'
import { Loader2 } from 'lucide-react'

interface UpdateRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export function UpdateRoleDialog({ open, onOpenChange, user }: UpdateRoleDialogProps) {
  const [role, setRole] = useState<string>(user?.role ?? '')
  const { updateRoleMutation } = useUserMutations()

  const handleUpdate = () => {
    if (!user) return
    updateRoleMutation.mutate(
      { id: user._id, data: { role: role as any } },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-gray-50 text-gray-900">
        <DialogHeader>
          <DialogTitle>Thay đổi vai trò người dùng</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <p>
              Đang chỉnh sửa: <span className="font-bold">{user?.fullName}</span>
            </p>
            <p className="text-gray-500">{user?.email}</p>
          </div>
          <div className="space-y-2">
            <Label>Vai trò mới</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent className=" bg-gray-50 text-gray-900">
                <SelectItem value="customer">Customer (Khách hàng)</SelectItem>
                <SelectItem value="staff">Staff (Nhân viên)</SelectItem>
                <SelectItem value="admin">Admin (Quản trị viên)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant='default'
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={updateRoleMutation.isPending}
            className="bg-primary"
          >
            {updateRoleMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
