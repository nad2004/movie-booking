// components/order-history/OrderHistoryPage.tsx
import Filters from '@/components/page/order-history/Filters'
import BookingList from '@/components/page/order-history/BookingList'
import { mockBookings } from '@/lib/mock-booking'

export default function OrderHistoryPage() {
  const movieBooking = mockBookings.slice(0, 6)
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
          <p className="text-text-secondary">Quản lý và theo dõi tất cả các vé đã đặt của bạn</p>
        </div>

        {/* Filters (Client) */}
        <Filters bookingsCount={movieBooking.length} />

        {/* Booking List (Client) */}
        <BookingList bookings={movieBooking} />
      </div>
    </div>
  )
}
