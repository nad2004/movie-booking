import type { Schedule, SeatAvailability } from '@/types/schedule'
import type { BookedSeat } from '@/types/booking'
import type { Seat } from '@/types/theater'
import { useMemo, useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface SeatMapsProps {
  selectedSeats: BookedSeat[]
  schedule: Schedule | null
  onSeatClick: (seat: Seat) => void
  // WebSocket props
  realTimeSeats?: Map<string, Seat>
  isSeatAvailable?: (seat: Seat) => boolean
}
const time = Date.now()
export function SeatMaps({
  selectedSeats,
  schedule,
  onSeatClick,
  realTimeSeats,
  isSeatAvailable,
}: SeatMapsProps) {
  const [currentTime, setCurrentTime] = useState(time)

  console.log(realTimeSeats)
  // 1. Xử lý dữ liệu: Gom nhóm ghế theo Hàng (Row)
  const rows = useMemo(() => {
    if (!schedule?.seatAvailability) return []

    const groups: Record<string, SeatAvailability[]> = {}

    schedule.seatAvailability.forEach(seat => {
      const rowLabel = seat.seatNumber.charAt(0) // Lấy ký tự đầu làm tên hàng (A, B, C...)
      if (!groups[rowLabel]) {
        groups[rowLabel] = []
      }
      groups[rowLabel].push(seat)
    })

    // Sắp xếp các hàng theo thứ tự A -> Z
    return Object.keys(groups)
      .sort()
      .map(rowLabel => ({
        rowLabel,
        seats: groups[rowLabel].sort((a, b) => {
          // Sắp xếp ghế trong hàng theo số (A1 -> A2 -> A10)
          const numA = parseInt(a.seatNumber.slice(1))
          const numB = parseInt(b.seatNumber.slice(1))
          return numA - numB
        }),
      }))
  }, [schedule, realTimeSeats])
  //   console.log(rows)
  // 2. Hàm lấy giá vé (chỉ để hiển thị tooltip, logic tính tiền chính nằm ở useBooking)
  const getSeatPrice = (seatType: string) => {
    if (!schedule?.ticketPrices) return 0
    switch (seatType) {
      case 'VIP':
        return schedule.ticketPrices.vip || schedule.ticketPrices.standard + 20000
      case 'Ghế đôi':
        return schedule.ticketPrices.couple || schedule.ticketPrices.standard * 2
      case 'Thường':
      default:
        return schedule.ticketPrices.standard
    }
  }

  // 3. Xác định trạng thái hiển thị của ghế (với real-time data)
  const getSeatStatus = (seat: SeatAvailability) => {
    // Kiểm tra real-time data từ WebSocket
    const realTimeSeat = realTimeSeats?.get(seat.seatNumber)

    // Ghế đã được book (từ DB hoặc real-time)
    if (seat.isBooked || realTimeSeat?.isBooked) {
      return 'booked'
    }

    // Ghế đang được user hiện tại chọn
    if (selectedSeats.some(s => s.seatNumber === seat.seatNumber)) {
      return 'selected'
    }

    // Ghế đang được giữ bởi người khác (từ real-time data)
    if (realTimeSeat?.holdUntil) {
      return 'held'
    }

    // Trạng thái bình thường theo loại ghế
    return seat.seatType === 'VIP' ? 'vip' : seat.seatType === 'Ghế đôi' ? 'couple' : 'standard'
  }

  // 4. Kiểm tra ghế có thể click không
  const canClickSeat = (seat: SeatAvailability) => {
    const status = getSeatStatus(seat)

    // Không click được nếu đã booked hoặc đang được giữ
    if (status === 'booked') {
      return false
    }

    // Sử dụng function từ parent nếu có
    if (isSeatAvailable) {
      return isSeatAvailable(seat as unknown as Seat)
    }

    return true
  }

  // 5. Tính thời gian còn lại khi ghế đang được giữ
  //   const getHoldTimeRemaining = (seat: SeatAvailability): number | null => {
  //     const realTimeSeat = realTimeSeats?.get(seat.seatNumber)

  //     if (realTimeSeat?.holdUntil) {
  //       const holdUntilTime = new Date(realTimeSeat.holdUntil).getTime()
  //       const remaining = Math.max(0, Math.floor((holdUntilTime - currentTime) / 1000))

  //       return remaining > 0 ? remaining : null
  //     }

  //     return null
  //   }

  return (
    <>
      <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm overflow-x-auto">
        <div className="flex flex-col items-center min-w-max gap-3">
          {rows.map(({ rowLabel, seats }) => (
            <div key={rowLabel} className="flex items-center gap-2 sm:gap-4">
              {/* Tên hàng */}
              <span className="w-6 text-text-secondary text-center font-bold text-sm">
                {rowLabel}
              </span>

              {/* Danh sách ghế */}
              <div className="flex items-center gap-2">
                {seats.map(seat => {
                  const status = getSeatStatus(seat)
                  const price = getSeatPrice(seat.seatType)
                  const isCouple = seat.seatType === 'Ghế đôi'
                  const canClick = canClickSeat(seat)
                  //   const holdTimeRemaining = getHoldTimeRemaining(seat)

                  return (
                    <button
                      key={seat.seatNumber}
                      disabled={!canClick}
                      onClick={() => canClick && onSeatClick(seat as unknown as Seat)}
                      className={`
                        relative group transition-all duration-200 flex items-center justify-center border
                        ${isCouple ? 'w-20 sm:w-24 h-8 sm:h-10 rounded-xl' : 'w-8 h-8 sm:w-10 sm:h-10 rounded-lg'}
                        
                        ${
                          status === 'selected'
                            ? 'bg-primary text-white border-primary shadow-lg scale-105 z-10'
                            : status === 'booked'
                              ? 'bg-muted text-muted-foreground border-transparent cursor-not-allowed opacity-60'
                              : status === 'held'
                                ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50 opacity-80 animate-pulse'
                                : status === 'vip'
                                  ? 'bg-orange-500/10 text-orange-600 border-orange-500/40 hover:bg-orange-500/20 hover:scale-105'
                                  : status === 'couple'
                                    ? 'bg-pink-500/10 text-pink-600 border-pink-500/40 hover:bg-pink-500/20 hover:scale-105'
                                    : 'bg-bg-secondary text-text-primary border-border hover:border-primary hover:bg-primary/5 hover:scale-105'
                        }
                      `}
                    >
                      <span className="text-[10px] sm:text-xs font-medium">
                        {seat.seatNumber.slice(1)}
                      </span>

                      {/* Icon đồng hồ khi ghế đang được giữ */}
                      {/* {status === 'held' && holdTimeRemaining !== null && (
                        <Clock className="absolute -top-1 -right-1 w-3 h-3 text-yellow-600" />
                      )} */}

                      {/* Tooltip */}
                      {canClick && status !== 'booked' && status !== 'held' && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1.5 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-xl">
                          <div className="font-bold">{seat.seatType}</div>
                          <div>{price.toLocaleString()}đ</div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      )}

                      {/* Tooltip cho ghế đang được giữ */}
                      {/* {status === 'held' && holdTimeRemaining !== null && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-yellow-600 text-white text-[10px] py-1.5 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-xl">
                          <div className="font-bold">Đang được giữ</div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{holdTimeRemaining}s</span>
                          </div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-600 rotate-45"></div>
                        </div>
                      )} */}

                      {/* Tooltip cho ghế đã đặt */}
                      {status === 'booked' && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-[10px] py-1.5 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-xl">
                          <div className="font-bold">Đã đặt</div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-600 rotate-45"></div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-10 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-bg-secondary border border-border"></div>
            <span className="text-sm text-text-secondary">Thường</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-orange-500/10 border border-orange-500/30"></div>
            <span className="text-sm text-text-secondary">VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-5 rounded bg-pink-500/10 border border-pink-500/30"></div>
            <span className="text-sm text-text-secondary">Ghế đôi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary border border-primary"></div>
            <span className="text-sm text-text-secondary">Đang chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-yellow-500/20 border border-yellow-500/50 animate-pulse"></div>
            <span className="text-sm text-text-secondary">Đang giữ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-muted opacity-60"></div>
            <span className="text-sm text-text-secondary">Đã đặt</span>
          </div>
        </div>
      </div>
    </>
  )
}
