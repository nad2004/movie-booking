import type { ApiResponse } from './apiTemplate';
import type { Pagination } from './apiTemplate';
import type { Schedule } from './schedule';
import type { User } from './user';
import type { Seat } from './theater';
export type BookingStatus = "Chờ thanh toán" | "Hoàn tất" | "Đã hủy" | "Đã sử dụng" | "Hết hạn";
// === Payment Details ===
export interface PaymentDetails {
  paymentMethod: "pending" | "VNPAY" | "MoMo" | "ZaloPay" | "Tại quầy" | "Thẻ tín dụng";
  transactionId?: string;
  status: "Chờ thanh toán" | "Thành công" | "Thất bại" | "Đã hoàn tiền";
  amount: number;
  paymentDate?: string | Date;
  paymentInfo?: string;
}

// === Ordered Product (bắp nước, combo) ===
export interface OrderedProduct {
  product: string; // ObjectId
  productName: string;
  quantity: number;
  priceAtBooking: number;
  size: "S" | "M" | "L" | "N/A";
}

// === Booked Seat ===
export type BookedSeat = Seat;

// === Main Booking Interface ===
export interface Booking {
  _id: string;

  // === Customer ===
  customer: User; // ObjectId

  // === Schedule ===
  schedule: Schedule;

  movieTitle: string;
  theaterName: string;
  roomName: string;
  showDate: string | Date;
  showTime: string;

  // === Seats ===
  seats: BookedSeat[];

  // === Products ===
  products?: OrderedProduct[];

  // === Voucher ===
  appliedVoucher?: string | null;
  voucherCode?: string;

  // === Price ===
  ticketsAmount: number;
  productsAmount: number;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;

  // === Status ===
  status: BookingStatus;

  // === QR & Booking Code ===
  qrCode?: string;
  bookingCode?: string;

  // === Payment ===
  paymentDetails: PaymentDetails;

  // === Cancellation ===
  cancelledBy?: string;
  cancelledAt?: string | Date;
  cancellationReason?: string;
  refundAmount?: number;

  // === Others ===
  notes?: string;
  usedAt?: string | Date;

  // === Timestamps ===
  createdAt: string;
  updatedAt: string;

  // === Virtuals ===
  isExpired?: boolean;
}
export interface CreateBookingRequest {
  scheduleId: string;
  seats: {
    seatNumber: string;
    seatType: string;
    price: number;
  }[];
  products: {
    productId: string;
    quantity: number;
    size: string; // "S" | "M" | "L"
  }[];
  voucherCode?: string; // Optional nếu không nhập
}

export interface BookingResponseData {
    bookingId: string,
    bookingCode: string,
    totalAmount: number,
    holdUntil: Date;
  };

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  data: BookingResponseData;
}
export interface PaginatedBookingData {
  bookings: Booking[];
  pagination: Pagination;
}
export type BookingResponse = ApiResponse<Booking>;
export type BookingListResponse = ApiResponse<PaginatedBookingData>;