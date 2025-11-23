'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation' // Thêm useSearchParams
import { loginApi } from '@/lib/api/auth'
import { useUserStore } from '@/store/userStore'
import { LoginRequest, LoginResponse } from '@/types/auth'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

export const useLogin = () => {
  const router = useRouter()
  const searchParams = useSearchParams() // Lấy params để check callbackUrl
  const setUser = useUserStore(state => state.setUser)

  return useMutation({
    mutationFn: (data: LoginRequest) => loginApi(data),

    onSuccess: (response: LoginResponse) => {
      const { token, user } = response.data

      // 1. Lưu Cookie
      Cookies.set('authToken', token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })

      // 2. Cập nhật Store Client
      setUser(user)
      toast.success(response.message || 'Đăng nhập thành công!')

      // 3. QUAN TRỌNG: Refresh để Server Components nhận diện Cookie mới
      router.refresh()

      // 4. Điều hướng thông minh
      // Ưu tiên 1: Nếu có callbackUrl (do Middleware đẩy về), thì quay lại đó
      const callbackUrl = searchParams.get('callbackUrl')
      if (callbackUrl) {
        router.push(callbackUrl)
        return
      }

      // Ưu tiên 2: Điều hướng theo Role
      const role = user.role.toLowerCase()
      switch (role) {
        case 'admin':
          router.push('/admin')
          break
        case 'staff':
          router.push('/staff')
          break
        case 'customer':
        default:
          router.push('/')
          break
      }
    },

    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Đăng nhập thất bại'
      toast.error(message)
    },
  })
}
