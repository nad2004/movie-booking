import type { ApiResponse } from './apiTemplate';
export interface ShiftTemplate {
  _id: string;
  code: string;
  name: string; // VD: Ca Sáng
  startTime: string; // 08:00
  endTime: string; // 16:00
  color: string; // Để hiển thị trên lịch
  isActive: boolean;
}

export interface WorkSchedule {
  id: string;
  date: string; // 2025-12-01
  theaterId: string;
  shiftTemplateId: string;
  shiftTemplate?: ShiftTemplate; // Relation
  status: 'Open' | 'Closed';
}

export interface ShiftAssignment {
  id: string;
  workScheduleId: string;
  userId: string;
  userName: string;
  role: 'Manager' | 'Staff' | 'Ticket';
  checkInTime?: string;
  checkOutTime?: string;
  status: 'Assigned' | 'Working' | 'Completed' | 'Absent';
}

export type ShiftTemplateResponse = ApiResponse<ShiftTemplate[]>