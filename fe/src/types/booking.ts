import type { Customer } from './user'
import type { Schedule } from './theater'
import type { Seat } from './theater'

// Bảng BOOKING
export interface Booking {
  booking_id: string // PK
  customer_id: string // FK
  schedule_id: string // FK (Cần thiết, để biết lịch chiếu nào được đặt)
  booking_date: Date
  total_amount: number
  status: 'pending' | 'confirmed' | 'cancelled'
  qr_code: string
  created_at: Date
  updated_at: Date
  confirmed_by: number | null
  cancelled_by: number | null

  customer?: Customer
  schedule?: Schedule
  details?: BookingDetail[] // Mối quan hệ 1-N (Chi tiết Ghế)
  combos?: BookingCombo[] // Mối quan hệ 1-N (Chi tiết Combo đã mua)
  payment?: Payment // Mối quan hệ 1-1
}

// Bảng BOOKING_DETAIL (Chi tiết từng vé/ghế trong Booking)
export interface BookingDetail {
  booking_detail_id: string // PK
  booking_id: string // FK (Liên kết đến Booking)
  seat_id: string // FK (Liên kết đến ghế cụ thể)
  schedule_id: string // THỪA**
  seat_price: number // Giá ghế tại thời điểm đặt

  booking?: Booking
  seat?: Seat
}

// Bảng PAYMENT
export interface Payment {
  payment_id: string // PK
  booking_id: string // FK
  payment_date: Date
  amount: number
  payment_method: string
  transaction_id: string
  status: 'success' | 'failed' | 'refunded'
  payment_info: string // Chi tiết khác của thanh toán (ex: bank code)
  booking?: Booking // Mối quan hệ 1-1
}
export type ComboItem = {
  combo_id: string
  description: string
  name: string
  price: number
  image_url: string
  items: string[]
}

export interface BookingCombo {
  booking_combo_id: string // PK
  booking_id: string // FK - Liên kết đến Booking
  combo_id: string // FK - Liên kết đến ComboItem gốc
  quantity: number // Số lượng combo này đã mua
  unit_price: number // Giá combo tại thời điểm mua (để đảm bảo tính lịch sử)

  booking?: Booking
  comboItem?: ComboItem
}
