import type { Booking, BookingDetail, BookingCombo, Payment } from '@/types/booking'; // Giả sử các interface nằm trong './types'

// --- Hằng số giả định ---
const MOCK_CUSTOMER_ID = 'cst_001';
const MOCK_USER_ID = 101; // ID người dùng xác nhận
const MOCK_QR_CODE = 'XYZ123ABC';

// Giá tại thời điểm đặt
const PRICE_SCH_001 = 85000;
const PRICE_SCH_002 = 120000;
const PRICE_COMBO_SOLO = 89000;
const PRICE_COMBO_COUPLE = 139000;

// --- Dữ liệu Mock ---
export const mockBookings: Booking[] = [
  // --- BOOKING 1: 2 vé + 1 Combo Solo ---
  {
    booking_id: 'bk_001',
    customer_id: MOCK_CUSTOMER_ID,
    schedule_id: 'sch_001', // Lịch chiếu 1 (Giá 85k/vé)
    booking_date: new Date('2024-01-14T10:30:00Z'),
    // 2 vé * 85000 + 1 combo * 89000 = 170000 + 89000 = 259000
    total_amount: 259000, 
    status: 'confirmed',
    qr_code: MOCK_QR_CODE,
    created_at: new Date('2024-01-14T10:20:00Z'),
    updated_at: new Date('2024-01-14T10:35:00Z'),
    confirmed_by: MOCK_USER_ID,
    cancelled_by: null,

    // Chi tiết ghế ngồi (BookingDetail)
    details: [
      {
        booking_detail_id: 'bkdt_001a',
        booking_id: 'bk_001',
        seat_id: 'E5', // Ghế E5
        seat_price: PRICE_SCH_001,
      } as BookingDetail,
      {
        booking_detail_id: 'bkdt_001b',
        booking_id: 'bk_001',
        seat_id: 'E6', // Ghế E6
        seat_price: PRICE_SCH_001,
      } as BookingDetail,
    ],

    // Chi tiết Combo (BookingCombo)
    combos: [
      {
        booking_combo_id: 'bkcbo_001a',
        booking_id: 'bk_001',
        combo_id: 'cbo_001', // Combo Solo
        quantity: 1,
        unit_price: PRICE_COMBO_SOLO,
      } as BookingCombo,
    ],

    // Thanh toán (Payment)
    payment: {
        payment_id: 'pmt_001',
        booking_id: 'bk_001',
        payment_date: new Date('2024-01-14T10:34:00Z'),
        amount: 259000,
        payment_method: 'Momo',
        transaction_id: 'TXN123456789',
        status: 'success',
        payment_info: 'Momo Wallet',
    } as Payment,
  },

  // --- BOOKING 2: 3 vé + 1 Combo Couple ---
  {
    booking_id: 'bk_002',
    customer_id: 'cst_002',
    schedule_id: 'sch_002', // Lịch chiếu 2 (Giá 120k/vé)
    booking_date: new Date('2024-01-13T20:00:00Z'),
    // 3 vé * 120000 + 1 combo * 139000 = 360000 + 139000 = 499000 (Sửa lại giá mock gốc)
    total_amount: 499000, 
    status: 'confirmed',
    qr_code: 'GHI987DEF',
    created_at: new Date('2024-01-13T19:50:00Z'),
    updated_at: new Date('2024-01-13T20:10:00Z'),
    confirmed_by: MOCK_USER_ID,
    cancelled_by: null,

    // Chi tiết ghế ngồi (BookingDetail)
    details: [
      { booking_detail_id: 'bkdt_002a', booking_id: 'bk_002', seat_id: 'G8', seat_price: PRICE_SCH_002 } as BookingDetail,
      { booking_detail_id: 'bkdt_002b', booking_id: 'bk_002', seat_id: 'G9', seat_price: PRICE_SCH_002 } as BookingDetail,
      { booking_detail_id: 'bkdt_002c', booking_id: 'bk_002', seat_id: 'G10', seat_price: PRICE_SCH_002 } as BookingDetail,
    ],

    // Chi tiết Combo (BookingCombo)
    combos: [
      {
        booking_combo_id: 'bkcbo_002a',
        booking_id: 'bk_002',
        combo_id: 'cbo_002', // Combo Couple
        quantity: 1,
        unit_price: PRICE_COMBO_COUPLE,
      } as BookingCombo,
    ],

    // Thanh toán (Payment)
    payment: {
        payment_id: 'pmt_002',
        booking_id: 'bk_002',
        payment_date: new Date('2024-01-13T20:05:00Z'),
        amount: 499000,
        payment_method: 'Credit Card',
        transaction_id: 'TXN987654321',
        status: 'success',
        payment_info: 'Visa/Mastercard',
    } as Payment,
  },
];