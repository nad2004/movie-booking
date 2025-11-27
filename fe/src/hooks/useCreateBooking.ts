'use client'

import { useMutation } from '@tanstack/react-query';
import { createBookingApi } from '@/lib/api/booking';
import { CreateBookingRequest } from '@/types/booking';
import { toast } from 'sonner';
import { useNotification } from '@/providers/NotificationProvider'

export const useCreateBooking = () => {
    const { showSuccess, showError } = useNotification()

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => createBookingApi(data),

    onSuccess: (response)=>{
      showSuccess('Tạo đơn thành công!', 'Vui lòng thanh toán!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Đặt vé thất bại. Vui lòng thử lại.';
      toast.error(message);
    },
    // Lưu ý: onSuccess sẽ được handle cụ thể trong useBooking để chuyển step
  });
};