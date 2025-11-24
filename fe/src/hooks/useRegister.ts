'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { registerApi } from '@/lib/api/auth'
import { RegisterRequest } from '@/types/auth'
import { toast } from 'sonner' // Hoặc thư viện toast bạn đang dùng

export const useRegister = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: RegisterRequest) => registerApi(data),

    onSuccess: data => {
      // 1. Thông báo thành công
      toast.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.')

      // 2. Chuyển hướng về trang đăng nhập
      router.push('/login')
    },

    onError: (error: any) => {
      // Xử lý lỗi từ Backend trả về
      const message = error?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      toast.error(message)
      console.error('Register error:', error)
    },
  })
}
