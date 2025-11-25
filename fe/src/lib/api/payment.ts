import { api } from '@/lib/api/axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

// Type Response
export interface PaymentResponse {
  paymentUrl: string;
  orderId?: string;
}

// API Call
export const createPaymentUrlApi = async (bookingId: string): Promise<PaymentResponse> => {
  const res = await api.post(`/bookings/${bookingId}/payment/vnpay`);
  return res.data.data;
};

// Hook
export const useCreatePaymentUrl = () => {
  return useMutation({
    mutationFn: (bookingId: string) => createPaymentUrlApi(bookingId),
    onError: (error: any) => {
      toast.error("Không thể tạo link thanh toán. Vui lòng thử lại.");
    }
  });
};