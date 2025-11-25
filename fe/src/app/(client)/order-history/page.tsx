'use client'

import { useState } from 'react'
import Filters, { type BookingStatus } from './components/Filters'
import BookingList from './components/BookingList'
// Import hook mới vừa tạo
import { useMyBookings } from '@/lib/api/booking'

export default function OrderHistoryPage() {
  // 1. State quản lý Status
  // Mặc định là 'all' -> API sẽ không gửi param status -> lấy tất cả
  const [status, setStatus] = useState<BookingStatus | 'all'>('all')

  // 2. Fetch Data từ API mới
  const {
    data: bookingData,
    isError,
    isLoading,
  } = useMyBookings({
    page: 1,
    limit: 100, // Lấy tạm 100 item mới nhất, sau này có thể thêm phân trang
    status: status === 'all' ? undefined : status,
  })

  // Fallback dữ liệu an toàn
  const bookings = bookingData?.bookings || []

  // Hiển thị lỗi
  if (isError) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-red-500 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
          Có lỗi khi tải lịch sử đặt vé. Vui lòng thử lại sau.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2
            className="text-text-primary mb-2 flex items-center gap-3"
            style={{ fontSize: '32px', fontWeight: 600 }}
          >
            🎫 Lịch sử đặt vé
          </h2>
          <p className="text-text-secondary">
            Quản lý và theo dõi trạng thái các vé đã đặt của bạn
          </p>
        </div>

        {/* Filters */}
        {/* Truyền số lượng vé ĐÃ LỌC (từ API) xuống để hiển thị */}
        <Filters
          currentStatus={status}
          onStatusChange={setStatus}
          bookingsCount={bookings.length}
          isLoading={isLoading}
        />

        {/* Booking List */}
        {isLoading ? (
          // Skeleton Loading
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-48 bg-surface/50 animate-pulse rounded-xl border border-border"
              />
            ))}
          </div>
        ) : (
          // Danh sách vé
          <BookingList bookings={bookings} />
        )}
      </div>
    </div>
  )
}
