'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation' // 1. Import hook
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Eye, EyeOff, Film } from 'lucide-react'
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback'

// Import React Hook Form + Zod
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner' // Hoặc thư viện toast bạn dùng

// --- SCHEMA VALIDATION ---
const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

// --- COMPONENT FORM (Tách ra để dùng Suspense) ---
function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // 2. Lấy token từ URL
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Token không hợp lệ hoặc đã hết hạn")
      return
    }

    try {
      // --- GỌI API Ở ĐÂY ---
      // Ví dụ:
      // await api.post('/auth/reset-password', { 
      //   token: token, 
      //   newPassword: data.password 
      // })
      
      console.log("Gửi token:", token)
      console.log("Gửi password:", data.password)

      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Đổi mật khẩu thành công!")
      router.push('/login')
      
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại")
    }
  }

  // Nếu không có token trên URL, hiển thị lỗi
  if (!token) {
    return (
      <div className="text-center text-red-500">
        <h3 className="text-xl font-bold">Liên kết không hợp lệ</h3>
        <p>Vui lòng kiểm tra lại email của bạn.</p>
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Password */}
      <div className="space-y-2">
        <label className="block text-sm text-gray-700 font-medium">
          Mật khẩu mới
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Nhập mật khẩu mới"
            className={`h-12 pl-10 pr-10 bg-gray-50 border-gray-200 text-black placeholder:text-gray-500 focus-visible:ring-primary ${
              errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''
            }`}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="block text-sm text-gray-700 font-medium">
          Xác nhận mật khẩu
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Nhập lại mật khẩu"
            className={`h-12 pl-10 pr-10 bg-gray-50 border-gray-200 text-black placeholder:text-gray-500 focus-visible:ring-primary ${
              errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''
            }`}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-lg"
      >
        {isSubmitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
      </Button>
    </form>
  )
}

// --- MAIN PAGE ---
// 3. Quan trọng: Phải bọc component dùng useSearchParams trong Suspense
// Nếu không build sẽ bị lỗi hoặc mất static optimization
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Giữ nguyên giao diện cũ */}
      <div className="lg:w-[40%] bg-[#6c63ff] text-white p-8 lg:p-12 flex flex-col justify-center items-center order-2 lg:order-1">
        <div className="max-w-md w-full space-y-8">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <Film className="w-8 h-8" />
            </div>
            <span className="text-2xl font-semibold">CineBooking</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Secure your account.
            </h1>
            <p className="text-white/80 text-lg">
              Create a new strong password to protect your movie streaming history.
            </p>
          </div>
          <div className="pt-8">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=1080"
              alt="Security Lock"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-[60%] bg-white p-8 lg:p-12 flex items-center justify-center order-1 lg:order-2">
        <div className="max-w-md w-full space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-gray-900">Đặt lại mật khẩu</h2>
            <p className="text-gray-600">Vui lòng nhập mật khẩu mới của bạn</p>
          </div>

          {/* Suspense Boundary */}
          <Suspense fallback={<div>Đang tải...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}