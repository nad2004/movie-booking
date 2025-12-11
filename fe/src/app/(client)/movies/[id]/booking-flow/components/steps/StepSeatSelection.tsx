import { BookedSeat } from '@/types/booking';
import { Schedule } from '@/types/schedule';
import { SeatMaps } from '../ClientSeatsMap';
import type { Seat } from '@/types/theater';
import { Users, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StepSeatSelectionProps {
  selectedSeats: BookedSeat[];
  schedule: Schedule | null;
  onSeatClick: (seat: Seat) => void;
  // WebSocket props
  realTimeSeats?: Map<string, Seat>;
  viewerCount?: number;
  isConnected?: boolean;
  isInRoom?: boolean;
  isSeatAvailable?: (seat: Seat) => boolean;
}

export function StepSeatSelection({
  selectedSeats,
  schedule,
  onSeatClick,
  realTimeSeats,
  viewerCount = 0,
  isConnected = false,
  isInRoom = false,
  isSeatAvailable,
}: StepSeatSelectionProps) {
  return (
    <div className="relative">
      {/* Header with connection status */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-text-primary text-xl font-bold">Chọn ghế</h2>
        
        <div className="flex items-center gap-4">
          {/* Viewer count */}
          {isInRoom && (
            <Badge variant="outline" className="gap-2 px-3 py-1">
              <Users className="w-4 h-4" />
              <span>{viewerCount} người đang xem</span>
            </Badge>
          )}
          
          {/* Connection status */}
          <Badge 
            variant={isConnected ? "default" : "destructive"} 
            className="gap-2 px-3 py-1"
          >
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4" />
                <span className="text-xs">Kết nối</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="text-xs">Mất kết nối</span>
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Thông báo nếu mất kết nối */}
      {!isConnected && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          <p className="font-medium">Mất kết nối real-time. Đang kết nối lại...</p>
          <p className="text-xs mt-1">Bạn có thể tiếp tục chọn ghế nhưng trạng thái có thể không cập nhật ngay.</p>
        </div>
      )}

      {/* Màn hình */}
      <div className="mb-10">
        <div className="w-3/4 mx-auto h-2 bg-linear-to-b from-primary/40 to-transparent rounded-[50%] shadow-[0_10px_20px_rgba(108,99,255,0.3)] mb-4"></div>
        <div className="text-center text-xs text-text-secondary uppercase tracking-widest font-semibold">
          Màn hình
        </div>
      </div>

      {/* Seat Map với real-time data */}
      <div className="relative">
        <SeatMaps 
          selectedSeats={selectedSeats} 
          schedule={schedule} 
          onSeatClick={onSeatClick}
          realTimeSeats={realTimeSeats}
          isSeatAvailable={isSeatAvailable}
        />

        {/* Loading Overlay khi đang tham gia phòng */}
        {!isInRoom && isConnected && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
            <div className="flex flex-col items-center gap-4 p-8">
              {/* Spinner chính với Loader2 */}
              <div className="relative">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                
                {/* Vòng tròn ngoài (ant design style) */}
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping"></div>
              </div>

              {/* Text */}
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-text-primary">
                  Đang tham gia phòng chọn ghế...
                </p>
                <p className="text-sm text-text-secondary">
                  Vui lòng đợi trong giây lát
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}