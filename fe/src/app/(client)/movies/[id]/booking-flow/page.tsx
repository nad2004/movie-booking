'use client'

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/hooks/useBooking';
import { BookingHeader } from './components/BookingHeader';
import { BookingProgress } from './components/BookingProgress';
import { BookingSummary } from './components/BookingSummary';
import { StepShowtime } from './components/steps/StepShowtime';
import { StepSeatSelection } from './components/steps/StepSeatSelection';
import { StepCombo } from './components/steps/StepCombo';
import { StepPayment } from './components/steps/StepPayment';
import { StepSuccess } from './components/steps/StepSuccess';
import { useParams, useSearchParams } from 'next/navigation';

export default function BookingPage() {
  const params = useParams();
  const movieId = params.id as string;

  const searchParams = useSearchParams();
  const preSelectedScheduleId = searchParams.get('scheduleId') || undefined;

  const movieTitle = "Đặt vé xem phim"; // Bạn có thể fetch thêm tên phim nếu muốn

  const {
    currentStep,
    selectedSchedule,
    setSelectedSchedule,
    selectedSeats,
    handleSeatClick,
    cartItems,
    updateCartItem,
    // Payment method không cần truyền xuống StepPayment nữa vì đã hardcode VNPAY
    schedules, 
    isLoadingSchedules,
    totalAmount,
    nextStep,
    prevStep,
    
    // New states from updated useBooking
    isProcessing, 
    createdBookingData,
    paymentUrl,
  } = useBooking({ movieId, preSelectedScheduleId });

  // --- Logic Render Step ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepShowtime
            movieTitle={movieTitle}
            schedules={schedules}
            isLoading={isLoadingSchedules}
            selectedSchedule={selectedSchedule}
            onSelect={setSelectedSchedule}
          />
        );
      case 2:
        return (
          <StepSeatSelection
            selectedSeats={selectedSeats}
            schedule={selectedSchedule}
            onSeatClick={handleSeatClick}
          />
        );
      case 3:
        return (
          <StepCombo
            cartItems={cartItems}
            updateCartItem={updateCartItem}
          />
        );
      case 4:
        return (
          <StepPayment
            paymentUrl={paymentUrl}
            bookingCode={createdBookingData?.bookingCode}
            totalAmount={totalAmount}
          />
        );
      case 5:
        return (
          <StepSuccess
            bookingData={createdBookingData}
            onClose={() => window.location.href = '/'} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <BookingHeader onClose={() => window.history.back()} />
      <BookingProgress currentStep={currentStep} />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          <div className="flex-1 min-w-0">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {renderStepContent()}
            </div>

            {currentStep < 5 && (
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  // Chặn back khi đang ở bước 4 (đã tạo đơn rồi không back lại chọn combo được)
                  disabled={currentStep === 1 || currentStep === 4}
                  className="rounded-full px-6 h-12 gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Quay lại
                </Button>
                
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !selectedSchedule) ||
                    (currentStep === 2 && selectedSeats.length === 0) || 
                    isProcessing
                  }
                  className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white h-12 gap-2 shadow-lg shadow-primary/20 flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      {/* Ở bước 4 nút sẽ đổi text để xác nhận hoàn tất */}
                      {currentStep === 4 ? 'Tôi đã thanh toán xong' : 'Tiếp tục'} 
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )} 
                </Button>
              </div>
            )}
          </div>

          {currentStep < 5 && (
            <div className="hidden lg:block animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
              <BookingSummary
                movieTitle={movieTitle}
                selectedSchedule={selectedSchedule}
                selectedSeats={selectedSeats}
                cartItems={cartItems}
                total={totalAmount}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}