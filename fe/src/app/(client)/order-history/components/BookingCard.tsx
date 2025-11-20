'use client'

import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Armchair, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types/booking";
import { BookingStatus } from "@/types/booking"; // Import type nếu cần
import Image from "next/image";
interface BookingCardProps {
  booking: Booking;
  onClick: (booking: Booking) => void;
}

export default function BookingCard({ booking, onClick }: BookingCardProps) {
  
  // Hàm map màu sắc dựa trên Status tiếng Việt
  const getStatusColor = (status: string) => {
    const styles: Record<string, string> = {
      "Hoàn tất": "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100", // Xanh dương
      "Đã sử dụng": "bg-green-100 text-green-700 border-green-200 hover:bg-green-100", // Xanh lá
      "Chờ thanh toán": "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100", // Vàng
      "Đã hủy": "bg-red-100 text-red-700 border-red-200 hover:bg-red-100", // Đỏ
      "Hết hạn": "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100", // Xám
    };

    // Fallback nếu status không khớp
    return styles[status] || "bg-secondary text-secondary-foreground";
  };

  return (
    <Card
      className="bg-surface border-border overflow-hidden hover:shadow-xl transition-all group cursor-pointer rounded-xl flex flex-col"
      onClick={() => onClick(booking)}
    >
      <div className="flex gap-4 p-4 h-full">
        {/* Poster */}
        <div className="flex-shrink-0">
             <Image 
                src={booking.schedule.movie.posterUrl || "/placeholder-movie.png"} 
                alt={booking.movieTitle} 
                className="w-24 h-36 object-cover rounded-lg shadow-sm" 
             />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2 gap-2">
              <div>
                <h4 className="text-text-primary font-semibold line-clamp-1">
                    {booking.movieTitle}
                </h4>
              </div>

              {/* Badge với màu dynamic */}
              <Badge className={`whitespace-nowrap ${getStatusColor(booking.status)}`}>
                {booking.status}
              </Badge>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm text-text-secondary mt-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{new Date(booking.showDate).toLocaleDateString('vi-VN')}• {booking.schedule.startTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="line-clamp-1">{booking.theaterName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Armchair className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="line-clamp-1">Ghế: {booking.seats.join(", ")}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <p className="text-primary font-semibold text-lg">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount)}
            </p>
            <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary px-2">
                Chi tiết <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}