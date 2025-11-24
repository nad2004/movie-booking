import { useMutation } from '@tanstack/react-query'
import { changePasswordApi } from '@/lib/api/auth'
import type { ChangePasswordRequest } from '@/types/auth'
import { toast } from 'sonner'

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePasswordApi(data),

    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công!')
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.'
      toast.error(message)
    },
  })
}
