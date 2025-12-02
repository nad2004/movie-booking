'use client'

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBookingDetail } from '@/lib/api/booking';
import { StepSuccess } from '@/app/(client)/movies/[id]/booking-flow/components/steps/StepSuccess'; // Import component StepSuccess cũ
import { Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function PaymentResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const bookingId = searchParams.get('bookingId');
  const responseCode = searchParams.get('vnp_ResponseCode'); // Mã phản hồi VNPAY (00 là thành công)
  
  // Fetch thông tin vé để hiển thị mã vé
  const { data: booking, isLoading } = useBookingDetail(bookingId || '');

  const isSuccess = responseCode === '00';

  // Nếu VNPAY trả về thất bại
  if (responseCode && !isSuccess) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-red-100 bg-red-50/50">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Thanh toán thất bại</h2>
          <p className="text-text-secondary mb-8">
            Giao dịch của bạn không thành công hoặc đã bị hủy. Vui lòng thử lại.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => router.push('/')}
            >
                Về trang chủ
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Đang tải thông tin vé
  if (isLoading || !booking) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-text-secondary">Đang xác thực giao dịch...</p>
      </div>
    );
  }

  const bookingResponseData = {
    bookingId: booking._id,
    bookingCode: booking.bookingCode || booking._id.slice(-6).toUpperCase(),
    totalAmount: booking.totalAmount,
    
    holdUntil: new Date()
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-surface p-8 rounded-3xl shadow-xl border border-border">
        <StepSuccess 
            bookingData={bookingResponseData} 
            onClose={() => router.push('/')} // Đóng thì về trang chủ
        />
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    // Bắt buộc bọc Suspense khi dùng useSearchParams
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentResult />
    </Suspense>
  );
}