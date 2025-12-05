'use client'

import { Calendar, LogIn, LogOut, Clock, TrendingUp } from 'lucide-react';
import { AssignedEmployee } from '@/types/shift';

interface ShiftCardProps {
  assignment: AssignedEmployee;
  currentLocation: { lat: number; lng: number } | null;
  onCheckIn: (assignment: AssignedEmployee) => void;
  onCheckOut: (assignment: AssignedEmployee) => void;
}

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
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

export function ShiftCard({ assignment, currentLocation, onCheckIn, onCheckOut }: ShiftCardProps) {
  const isCompleted = assignment.checkInTime && assignment.checkOutTime;
  const isOngoing = assignment.checkInTime && !assignment.checkOutTime;
  const isPending = !assignment.checkInTime;

  const timeCheck = isPending ? canCheckIn(assignment.assignedAt) : null;
  const canShowCheckIn = isPending && timeCheck?.allowed;

  let statusBadge;
  if (isCompleted) {
    statusBadge = (
      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
        Đã hoàn thành
      </span>
    );
  } else if (isOngoing) {
    statusBadge = (
      <span className="px-3 py-1 bg-chart-3/10 text-chart-3 rounded-full text-xs flex items-center gap-1">
        <div className="w-2 h-2 bg-chart-3 rounded-full animate-pulse" />
        Đang diễn ra
      </span>
    );
  } else {
    statusBadge = (
      <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">
        Chưa bắt đầu
      </span>
    );
  }

  const workDuration = assignment.checkInTime && assignment.checkOutTime
    ? calculateWorkDuration(assignment.checkInTime, assignment.checkOutTime)
    : 0;

  return (
    <div className={`bg-card rounded-xl border p-6 transition-all ${
      isOngoing ? 'border-primary shadow-md' : 'border-border'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">
              {formatDate(assignment.assignedAt)}
            </h3>
            {statusBadge}
          </div>
          <p className="text-muted-foreground text-sm">{assignment.role}</p>
        </div>
        <div className="text-right">
          <p className="text-foreground font-medium">
            {formatTime(assignment.assignedAt)}
          </p>
        </div>
      </div>

      {(assignment.checkInTime || assignment.checkOutTime) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-4 bg-secondary/50 rounded-xl">
          {assignment.checkInTime && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Check-in</p>
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-primary" />
                <span className="text-foreground font-medium">
                  {formatTime(assignment.checkInTime)}
                </span>
              </div>
            </div>
          )}
          
          {assignment.checkOutTime && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Check-out</p>
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4 text-destructive" />
                <span className="text-foreground font-medium">
                  {formatTime(assignment.checkOutTime)}
                </span>
              </div>
            </div>
          )}
          
          {workDuration > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Thời gian làm</p>
              <span className="text-foreground font-medium">
                {Math.floor(workDuration / 60)}h {workDuration % 60}m
              </span>
            </div>
          )}
        </div>
      )}

      {canShowCheckIn && (
        <button
          onClick={() => onCheckIn(assignment)}
          disabled={!currentLocation}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogIn className="w-5 h-5" />
          Check-in ngay
        </button>
      )}

      {isPending && !canShowCheckIn && (
        <div className="p-3 bg-muted/50 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">
            {timeCheck?.status === 'early'
              ? 'Chưa đến giờ check-in (10 phút trước giờ bắt đầu)'
              : 'Không thể check-in (Quá giờ cho phép)'}
          </p>
        </div>
      )}
    </div>
  );
}