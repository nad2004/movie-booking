'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBookingApi } from '@/lib/api/booking';
import { CreateBookingRequest } from '@/types/booking';
import { useNotification } from '@/providers/NotificationProvider'

export const useCreateBooking = () => {
    const { showSuccess, showError } = useNotification()
    const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => createBookingApi(data),

    onSuccess: (response)=>{
    queryClient.invalidateQueries({ queryKey: ['schedules'] })
      showSuccess('Tạo đơn thành công!', 'Vui lòng thanh toán!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Đặt vé thất bại. Vui lòng thử lại.';
      showError("lỗi!", message)
    },
    // Lưu ý: onSuccess sẽ được handle cụ thể trong useBooking để chuyển step
  });
};