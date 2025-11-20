'use client'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Ticket, QrCode } from 'lucide-react'
import { Booking } from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
  onClose: (booking: Booking) => void;
}
export default function BookingDetailModal({ booking, onClose }: BookingCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'watched':
        return (
          <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
            Đã xem
          </Badge>
        )
      case 'upcoming':
        return <Badge className="bg-accent/20 text-accent border-accent/30">Sắp chiếu</Badge>
      case 'cancelled':
        return (
          <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30">
            Đã huỷ
          </Badge>
        )
      default:
        return null
    }
  }
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }
  return (
    <Dialog open={!!booking} onOpenChange={onClose}>
      <DialogContent className="rounded-xl max-w-2xl">
        {booking && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Chi tiết vé</DialogTitle>
            </DialogHeader>
            {booking && (
              <>
                {' '}
                <DialogHeader>
                  {' '}
                  <DialogTitle
                    className="text-text-primary flex items-center gap-2"
                    style={{ fontSize: '24px', fontWeight: 600 }}
                  >
                    {' '}
                    <Ticket className="w-6 h-6 text-primary" /> Chi tiết vé{' '}
                  </DialogTitle>{' '}
                </DialogHeader>{' '}
                <div className="space-y-6 mt-4">
                  {' '}
                  {/* Movie Info */}{' '}
                  <div className="flex gap-4">
                    {' '}
                    <img
                      src={booking.poster}
                      alt={booking.movieTitle}
                      className="w-32 h-48 object-cover rounded-lg shadow-md"
                    />{' '}
                    <div className="flex-1">
                      {' '}
                      <h3
                        className="text-text-primary mb-1"
                        style={{ fontWeight: 600, fontSize: '20px' }}
                      >
                        {' '}
                        {booking.movieTitle}{' '}
                      </h3>{' '}
                      <p className="text-text-secondary mb-3">{booking.movieTitleEn}</p>{' '}
                      {getStatusBadge(booking.status)}{' '}
                    </div>{' '}
                    {/* QR Code */}{' '}
                    <div className="flex-shrink-0">
                      {' '}
                      <div className="w-24 h-24 bg-bg-secondary rounded-lg flex items-center justify-center">
                        {' '}
                        <QrCode className="w-16 h-16 text-text-primary" />{' '}
                      </div>{' '}
                      <p className="text-xs text-text-secondary text-center mt-2">
                        Quét mã QR
                      </p>{' '}
                    </div>{' '}
                  </div>{' '}
                  {/* Details Grid */}{' '}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-bg-secondary rounded-lg">
                    {' '}
                    <div>
                      {' '}
                      <p className="text-text-secondary text-sm mb-1">🕒 Suất chiếu</p>{' '}
                      <p className="text-text-primary" style={{ fontWeight: 600 }}>
                        {' '}
                        {booking.time} - {booking.date}{' '}
                      </p>{' '}
                    </div>{' '}
                    <div>
                      {' '}
                      <p className="text-text-secondary text-sm mb-1">📍 Rạp</p>{' '}
                      <p className="text-text-primary" style={{ fontWeight: 600 }}>
                        {' '}
                        {booking.cinema}{' '}
                      </p>{' '}
                    </div>{' '}
                    <div>
                      {' '}
                      <p className="text-text-secondary text-sm mb-1">🎬 Phòng chiếu</p>{' '}
                      <p className="text-text-primary" style={{ fontWeight: 600 }}>
                        {' '}
                        {booking.room}{' '}
                      </p>{' '}
                    </div>{' '}
                    <div>
                      {' '}
                      <p className="text-text-secondary text-sm mb-1">💺 Ghế ngồi</p>{' '}
                      <p className="text-text-primary" style={{ fontWeight: 600 }}>
                        {' '}
                        {booking.seats.join(', ')}{' '}
                      </p>{' '}
                    </div>{' '}
                    <div>
                      {' '}
                      <p className="text-text-secondary text-sm mb-1">🎞️ Định dạng</p>{' '}
                      <p className="text-text-primary" style={{ fontWeight: 600 }}>
                        {' '}
                        {booking.format}{' '}
                      </p>{' '}
                    </div>{' '}
                    <div>
                      {' '}
                      <p className="text-text-secondary text-sm mb-1">💳 Thanh toán</p>{' '}
                      <p className="text-text-primary" style={{ fontWeight: 600 }}>
                        {' '}
                        {booking.paymentMethod}{' '}
                      </p>{' '}
                    </div>{' '}
                    <div>
                      {' '}
                      <p className="text-text-secondary text-sm mb-1">🔖 Mã vé</p>{' '}
                      <p className="text-text-primary" style={{ fontWeight: 600 }}>
                        {' '}
                        {booking.id}{' '}
                      </p>{' '}
                    </div>{' '}
                    <div>
                      {' '}
                      <p className="text-text-secondary text-sm mb-1">💰 Tổng tiền</p>{' '}
                      <p className="text-primary" style={{ fontWeight: 700, fontSize: '18px' }}>
                        {' '}
                        {formatPrice(booking.price)}{' '}
                      </p>{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
