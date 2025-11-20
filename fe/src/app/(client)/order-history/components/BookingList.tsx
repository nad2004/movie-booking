'use client'

import { useState, useMemo, useCallback } from 'react'
import BookingCard from './BookingCard'
import BookingDetailModal from './BookingDetailModal'
import Filters from './Filters' // Import component Filters mới
import { Card } from '@/components/ui/card'
import { Ticket } from 'lucide-react'
import type { Booking } from '@/types/booking' 

interface BookingListProps {
  bookings: Booking[]
}

// Định nghĩa kiểu dữ liệu cho Filters
interface FiltersState {
  status: 'all' | 'confirmed' | 'pending' | 'cancelled' | 'watched' | 'upcoming';
  time: 'all' | 'week' | 'month' | 'year';
  search: string;
}

export default function BookingList({ bookings }: BookingListProps) {
  // Khởi tạo state filters (Đồng bộ với giá trị mặc định của Filters.tsx)
  const [filters, setFilters] = useState<FiltersState>({
    status: 'all',
    time: 'all',
    search: '',
  })

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // Hàm cập nhật filters từ component con (Filters.tsx)
  const handleFilterChange = useCallback((newFilters: FiltersState) => {
    setFilters(newFilters)
  }, [])

  // Logic Lọc (Sử dụng useMemo để tối ưu)
  const filteredBookings = useMemo(() => {
    const now = new Date()
    const searchLower = filters.search.toLowerCase().trim()

    // Hàm kiểm tra xem booking có nằm trong khoảng thời gian (week/month/year) không
    const isWithinTimeRange = (date: Date, range: 'week' | 'month' | 'year') => {
        const targetTime = date.getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        let diffDays;
        
        switch (range) {
            case 'week':
                diffDays = 7;
                break;
            case 'month':
                // Approximation: 30 days
                diffDays = 30; 
                break;
            case 'year':
                diffDays = 365;
                break;
            default:
                return true;
        }

        // Tính khoảng thời gian từ bây giờ
        return (targetTime >= now.getTime() - (diffDays * oneDay)) && (targetTime <= now.getTime() + (diffDays * oneDay));
    }


    return bookings.filter(b => {
      // ⚠️ LƯU Ý: Để lọc "Đã xem" (watched) và "Sắp chiếu" (upcoming) chính xác, 
      // ta cần thời gian bắt đầu chiếu (start_time) của lịch chiếu, 
      // nhưng vì hiện tại ta chỉ có `booking_date` (thời điểm đặt), ta sẽ dùng booking_date 
      // làm xấp xỉ cho mục đích mock, hoặc giả định thời điểm đặt gần với thời điểm xem.
      
      const bookingTime = b.booking_date.getTime();
      const isPast = bookingTime < now.getTime(); // Giả định là đã xem nếu thời điểm đặt đã qua
      const isFuture = bookingTime >= now.getTime(); // Giả định là sắp chiếu nếu thời điểm đặt sắp tới

      // 1. Lọc theo Trạng thái (status)
      let matchStatus = true;
      if (filters.status === 'watched') {
          // Chỉ lấy các vé đã confirmed VÀ đã qua thời điểm đặt (quá khứ)
          matchStatus = b.status === 'confirmed' && isPast;
      } else if (filters.status === 'upcoming') {
          // Chỉ lấy các vé đã confirmed VÀ sắp tới thời điểm đặt (tương lai)
          matchStatus = b.status === 'confirmed' && isFuture;
      } else if (filters.status === 'cancelled') {
          matchStatus = b.status === 'cancelled';
      } else if (filters.status !== 'all') {
          // Lọc theo 'confirmed' hoặc 'pending' (nếu có thêm trigger)
          matchStatus = b.status === filters.status;
      }
      // 'all' đã được xử lý bằng giá trị mặc định true

      // 2. Lọc theo Thời gian (time: week, month, year)
      const matchTime = filters.time === 'all' || isWithinTimeRange(b.booking_date, filters.time);

      // 3. Lọc theo Tìm kiếm (search)
      const matchSearch =
        searchLower === '' ||
        "b.movieTitle.toLowerCase().includes(searchLower)" ||
        b.booking_id.toLowerCase().includes(searchLower)

      // 4. Kết hợp
      return matchStatus && matchTime && matchSearch
    })
  }, [bookings, filters])

  return (
    <div>
      {/* 🧩 Component Filters */}
      <Filters 
        bookingsCount={filteredBookings.length}
        onFilterChange={handleFilterChange}
      />
      
      {/* --- List --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBookings.map(b => (
          <BookingCard 
            key={b.booking_id} 
            booking={b} 
            onClick={() => setSelectedBooking(b)} 
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <Card className="bg-surface border-border p-12 text-center rounded-xl mt-6">
          <Ticket className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-text-primary mb-2 font-semibold text-xl">Không tìm thấy vé nào</h3>
          <p className="text-text-secondary">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </Card>
      )}

      {/* Modal chi tiết */}
      <BookingDetailModal 
        booking={selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
      />
    </div>
  )
}