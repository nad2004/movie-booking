import { BookedSeat } from '@/types/booking'
import { Schedule } from '@/types/schedule'
import { SeatMaps } from '@/app/components/shared/seatsmap'
import type { Seat } from '@/types/theater'

interface StepSeatSelectionProps {
  selectedSeats: BookedSeat[]
  schedule: Schedule | null
  onSeatClick: (seat: Seat) => void
}

export function StepSeatSelection({
  selectedSeats,
  schedule,
  onSeatClick,
}: StepSeatSelectionProps) {
  return (
    <div>
      <h2 className="mb-6 text-text-primary text-xl font-bold">Chọn ghế</h2>

      {/* Màn hình */}
      <div className="mb-10">
        <div className="w-3/4 mx-auto h-2 bg-linear-to-b from-primary/40 to-transparent rounded-[50%] shadow-[0_10px_20px_rgba(108,99,255,0.3)] mb-4"></div>
        <div className="text-center text-xs text-text-secondary uppercase tracking-widest font-semibold">
          Màn hình
        </div>
      </div>

      <SeatMaps selectedSeats={selectedSeats} schedule={schedule} onSeatClick={onSeatClick} />
    </div>
  )
}
