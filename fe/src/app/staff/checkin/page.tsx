'use client'
import { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Timer,
  LogIn,
  LogOut,
  Smartphone,
  Navigation,
  TrendingUp,
  Coffee,
} from 'lucide-react';

// Types
interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'not-started' | 'ongoing' | 'completed';
  theater: string;
  position: string;
  checkInTime?: string;
  checkOutTime?: string;
  checkInStatus?: 'on-time' | 'late';
  workDuration?: number;
  overtime?: number;
  location?: { lat: number; lng: number };
  deviceInfo?: string;
}

interface AttendanceRecord {
  attendanceId: string;
  employeeId: string;
  shiftId: string;
  checkInTime: string;
  checkInStatus: 'on-time' | 'late';
  location: { lat: number; lng: number };
  deviceInfo: string;
  checkOutTime?: string;
  workDuration?: number;
  overtime?: number;
}

// Mock data
const mockShifts: Shift[] = [
  {
    id: 'shift-1',
    date: '2025-11-26',
    startTime: '08:00',
    endTime: '16:00',
    status: 'ongoing',
    theater: 'Rạp Trung tâm',
    position: 'Quầy bán vé',
    checkInTime: '07:58',
    checkInStatus: 'on-time',
  },
  {
    id: 'shift-2',
    date: '2025-11-26',
    startTime: '16:00',
    endTime: '23:00',
    status: 'not-started',
    theater: 'Rạp Trung tâm',
    position: 'Quầy bán vé',
  },
  {
    id: 'shift-3',
    date: '2025-11-27',
    startTime: '08:00',
    endTime: '16:00',
    status: 'not-started',
    theater: 'Rạp Trung tâm',
    position: 'Quầy bán vé',
  },
];

// Theater location (mock)
const theaterLocation = { lat: 10.7769, lng: 106.7009 }; // Example: HCMC
const maxDistanceMeters = 100; // 100m radius

// Helper functions
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const getCurrentTime = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const canCheckIn = (startTime: string): { allowed: boolean; status: 'early' | 'on-time' | 'late' | 'too-late' } => {
  const now = new Date();
  const [hours, minutes] = startTime.split(':').map(Number);
  const shiftStart = new Date();
  shiftStart.setHours(hours, minutes, 0);

  const diffMinutes = Math.floor((now.getTime() - shiftStart.getTime()) / 60000);

  if (diffMinutes < -10) {
    return { allowed: false, status: 'early' };
  } else if (diffMinutes <= 5) {
    return { allowed: true, status: 'on-time' };
  } else if (diffMinutes <= 15) {
    return { allowed: true, status: 'late' };
  } else {
    return { allowed: false, status: 'too-late' };
  }
};

const calculateWorkDuration = (checkIn: string, checkOut: string): number => {
  const [inH, inM] = checkIn.split(':').map(Number);
  const [outH, outM] = checkOut.split(':').map(Number);
  
  const inMinutes = inH * 60 + inM;
  const outMinutes = outH * 60 + outM;
  
  return Math.max(0, outMinutes - inMinutes);
};

