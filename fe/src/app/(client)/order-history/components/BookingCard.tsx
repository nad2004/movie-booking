import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Armchair, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
  onClick: (booking: Booking) => void;
}
export default function BookingCard({ booking, onClick }: BookingCardProps) {
  return (
    <Card
      className="bg-surface border-border overflow-hidden hover:shadow-xl transition-all group cursor-pointer rounded-xl"
      onClick={onClick}
    >
      <div className="flex gap-4 p-4">
        {/* Poster */}
        <img src={booking.poster} className="w-24 h-36 object-cover rounded-lg" />

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-text-primary font-semibold">{booking.title}</h4>
              <p className="text-text-secondary text-sm">{booking.movieTitleEn}</p>
            </div>

            <Badge>{booking.status}</Badge>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{booking.date} - {booking.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{booking.cinema}</span>
            </div>
            <div className="flex items-center gap-2">
              <Armchair className="w-4 h-4 text-primary" />
              <span>Ghế: {booking.seats.join(", ")}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <p className="text-primary font-semibold text-lg">{booking.price.toLocaleString()}đ</p>
            <Button size="sm">Xem chi tiết <ChevronRight /></Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
