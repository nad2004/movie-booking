'use client'

import { useState } from 'react'
import Filters, { type BookingStatus } from './components/Filters'
import BookingList from './components/BookingList'
import { useBookings } from '@/lib/api/get/booking'
import { DEFAULT_BOOKING_LIST } from '@/constants'

export default function OrderHistoryPage() {
  // 1. State quản lý Status
  const [status, setStatus] = useState<BookingStatus | 'all'>('all')

  // 2. Fetch Data với Params
  // Khi 'status' thay đổi, params thay đổi -> useQuery tự động fetch lại
  const {
    data: bookingData,
    isError,
    isLoading,
  } = useBookings({
    // Nếu chọn 'all' thì không truyền params status (hoặc truyền undefined) để API lấy hết
    status: status === 'all' ? undefined : status,
  })

  // Fallback dữ liệu nếu API chưa có hoặc lỗi (để tránh crash)
  const bookings = bookingData?.bookings || []

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Có lỗi khi tải dữ liệu
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2
            className="text-text-primary mb-2 flex items-center gap-3"
            style={{ fontSize: '32px', fontWeight: 600 }}
          >
            🎫 Lịch sử đặt vé
          </h2>
          <p className="text-text-secondary">Quản lý và theo dõi trạng thái các vé đã đặt</p>
        </div>

        {/* Filters */}
        {/* Truyền state và hàm set state xuống Filters */}
        <Filters
          currentStatus={status}
          onStatusChange={setStatus}
          bookingsCount={bookings.length}
          isLoading={isLoading}
        />

        {/* Booking List */}
        {/* Hiển thị danh sách hoặc Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skeleton Loading đơn giản */}
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-surface/50 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : (
          <BookingList bookings={bookings} />
        )}
      </div>
    </div>
  )
}
