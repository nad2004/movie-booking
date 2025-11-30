import { Theater } from "./theater";

// ==========================================
// ENUMS & TYPES
// ==========================================

export type ShiftType = "morning" | "afternoon" | "evening" | "night" | "full-day";

export type StaffPosition = 
  | "cashier" 
  | "usher" 
  | "projectionist" 
  | "manager" 
  | "cleaner" 
  | "security";

export type ShiftStatus = 
  | "scheduled" 
  | "confirmed" 
  | "in-progress" 
  | "completed" 
  | "cancelled" 
  | "no-show";

export type CheckInMethod = "manual" | "qr-code" | "biometric" | "mobile-app";

export type SwapRequestStatus = "pending" | "approved" | "rejected";

// ==========================================
// SUB-INTERFACES
// ==========================================

// Giả lập type User cơ bản (vì bạn chưa gửi file User type)
export interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  // thêm các field khác của user nếu cần
}

export interface GeoLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface TimeCheckRecord {
  time?: string | Date; // ISO String khi trả về từ API
  location?: GeoLocation;
  method?: CheckInMethod;
}

export interface OvertimeInfo {
  hours: number;
  approved: boolean;
  approvedBy?: string | User; // Có thể là ID hoặc Object User đã populate
}

export interface BreakInfo {
  scheduled: number;
  actual: number;
}

export interface SwapRequestInfo {
  requestedBy?: string | User;
  status?: SwapRequestStatus;
  approvedBy?: string | User;
}

// ==========================================
// MAIN INTERFACE: SHIFT
// ==========================================

export interface Shift {
  _id: string;
  
  // Relations: Có thể là ID (string) hoặc Object đầy đủ nếu dùng .populate()
  theater: string | Theater; 
  staff: string | User;

  shiftType: ShiftType;
  date: string | Date; // API thường trả về string ISO
  startTime: string; // "08:00"
  endTime: string;   // "17:00"
  
  position: StaffPosition;
  status: ShiftStatus;

  // Tracking
  checkIn?: TimeCheckRecord;
  checkOut?: TimeCheckRecord;

  // Hours
  actualHours: number;
  scheduledHours: number;
  
  overtime?: OvertimeInfo;
  break?: BreakInfo;

  notes?: string;
  
  // Replacement / Swap
  replacedBy?: string | User;
  swapRequest?: SwapRequestInfo;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// API RESPONSE TYPES (Optional helper)
// ==========================================
import { ApiResponse, Pagination } from "./apiTemplate"; // Giả sử bạn có file này

export type ShiftApiResponse = ApiResponse<Shift>;
export type ShiftListResponse = ApiResponse<{
  shifts: Shift[];
  pagination: Pagination;
}>;