export default function CheckIn() {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [activeShift, setActiveShift] = useState<Shift | null>(
    mockShifts.find((s) => s.status === 'ongoing') || null
  );
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutReason, setCheckOutReason] = useState('');

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
        (error) => {
          setLocationError('Không thể lấy vị trí. Vui lòng bật GPS.');
          // Mock location for demo
          setCurrentLocation({ lat: 10.7769, lng: 106.7009 });
        }
      );
    } else {
      setLocationError('Trình duyệt không hỗ trợ GPS.');
      setCurrentLocation({ lat: 10.7769, lng: 106.7009 });
    }
  }, []);

  const handleCheckInClick = (shift: Shift) => {
    setSelectedShift(shift);
    setShowCheckInModal(true);
  };

  const handleCheckIn = async () => {
    if (!selectedShift || !currentLocation) return;

    setCheckInLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Validate time
    const timeCheck = canCheckIn(selectedShift.startTime);
    if (!timeCheck.allowed) {
      alert(
        timeCheck.status === 'early'
          ? 'Check-in quá sớm! Vui lòng đợi đến 10 phút trước giờ bắt đầu ca.'
          : 'Check-in quá muộn! Vui lòng liên hệ quản lý.'
      );
      setCheckInLoading(false);
      return;
    }

    // Validate location
    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      theaterLocation.lat,
      theaterLocation.lng
    );

    if (distance > maxDistanceMeters) {
      alert(`Bạn đang ở quá xa rạp (${Math.round(distance)}m). Vui lòng đến rạp để check-in.`);
      setCheckInLoading(false);
      return;
    }

    // Create attendance record
    const attendanceRecord: AttendanceRecord = {
      attendanceId: `att-${Date.now()}`,
      employeeId: 'emp-001',
      shiftId: selectedShift.id,
      checkInTime: currentTime,
      checkInStatus: timeCheck.status === 'on-time' ? 'on-time' : 'late',
      location: currentLocation,
      deviceInfo: navigator.userAgent,
    };

    // Update shift
    const updatedShifts = shifts.map((s) =>
      s.id === selectedShift.id
        ? {
            ...s,
            status: 'ongoing' as const,
            checkInTime: currentTime,
            checkInStatus: attendanceRecord.checkInStatus,
            location: currentLocation,
            deviceInfo: navigator.userAgent,
          }
        : s
    );

    setShifts(updatedShifts);
    setActiveShift(updatedShifts.find((s) => s.id === selectedShift.id) || null);
    setCheckInLoading(false);
    setShowCheckInModal(false);
    setSelectedShift(null);

    alert(
      `Check-in thành công lúc ${currentTime}\nTrạng thái: ${
        attendanceRecord.checkInStatus === 'on-time' ? 'Đúng giờ' : 'Đi trễ'
      }`
    );
  };

  const handleCheckOutClick = (shift: Shift) => {
    setSelectedShift(shift);
    setShowCheckOutModal(true);
  };

  const handleCheckOut = async () => {
    if (!selectedShift || !selectedShift.checkInTime) return;

    setCheckInLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Calculate work duration
    const duration = calculateWorkDuration(selectedShift.checkInTime, currentTime);
    const expectedDuration = calculateWorkDuration(selectedShift.startTime, selectedShift.endTime);
    const overtime = Math.max(0, duration - expectedDuration);

    // Check if early checkout
    const [endH, endM] = selectedShift.endTime.split(':').map(Number);
    const expectedEnd = new Date();
    expectedEnd.setHours(endH, endM, 0);
    const now = new Date();

    if (now < expectedEnd && !checkOutReason) {
      alert('Bạn đang check-out sớm. Vui lòng nhập lý do.');
      setCheckInLoading(false);
      return;
    }

    // Update shift
    const updatedShifts = shifts.map((s) =>
      s.id === selectedShift.id
        ? {
            ...s,
            status: 'completed' as const,
            checkOutTime: currentTime,
            workDuration: duration,
            overtime: overtime,
          }
        : s
    );

    setShifts(updatedShifts);
    setActiveShift(null);
    setCheckInLoading(false);
    setShowCheckOutModal(false);
    setSelectedShift(null);
    setCheckOutReason('');

    alert(
      `Check-out thành công lúc ${currentTime}\n` +
        `Thời gian làm việc: ${Math.floor(duration / 60)}h ${duration % 60}m\n` +
        (overtime > 0 ? `Overtime: ${Math.floor(overtime / 60)}h ${overtime % 60}m` : '')
    );
  };

  const getShiftStatusBadge = (status: Shift['status']) => {
    switch (status) {
      case 'not-started':
        return (
          <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">
            Chưa bắt đầu
          </span>
        );
      case 'ongoing':
        return (
          <span className="px-3 py-1 bg-chart-3/10 text-chart-3 rounded-full text-xs flex items-center gap-1">
            <div className="w-2 h-2 bg-chart-3 rounded-full animate-pulse" />
            Đang diễn ra
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
            Đã hoàn thành
          </span>
        );
    }
  };

  const getCheckInStatusBadge = (status: 'on-time' | 'late' | undefined) => {
    if (!status) return null;
    switch (status) {
      case 'on-time':
        return (
          <span className="flex items-center gap-1 text-chart-3 text-xs">
            <CheckCircle2 className="w-4 h-4" />
            Đúng giờ
          </span>
        );
      case 'late':
        return (
          <span className="flex items-center gap-1 text-accent text-xs">
            <AlertCircle className="w-4 h-4" />
            Đi trễ
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-2">Check-in Ca Làm Việc</h1>
        <p className="text-muted-foreground">
          Điểm danh và quản lý thời gian làm việc của bạn
        </p>
      </div>

      {/* Current Time & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-primary to-primary-hover p-6 rounded-[10px] text-primary-foreground">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6" />
            <h3>Thời gian hiện tại</h3>
          </div>
          <p className="text-3xl">{currentTime}</p>
          <p className="text-sm opacity-80 mt-1">Thứ 4, 26/11/2025</p>
        </div>

        <div className={`p-6 rounded-[10px] ${currentLocation ? 'bg-gradient-to-br from-chart-3 to-chart-3/80' : 'bg-gradient-to-br from-muted to-muted/80'}`}>
          <div className="flex items-center gap-3 mb-2">
            <MapPin className={`w-6 h-6 ${currentLocation ? 'text-white' : 'text-muted-foreground'}`} />
            <h3 className={currentLocation ? 'text-white' : 'text-muted-foreground'}>Vị trí GPS</h3>
          </div>
          {currentLocation ? (
            <>
              <p className="text-3xl text-white">Đã bật</p>
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
      {activeShift && (
        <div className="bg-card border-2 border-primary rounded-[10px] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-[10px] flex items-center justify-center">
                <Coffee className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-foreground">Ca Đang Làm Việc</h2>
                <p className="text-sm text-muted-foreground">{activeShift.theater}</p>
              </div>
            </div>
            {getShiftStatusBadge(activeShift.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="p-4 bg-secondary/50 rounded-[10px]">
              <div className="flex items-center gap-2 mb-2">
                <LogIn className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Check-in</span>
              </div>
              <p className="text-foreground text-xl">{activeShift.checkInTime}</p>
              {getCheckInStatusBadge(activeShift.checkInStatus)}
            </div>

            <div className="p-4 bg-secondary/50 rounded-[10px]">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Giờ bắt đầu</span>
              </div>
              <p className="text-foreground text-xl">{activeShift.startTime}</p>
            </div>

            <div className="p-4 bg-secondary/50 rounded-[10px]">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Giờ kết thúc</span>
              </div>
              <p className="text-foreground text-xl">{activeShift.endTime}</p>
            </div>

            <div className="p-4 bg-secondary/50 rounded-[10px]">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Thời gian làm</span>
              </div>
              <p className="text-foreground text-xl">
                {activeShift.checkInTime
                  ? `${Math.floor(calculateWorkDuration(activeShift.checkInTime, currentTime) / 60)}h ${calculateWorkDuration(activeShift.checkInTime, currentTime) % 60}m`
                  : '--'}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCheckOutClick(activeShift)}
            className="w-full py-3 bg-destructive text-destructive-foreground rounded-[10px] hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Check-out
          </button>
        </div>
      )}

      {/* Shift List */}
      <section>
        <h2 className="text-foreground mb-4">Danh Sách Ca Làm Việc</h2>
        <div className="space-y-4">
          {shifts.map((shift) => {
            const timeCheck = canCheckIn(shift.startTime);
            const canShowCheckIn = shift.status === 'not-started' && timeCheck.allowed;

            return (
              <div
                key={shift.id}
                className={`bg-card rounded-[10px] border p-6 transition-all ${
                  shift.status === 'ongoing' ? 'border-primary shadow-md' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <h3 className="text-foreground">{shift.date}</h3>
                      {getShiftStatusBadge(shift.status)}
                    </div>
                    <p className="text-muted-foreground text-sm">{shift.theater} • {shift.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground">
                      {shift.startTime} - {shift.endTime}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {calculateWorkDuration(shift.startTime, shift.endTime) / 60} giờ
                    </p>
                  </div>
                </div>

                {shift.checkInTime && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-4 bg-secondary/50 rounded-[10px]">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Check-in</p>
                      <div className="flex items-center gap-2">
                        <LogIn className="w-4 h-4 text-primary" />
                        <span className="text-foreground">{shift.checkInTime}</span>
                      </div>
                    </div>
                    {shift.checkOutTime && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Check-out</p>
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-destructive" />
                          <span className="text-foreground">{shift.checkOutTime}</span>
                        </div>
                      </div>
                    )}
                    {shift.workDuration && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Thời gian làm</p>
                        <span className="text-foreground">
                          {Math.floor(shift.workDuration / 60)}h {shift.workDuration % 60}m
                        </span>
                      </div>
                    )}
                    {shift.overtime && shift.overtime > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Overtime</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-accent" />
                          <span className="text-accent">
                            {Math.floor(shift.overtime / 60)}h {shift.overtime % 60}m
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {canShowCheckIn && (
                  <button
                    onClick={() => handleCheckInClick(shift)}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-[10px] hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    Check-in ngay
                  </button>
                )}

                {shift.status === 'not-started' && !canShowCheckIn && (
                  <div className="p-3 bg-muted/50 rounded-[10px] text-center">
                    <p className="text-sm text-muted-foreground">
                      {timeCheck.status === 'early'
                        ? 'Chưa đến giờ check-in (10 phút trước giờ bắt đầu)'
                        : 'Không thể check-in (Quá giờ cho phép)'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Check-in Modal */}
      {showCheckInModal && selectedShift && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-[10px] max-w-md w-full p-6">
            <h3 className="text-foreground mb-4">Xác nhận Check-in</h3>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-secondary/50 rounded-[10px]">
                <p className="text-sm text-muted-foreground mb-1">Ca làm việc</p>
                <p className="text-foreground">{selectedShift.date} • {selectedShift.startTime} - {selectedShift.endTime}</p>
              </div>

              <div className="p-4 bg-secondary/50 rounded-[10px]">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Thời gian check-in</p>
                </div>
                <p className="text-foreground text-xl">{currentTime}</p>
              </div>

              <div className="p-4 bg-secondary/50 rounded-[10px]">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Vị trí</p>
                </div>
                {currentLocation ? (
                  <p className="text-foreground text-sm">
                    {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                    <br />
                    <span className="text-chart-3">
                      ✓ Trong phạm vi rạp ({Math.round(calculateDistance(currentLocation.lat, currentLocation.lng, theaterLocation.lat, theaterLocation.lng))}m)
                    </span>
                  </p>
                ) : (
                  <p className="text-destructive text-sm">Không thể xác định vị trí</p>
                )}
              </div>

              <div className="p-4 bg-secondary/50 rounded-[10px]">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Thiết bị</p>
                </div>
                <p className="text-foreground text-xs">{navigator.userAgent.slice(0, 50)}...</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCheckInModal(false);
                  setSelectedShift(null);
                }}
                className="flex-1 py-3 bg-secondary text-foreground rounded-[10px] hover:bg-secondary/80 transition-colors"
                disabled={checkInLoading}
              >
                Hủy
              </button>
              <button
                onClick={handleCheckIn}
                disabled={checkInLoading || !currentLocation}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-[10px] hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkInLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Xác nhận Check-in
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check-out Modal */}
      {showCheckOutModal && selectedShift && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-[10px] max-w-md w-full p-6">
            <h3 className="text-foreground mb-4">Xác nhận Check-out</h3>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-secondary/50 rounded-[10px]">
                <p className="text-sm text-muted-foreground mb-1">Thời gian check-out</p>
                <p className="text-foreground text-xl">{currentTime}</p>
              </div>

              {selectedShift.checkInTime && (
                <div className="p-4 bg-secondary/50 rounded-[10px]">
                  <p className="text-sm text-muted-foreground mb-2">Tổng thời gian làm việc</p>
                  <p className="text-foreground text-2xl">
                    {Math.floor(calculateWorkDuration(selectedShift.checkInTime, currentTime) / 60)}h{' '}
                    {calculateWorkDuration(selectedShift.checkInTime, currentTime) % 60}m
                  </p>
                  {calculateWorkDuration(selectedShift.checkInTime, currentTime) >
                    calculateWorkDuration(selectedShift.startTime, selectedShift.endTime) && (
                    <p className="text-accent text-sm mt-2">
                      ⚡ Có overtime: {Math.floor((calculateWorkDuration(selectedShift.checkInTime, currentTime) - calculateWorkDuration(selectedShift.startTime, selectedShift.endTime)) / 60)}h{' '}
                      {(calculateWorkDuration(selectedShift.checkInTime, currentTime) - calculateWorkDuration(selectedShift.startTime, selectedShift.endTime)) % 60}m
                    </p>
                  )}
                </div>
              )}

              {/* Check if early checkout */}
              {(() => {
                const [endH, endM] = selectedShift.endTime.split(':').map(Number);
                const expectedEnd = new Date();
                expectedEnd.setHours(endH, endM, 0);
                const now = new Date();
                return now < expectedEnd ? (
                  <div className="p-4 bg-accent/10 border border-accent rounded-[10px]">
                    <p className="text-accent text-sm mb-2">⚠️ Bạn đang check-out sớm</p>
                    <label className="text-sm text-muted-foreground mb-2 block">Lý do (bắt buộc)</label>
                    <textarea
                      value={checkOutReason}
                      onChange={(e) => setCheckOutReason(e.target.value)}
                      placeholder="Nhập lý do check-out sớm..."
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-[10px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows={3}
                    />
                  </div>
                ) : null;
              })()}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCheckOutModal(false);
                  setSelectedShift(null);
                  setCheckOutReason('');
                }}
                className="flex-1 py-3 bg-secondary text-foreground rounded-[10px] hover:bg-secondary/80 transition-colors"
                disabled={checkInLoading}
              >
                Hủy
              </button>
              <button
                onClick={handleCheckOut}
                disabled={checkInLoading}
                className="flex-1 py-3 bg-destructive text-destructive-foreground rounded-[10px] hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkInLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-destructive-foreground border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <LogOut className="w-5 h-5" />
                    Xác nhận Check-out
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
