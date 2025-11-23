'use client'

import { useMutation } from '@tanstack/react-query'
import { forgotPasswordApi } from '@/lib/api/auth'
import { toast } from 'sonner' // Hoặc thư viện toast bạn đang dùng

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPasswordApi(email),

    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại.'
      toast.error(message)
    },
    // onSuccess sẽ được xử lý ở component để chuyển đổi UI
  })
}
