// app/(admin)/shift-manager/components/modals/assign-staff-modal.tsx
'use client'

import { useEffect, useMemo, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

// API & Types
import { useAssignmentMutations } from '@/lib/api/shift-assignments'
import { useUsers } from '@/lib/api/user'
import { ShiftWithEmployees, CreateAssignmentDTO } from '@/types/shift'
// Validation Schema
const assignStaffSchema = z.object({
  userId: z.string().min(1, 'Vui lòng chọn nhân viên'),
})

type AssignStaffFormData = z.infer<typeof assignStaffSchema>

interface AssignStaffModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSchedule?: ShiftWithEmployees | null
  selectedTheaterId: string
}

export default function AssignStaffModal({
  open,
  onOpenChange,
  selectedSchedule,
  selectedTheaterId
}: AssignStaffModalProps) {
  const { data: usersData, isLoading: isLoadingUsers } = useUsers({role: 'staff'})
  const { bulkCreate  } = useAssignmentMutations()

  const users = useMemo(() => usersData?.users || [], [usersData])

  // --- React Hook Form ---
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AssignStaffFormData>({
    resolver: zodResolver(assignStaffSchema),
    defaultValues: {
      userId: '',
    },
  })

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset({
        userId: '',
      })
    }
  }, [open, reset])
  // --- Handlers ---
  const onSubmit = useCallback(
    async (data: AssignStaffFormData) => {
      if (!selectedSchedule || !selectedTheaterId) return

      try {
        // Sử dụng bulk API với structure đúng theo swagger
        const payload = {
          theaterId: selectedTheaterId,
          assignments: [
            {
              workScheduleId: selectedSchedule.scheduleId,
              userId: data.userId,
              role: 'staff', 
            }
          ]
        }

        await bulkCreate.mutateAsync(payload)

        const user = users.find((u) => u._id === data.userId)
        toast.success('Phân công thành công!', {
          description: `Đã phân công ${user?.fullName} vào ca ${selectedSchedule.shift.name}`,
        })

        onOpenChange(false)
      } catch (error: any) {
        toast.error('Lỗi khi phân công', {
          description: error?.message || 'Vui lòng thử lại',
        })
      }
    },
    [selectedSchedule, selectedTheaterId, bulkCreate, onOpenChange, users]
  )

  const handleCancel = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Phân Công Nhân Viên</DialogTitle>
          {selectedSchedule && (
            <DialogDescription className="text-sm text-gray-500 mt-1">
              {selectedSchedule.date} - {selectedSchedule.shift.name} ({selectedSchedule.shift.startTime} -{' '}
              {selectedSchedule.shift.endTime})
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 py-4">
            {/* Select User */}
            <div className="space-y-2">
              <Label htmlFor="userId">
                Chọn Nhân Viên <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="userId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={isLoadingUsers}>
                    <SelectTrigger
                      id="userId"
                      className={`h-12 ${errors.userId ? 'border-red-500' : ''}`}
                    >
                      <SelectValue placeholder="Tìm kiếm nhân viên..." />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingUsers ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        </div>
                      ) : users.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 text-sm">
                          Không có nhân viên khả dụng
                        </div>
                      ) : (
                        users.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={user.profilePicture} />
                                <AvatarFallback className="text-xs">
                                  {user.fullName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                {user.fullName} • {user.email}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.userId && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.userId.message}
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-900">
                💡 Nhân viên sẽ nhận thông báo qua email sau khi được phân công
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoadingUsers}
              className="bg-[#6C63FF] hover:bg-[#5a52e0] text-white min-w-[100px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Xác Nhận'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}