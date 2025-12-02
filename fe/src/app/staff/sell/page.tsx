'use client'

import { useState, useEffect } from 'react'
import { useMovies } from '@/lib/api/movies'
import { useBooking } from '@/hooks/useBooking'
import { useStaffCreateBooking } from '@/hooks/useCreateBooking'
import { toast } from 'sonner'
import { MovieSelector } from './components/MovieSelector'
import { SeatSelector } from './components/SeatSelector'
import { BookingSummary } from './components/BookingSummary'

export default function TicketSales() {
  // State UI
  const [selectedMovieId, setSelectedMovieId] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('en-CA'))
  const [paymentMethod, setPaymentMethod] = useState<string>('Tiền mặt')

  // Fetch Movies
  const { data: movieData } = useMovies({ status: 'Đang chiếu', limit: 100 })
  const movies = movieData?.movies || []

  // Sử dụng Hook useBooking để quản lý logic ghế và lịch chiếu
  const {
    schedules,
    isLoadingSchedules,
    selectedSchedule,
    setSelectedSchedule,
    selectedSeats,
    handleSeatClick,
    totalAmount,
  } = useBooking({ movieId: selectedMovieId }) // Hook này đã fetch schedules theo movieId

  // Lọc schedules theo ngày (Client-side filter vì hook useBooking có thể fetch hết)
  const filteredSchedules = schedules.filter(s => s.showDate.startsWith(selectedDate))

  // Hook Tạo Booking
  const { mutate: staffCreateBooking, isPending } = useStaffCreateBooking()

  // Reset khi đổi phim
  useEffect(() => {
    setSelectedSchedule(null)
  }, [selectedMovieId, selectedDate])

  const handlePayment = () => {
    if (!selectedSchedule) return toast.error('Chưa chọn suất chiếu')
    if (selectedSeats.length === 0) return toast.error('Chưa chọn ghế')

    const payload = {
      scheduleId: selectedSchedule._id,
      seats: selectedSeats.map(s => ({
        seatNumber: s.seatNumber,
        seatType: s.seatType,
        price: s.price,
      })),
      customerInfo: {
        fullName: '',
        email: '',
      },
      paymentMethod: '',
      cashReceived: 0,
    }

    staffCreateBooking(payload, {
      onSuccess: () => {
        toast.success('Tạo vé thành công!')
        // Reset sau khi bán xong
        setSelectedSchedule(null)
        // selectedSeats sẽ tự clear do hook useBooking quản lý hoặc cần reset tay tùy implementation
        window.location.reload() // Reload tạm để refresh ghế
      },
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full pb-4">
      {/* Cột Trái & Giữa */}
      <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
        <MovieSelector
          movies={movies}
          selectedMovieId={selectedMovieId}
          onSelectMovie={setSelectedMovieId}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <SeatSelector
          schedules={filteredSchedules}
          isLoadingSchedules={isLoadingSchedules}
          selectedSchedule={selectedSchedule}
          onSelectSchedule={setSelectedSchedule}
          selectedSeats={selectedSeats}
          onSeatClick={handleSeatClick}
        />
      </div>

      {/* Cột Phải */}
      <div className="lg:col-span-1 min-h-0">
        <BookingSummary
          selectedSchedule={selectedSchedule}
          selectedSeats={selectedSeats}
          totalAmount={totalAmount}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onPayment={handlePayment}
          isProcessing={isPending}
        />
      </div>
    </div>
  )
}
