'use client'

import { useMutation } from '@tanstack/react-query';
import { createBookingApi } from '@/lib/api/post/booking';
import { CreateBookingRequest } from '@/types/booking';
import { toast } from 'sonner';

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: (data: CreateBookingRequest) => createBookingApi(data),
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Đặt vé thất bại. Vui lòng thử lại.';
      toast.error(message);
    },
    // Lưu ý: onSuccess sẽ được handle cụ thể trong useBooking để chuyển step
  });
};