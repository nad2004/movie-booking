'use client'

import { Calendar, LogIn, LogOut, Clock, CheckCircle2 } from 'lucide-react'

import { AssignedEmployee } from '@/types/shift'

interface ShiftCardProps {
  assignment: AssignedEmployee
  currentLocation: { lat: number; lng: number } | null
  onCheckIn: (assignment: AssignedEmployee) => void
  onCheckOut: (assignment: AssignedEmployee) => void
  skipTimeCheck?: boolean // For testing
}

const formatTime = (timeString: string) => {
  // timeString format: "HH:MM" hoặc ISO string
  if (timeString.includes('T')) {
    const date = new Date(timeString)
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  return timeString
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const canCheckIn = (startDateTime: string): { allowed: boolean; status: 'early' | 'on-time' | 'late' | 'too-late' } => {
  const now = new Date()
  const shiftStart = new Date(startDateTime)
  const diffMinutes = Math.floor((now.getTime() - shiftStart.getTime()) / 60000)

  if (diffMinutes < -10) return { allowed: false, status: 'early' }
  if (diffMinutes <= 5) return { allowed: true, status: 'on-time' }
  if (diffMinutes <= 15) return { allowed: true, status: 'late' }
  return { allowed: false, status: 'too-late' }
}

const calculateWorkDuration = (checkIn: string, checkOut: string): number => {
  const inTime = new Date(checkIn)
  const outTime = new Date(checkOut)
  return Math.max(0, Math.floor((outTime.getTime() - inTime.getTime()) / 60000))
}

export function ShiftCard({ assignment, currentLocation, onCheckIn, onCheckOut, skipTimeCheck = false }: ShiftCardProps) {
  const isCompleted = assignment.status === 'completed' || (assignment.checkInTime && assignment.checkOutTime)
  const isOngoing = assignment.status === 'checked-in' || (assignment.checkInTime && !assignment.checkOutTime)
  const isPending = assignment.status === 'pending' && !assignment.checkInTime

  const timeCheck = isPending ? canCheckIn(assignment.startDateTime) : null

   // TEST MODE: Allow check-in anytime if skipTimeCheck is true
  const canShowCheckIn = isPending && (skipTimeCheck || timeCheck?.allowed)

  let statusBadge
  if (isCompleted) {
    statusBadge = (
      <span className="px-3 py-1 bg-chart-3/10 text-chart-3 rounded-full text-xs flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Đã hoàn thành
      </span>
    )
  } else if (isOngoing) {
    statusBadge = (
      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center gap-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        Đang diễn ra
      </span>
    )
  } else {
    statusBadge = (
      <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">
        Chưa bắt đầu
      </span>
    )
  }

  const workDuration = assignment.checkInTime && assignment.checkOutTime
    ? calculateWorkDuration(assignment.checkInTime, assignment.checkOutTime)
    : 0

  return (
    <div className={`bg-card rounded-xl border p-6 transition-all ${
      isOngoing ? 'border-primary shadow-md' : 'border-border'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-1 h-12 rounded-full" 
              style={{ backgroundColor: assignment.color }}
            />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {assignment.shiftName} ({assignment.shiftCode})
              </h3>
              <p className="text-sm text-muted-foreground">{assignment.theaterName}</p>
            </div>
          </div>
        </div>
        {statusBadge}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-4 bg-secondary/50 rounded-xl">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Ngày làm</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium text-sm">
              {formatDate(assignment.date)}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Giờ làm</p>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium text-sm">
              {assignment.startTime} - {assignment.endTime}
            </span>
          </div>
        </div>

        {assignment.checkInTime && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Check-in</p>
            <div className="flex items-center gap-2">
              <LogIn className="w-4 h-4 text-primary" />
              <span className="text-foreground font-medium text-sm">
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
              <span className="text-foreground font-medium text-sm">
                {formatTime(assignment.checkOutTime)}
              </span>
            </div>
          </div>
        )}
        
        {workDuration > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Thời gian làm</p>
            <span className="text-foreground font-medium text-sm">
              {Math.floor(workDuration / 60)}h {workDuration % 60}m
            </span>
          </div>
        )}
      </div>

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

      {isOngoing && (
        <button
          onClick={() => onCheckOut(assignment)}
          className="w-full py-3 bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <LogOut className="w-5 h-5" />
          Check-out
        </button>
      )}
    </div>
  )
}