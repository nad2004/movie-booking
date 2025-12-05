'use client'

import { Coffee, LogIn, Clock, LogOut, Timer } from 'lucide-react';
import { AssignedEmployee } from '@/types/shift';

interface ActiveShiftCardProps {
  assignment: AssignedEmployee;
  currentTime: string;
  onCheckOut: (assignment: AssignedEmployee) => void;
}

const calculateWorkDuration = (checkIn: string, currentTime: string): number => {
  const inTime = new Date(checkIn);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - inTime.getTime()) / 60000));
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export function ActiveShiftCard({ assignment, currentTime, onCheckOut }: ActiveShiftCardProps) {
  const workDuration = assignment.checkInTime 
    ? calculateWorkDuration(assignment.checkInTime, currentTime)
    : 0;

  return (
    <div className="bg-card border-2 border-primary rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Coffee className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Ca Đang Làm Việc</h2>
            <p className="text-sm text-muted-foreground">{assignment.role}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-chart-3/10 text-chart-3 rounded-full text-xs flex items-center gap-1">
          <div className="w-2 h-2 bg-chart-3 rounded-full animate-pulse" />
          Đang diễn ra
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-secondary/50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <LogIn className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Check-in</span>
          </div>
          <p className="text-foreground text-xl font-semibold">
            {assignment.checkInTime ? formatTime(assignment.checkInTime) : '--:--'}
          </p>
        </div>

        <div className="p-4 bg-secondary/50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Giờ check-out dự kiến</span>
          </div>
          <p className="text-foreground text-xl font-semibold">{currentTime}</p>
        </div>

        <div className="p-4 bg-secondary/50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Thời gian làm</span>
          </div>
          <p className="text-foreground text-xl font-semibold">
            {Math.floor(workDuration / 60)}h {workDuration % 60}m
          </p>
        </div>
      </div>

      <button
        onClick={() => onCheckOut(assignment)}
        className="w-full py-3 bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <LogOut className="w-5 h-5" />
        Check-out
      </button>
    </div>
  );
}