'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { resetPasswordApi } from '@/lib/api/auth'
import { ResetPasswordRequest } from '@/types/auth'
import { toast } from 'sonner'

export const useResetPassword = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPasswordApi(data),

    onSuccess: () => {
      toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.')
      // Chuyển hướng về trang login sau 1.5s để người dùng kịp đọc thông báo
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Đặt lại mật khẩu thất bại. Token có thể đã hết hạn.'
      toast.error(message)
    },
  })
}
