'use client'

import { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
} from 'lucide-react';
import { useUserAssignments, useAssignmentMutations } from '@/lib/api/shift-assignments';
import { ShiftWithEmployees, AssignedEmployee } from '@/types/shift';
import { CheckInModal } from './CheckInModal';
import { CheckOutModal } from './CheckOutModal';
import { ActiveShiftCard } from './ActiveShiftCard';
import { ShiftCard } from './ShiftCard';

const theaterLocation = { lat: 10.7769, lng: 106.7009 };
const maxDistanceMeters = 100;

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const getCurrentTime = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const canCheckIn = (startDateTime: string): { allowed: boolean; status: 'early' | 'on-time' | 'late' | 'too-late' } => {
  const now = new Date();
  const shiftStart = new Date(startDateTime);
  const diffMinutes = Math.floor((now.getTime() - shiftStart.getTime()) / 60000);

  if (diffMinutes < -10) return { allowed: false, status: 'early' };
  if (diffMinutes <= 5) return { allowed: true, status: 'on-time' };
  if (diffMinutes <= 15) return { allowed: true, status: 'late' };
  return { allowed: false, status: 'too-late' };
};

const calculateWorkDuration = (checkIn: string, checkOut: string): number => {
  const inTime = new Date(checkIn);
  const outTime = new Date(checkOut);
  return Math.max(0, Math.floor((outTime.getTime() - inTime.getTime()) / 60000));
};

export function CheckInClient() {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignedEmployee | null>(null);

  // Fetch user assignments
  const { data: assignments, isLoading } = useUserAssignments('current-user-id', {
    from: new Date().toISOString().split('T')[0],
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const { checkIn, checkOut } = useAssignmentMutations();

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
        },
        () => {
          setLocationError('Không thể lấy vị trí. Vui lòng bật GPS.');
          setCurrentLocation({ lat: 10.7769, lng: 106.7009 });
        }
      );
    } else {
      setLocationError('Trình duyệt không hỗ trợ GPS.');
      setCurrentLocation({ lat: 10.7769, lng: 106.7009 });
    }
  }, []);

  const handleCheckInClick = (assignment: AssignedEmployee) => {
    setSelectedAssignment(assignment);
    setShowCheckInModal(true);
  };

  const handleCheckIn = async () => {
    if (!selectedAssignment || !currentLocation) return;

    // Validate location
    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      theaterLocation.lat,
      theaterLocation.lng
    );

    if (distance > maxDistanceMeters) {
      alert(`Bạn đang ở quá xa rạp (${Math.round(distance)}m). Vui lòng đến rạp để check-in.`);
      return;
    }

    await checkIn.mutateAsync();
    setShowCheckInModal(false);
    setSelectedAssignment(null);
  };

  const handleCheckOutClick = (assignment: AssignedEmployee) => {
    setSelectedAssignment(assignment);
    setShowCheckOutModal(true);
  };

  const handleCheckOut = async (breakTime?: number) => {
    if (!selectedAssignment) return;
    
    await checkOut.mutateAsync();
    setShowCheckOutModal(false);
    setSelectedAssignment(null);
  };

  const activeAssignment = assignments?.find(a => a.checkInTime && !a.checkOutTime);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Check-in Ca Làm Việc</h1>
        <p className="text-muted-foreground">Điểm danh và quản lý thời gian làm việc của bạn</p>
      </div>

      {/* Current Time & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-primary to-primary-hover p-6 rounded-xl text-primary-foreground">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6" />
            <h3 className="font-semibold">Thời gian hiện tại</h3>
          </div>
          <p className="text-3xl font-bold">{currentTime}</p>
          <p className="text-sm opacity-80 mt-1">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })}
          </p>
        </div>

        <div className={`p-6 rounded-xl ${currentLocation ? 'bg-gradient-to-br from-chart-3 to-chart-3/80' : 'bg-gradient-to-br from-muted to-muted/80'}`}>
          <div className="flex items-center gap-3 mb-2">
            <MapPin className={`w-6 h-6 ${currentLocation ? 'text-white' : 'text-muted-foreground'}`} />
            <h3 className={`font-semibold ${currentLocation ? 'text-white' : 'text-muted-foreground'}`}>Vị trí GPS</h3>
          </div>
          {currentLocation ? (
            <>
              <p className="text-3xl font-bold text-white">Đã bật</p>
              <p className="text-sm opacity-80 mt-1 text-white">
                {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </p>
            </>
          ) : (
            <>
              <p className="text-xl text-muted-foreground">Không khả dụng</p>
              <p className="text-sm opacity-80 mt-1 text-muted-foreground">{locationError}</p>
            </>
          )}
        </div>
      </div>

      {/* Active Shift */}
      {activeAssignment && (
        <ActiveShiftCard 
          assignment={activeAssignment}
          currentTime={currentTime}
          onCheckOut={handleCheckOutClick}
        />
      )}

      {/* Shift List */}
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Danh Sách Ca Làm Việc</h2>
        <div className="space-y-4">
          {assignments?.map((assignment) => (
            <ShiftCard
              key={assignment.assignmentId}
              assignment={assignment}
              currentLocation={currentLocation}
              onCheckIn={handleCheckInClick}
              onCheckOut={handleCheckOutClick}
            />
          ))}
        </div>
      </section>

      {/* Modals */}
      {showCheckInModal && selectedAssignment && (
        <CheckInModal
          assignment={selectedAssignment}
          currentLocation={currentLocation}
          currentTime={currentTime}
          isLoading={checkIn.isPending}
          onConfirm={handleCheckIn}
          onCancel={() => {
            setShowCheckInModal(false);
            setSelectedAssignment(null);
          }}
        />
      )}

      {showCheckOutModal && selectedAssignment && (
        <CheckOutModal
          assignment={selectedAssignment}
          currentTime={currentTime}
          isLoading={checkOut.isPending}
          onConfirm={handleCheckOut}
          onCancel={() => {
            setShowCheckOutModal(false);
            setSelectedAssignment(null);
          }}
        />
      )}
    </div>
  );
}