// src/features/booking/components/steps/StepShowtime.tsx
import { Clock, MapPin, Calendar, Loader2 } from 'lucide-react'
import { Schedule } from '@/types/schedule'

interface StepShowtimeProps {
  movieTitle: string
  schedules: Schedule[] // Nhận mảng dữ liệu thật
  isLoading: boolean
  selectedSchedule: Schedule | null
  onSelect: (schedule: Schedule) => void
}

export function StepShowtime({
  movieTitle,
  schedules,
  isLoading,
  selectedSchedule,
  onSelect,
}: StepShowtimeProps) {
  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + ' đ'

  return (
    <div>
      <h2 className="mb-6 text-text-primary text-xl font-bold">Chọn suất chiếu – {movieTitle}</h2>

      {/* Case 1: Đang tải */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-text-secondary">Đang tải lịch chiếu...</span>
        </div>
      )}

      {/* Case 2: Không có lịch chiếu */}
      {!isLoading && schedules.length === 0 && (
        <div className="text-center py-10 bg-surface border border-border rounded-xl">
          <p className="text-text-secondary">Hiện chưa có lịch chiếu cho phim này.</p>
        </div>
      )}

      {/* Case 3: Hiển thị danh sách */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map(schedule => (
          <div
            key={schedule._id}
            onClick={() => onSelect(schedule)}
            className={`bg-surface rounded-2xl p-5 cursor-pointer transition-all duration-300 border-2 ${
              selectedSchedule?._id === schedule._id
                ? 'border-primary shadow-md bg-primary/5'
                : 'border-border hover:border-primary/30 hover:bg-bg-secondary'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-text-primary font-semibold text-lg">
                  {/* Giả sử startTime format là "19:00" */}
                  {schedule.startTime}
                </span>
              </div>
              <div className="px-2 py-1 rounded bg-bg-secondary text-xs font-medium text-text-secondary border border-border">
                {schedule.roomType} {/* 2D, IMAX... */}
              </div>
            </div>

            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {/* Access vào object theater lồng nhau */}
                <span>
                  {schedule.theater?.name} • {schedule.roomName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(schedule.showDate).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
              <span className="text-text-secondary text-sm">Giá vé từ</span>
              {/* Access vào ticketPrices */}
              <span className="text-primary font-bold text-lg">
                {formatPrice(schedule.ticketPrices?.standard || 0)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
