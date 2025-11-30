import { Check } from 'lucide-react';
import { STEPS } from '@/hooks/useBooking';

interface BookingProgressProps {
  currentStep: number;
}

export function BookingProgress({ currentStep }: BookingProgressProps) {
  // Tính toán độ dài của thanh màu (Progress Line)
  // Ví dụ: 5 bước. Đang ở bước 3 -> (3-1) / (5-1) * 100 = 50%
  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="bg-bg-primary py-6 sm:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Container chính dùng relative để chứa các đường kẻ tuyệt đối bên dưới */}
        <div className="relative flex items-start justify-between max-w-3xl mx-auto">
          
          {/* 1. Đường kẻ nền màu xám (Chạy suốt từ đầu đến cuối) */}
          {/* top-5 (20px) khớp với giữa tâm vòng tròn mobile (h-10), sm:top-6 khớp với desktop (h-12) */}
          <div className="absolute top-5 sm:top-6 left-0 w-full h-0.5 bg-border -z-10 hidden sm:block" />

          {/* 2. Đường kẻ màu (Active Progress) - Chạy theo % */}
          <div 
            className="absolute top-5 sm:top-6 left-0 h-0.5 bg-primary -z-10 transition-all duration-500 ease-in-out hidden sm:block"
            style={{ width: `${progressPercentage}%` }}
          />

          {STEPS.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isActive = step.number <= currentStep;

            return (
              <div 
                key={step.number} 
                // Quan trọng: Đặt width cố định (w-20 hoặc w-24) để tâm vòng tròn luôn chia đều khoảng cách
                // flex-col và items-center giúp text luôn nằm giữa vòng tròn
                className="flex flex-col items-center relative z-10 w-20 sm:w-24"
              >
                {/* Circle Step */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 bg-surface ${
                    isCurrent
                      ? 'bg-primary text-text-primary border-primary shadow-[0_0_20px_rgba(108,99,255,0.4)] scale-110'
                      : isActive
                      ? 'bg-primary text-text-primary border-primary'
                      : 'text-text-secondary border-border'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <span className="font-medium text-sm sm:text-base">{step.number}</span>
                  )}
                </div>

                {/* Label - Căn giữa, text-center quan trọng để chữ dài không bị lệch sang trái */}
                <span 
                  className={`mt-3 text-[10px] sm:text-sm font-medium text-center leading-tight transition-colors duration-300 ${
                    isCurrent ? 'text-primary' : 'text-text-secondary'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}