import { useState, useMemo } from 'react'
import { BookedSeat } from '@/types/booking'
import { Schedule } from '@/types/schedule'
import { CartItem } from '../types'
import { useCreateBooking } from '@/hooks/useCreateBooking'
import { useCreateVNPayUrl, useCreateMoMoUrl } from '@/lib/api/payment'
import { useSchedules } from '@/lib/api/schedules'
import { toast } from 'sonner'
import type { Product } from '@/types/product'
import type { BookingResponseData } from '@/types/booking'
import type { Seat } from '@/types/theater'

export const STEPS = [
  { number: 1, label: 'Chọn suất' },
  { number: 2, label: 'Chọn ghế' },
  { number: 3, label: 'Bắp nước' },
  { number: 4, label: 'Thanh toán' },
  { number: 5, label: 'Xác nhận' },
]

export const RESERVED_SEATS = ['A5', 'B3', 'C6', 'D1', 'E8']

interface UseBookingProps {
  movieId: string
  preSelectedScheduleId?: string
}

export function useBooking({ movieId, preSelectedScheduleId }: UseBookingProps) {
  // --- DATA ---
  const { data: scheduleData, isLoading: isLoadingSchedules } = useSchedules({ movieId })
  const schedules = scheduleData?.schedules || []

  // --- STATE ---
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<BookedSeat[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'vnpay' | 'momo' | null>(null)

  const [createdBookingData, setCreatedBookingData] = useState<BookingResponseData | null>(null)
  const [paymentUrl, setPaymentUrl] = useState<string>('')

  // --- API HOOKS ---
  // Change 1: Sử dụng mutateAsync để xử lý tuần tự (await)
  const { mutateAsync: createBookingAsync, isPending: isCreatingBooking } = useCreateBooking()
  
  const { mutate: createVNPayPayment, isPending: isCreatingVNPay } = useCreateVNPayUrl()
  const { mutate: createMoMoPayment, isPending: isCreatingMoMo } = useCreateMoMoUrl()

  // --- LOGIC TÍNH TOÁN ---
  const totalAmount = useMemo(() => {
    const tickets = selectedSeats.reduce((sum, s) => sum + s.price, 0)
    const products = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    return tickets + products
  }, [selectedSeats, cartItems])

  // Helper: Tính giá vé dựa trên Schedule đang chọn
  const getSeatPrice = (seatType: string) => {
    if (!selectedSchedule?.ticketPrices) return 0
    switch (seatType) {
      case 'VIP':
        return selectedSchedule.ticketPrices.vip || selectedSchedule.ticketPrices.standard + 20000
      case 'Ghế đôi':
        return selectedSchedule.ticketPrices.couple || selectedSchedule.ticketPrices.standard * 2
      case 'Thường':
      default:
        return selectedSchedule.ticketPrices.standard
    }
  }

  // --- HANDLERS ---
  const handleSeatClick = (seat: Seat) => {
    if (!selectedSchedule) {
      toast.error('Vui lòng chọn suất chiếu trước')
      return
    }

    if (RESERVED_SEATS.includes(seat.seatNumber)) return

    const isSelected = selectedSeats.some(s => s.seatNumber === seat.seatNumber)

    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.seatNumber !== seat.seatNumber))
    } else {
      const price = getSeatPrice(seat.seatType)
      setSelectedSeats(prev => [...prev, { ...seat, price }])
    }
  }

  const updateCartItem = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.product._id !== product._id))
      return
    }
    setCartItems(prev => {
      const exists = prev.find(item => item.product._id === product._id)
      if (exists)
        return prev.map(item => (item.product._id === product._id ? { ...item, quantity } : item))
      return [...prev, { product, quantity }]
    })
  }

  // --- CORE LOGIC: TẠO ĐƠN (BƯỚC 3 -> 4) ---
  // Change 2: Hàm này giờ là async và trả về dữ liệu thay vì void
  const handleCreateBooking = async () => {
    if (!selectedSchedule) {
      toast.error('Vui lòng chọn suất chiếu')
      return null
    }
    if (selectedSeats.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 ghế')
      return null
    }

    const bookingPayload = {
      scheduleId: selectedSchedule._id,
      seats: selectedSeats.map(seat => ({
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,
        price: seat.price,
      })),
      products: cartItems.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
        size: item.product.size || 'L',
      })),
      voucherCode: '',
    }

    try {
      // Await API response
      const bookingRes = await createBookingAsync(bookingPayload)
      const bookingData = bookingRes.data as BookingResponseData
      
      // Update state (cho UI hiển thị nếu cần)
      setCreatedBookingData(bookingData)
      toast.success('Đã tạo đơn hàng!')
      
      // Return data ngay lập tức cho step tiếp theo
      return bookingData
    } catch (error) {
      // Lỗi đã được catch bởi React Query hoặc Global handler, nhưng ta catch thêm để return null
      console.error(error)
      return null
    }
  }

  // --- CORE LOGIC: TẠO LINK THANH TOÁN (BƯỚC 4 -> 5) ---
  // Change 3: Nhận bookingId làm tham số
  const handleCreatePayment = (bookingId: string) => {
    if (!paymentMethod) return toast.error('Vui lòng chọn phương thức thanh toán')

    const onSuccessHandler = (res: any, method: string) => {
        setPaymentUrl(res.paymentUrl)
        toast.success(`Đã tạo link thanh toán ${method}!`)
        setCurrentStep(5)
    }

    if (paymentMethod === 'vnpay') {
      createVNPayPayment(bookingId, {
        onSuccess: (res) => onSuccessHandler(res, 'VNPAY')
      })
    } else if (paymentMethod === 'momo') {
      createMoMoPayment(bookingId, {
        onSuccess: (res) => onSuccessHandler(res, 'MoMo')
      })
    }
  }

  // --- NAVIGATION ---
  const nextStep = async () => {
    // Bước 4 -> 5: Tạo link thanh toán
    if (currentStep === 4) {
      if (!paymentMethod) {
         toast.error('Vui lòng chọn phương thức thanh toán')
         return
      }

      // Change 4: Chạy tuần tự: Tạo đơn -> Lấy ID -> Tạo Payment
      try {
          const bookingData = await handleCreateBooking()
          
          if (bookingData) {
             const bookingId = bookingData.bookingId || (bookingData as any)._id
             handleCreatePayment(bookingId)
          }
      } catch (error) {
          // Error handling
      }
      return
    }

    // Các bước khác
    if (currentStep < 5) setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    // Không cho quay lại từ bước 5 (đã thanh toán)
    if (currentStep === 5) return
    if (currentStep > 1) setCurrentStep(prev => prev - 1)
  }

  return {
    currentStep,
    selectedSchedule,
    setSelectedSchedule,
    selectedSeats,
    handleSeatClick,
    cartItems,
    updateCartItem,
    paymentMethod,
    setPaymentMethod,
    schedules,
    isLoadingSchedules,
    totalAmount,
    paymentUrl,
    createdBookingData,
    // Gom tất cả trạng thái loading
    isProcessing: isCreatingBooking || isCreatingVNPay || isCreatingMoMo,
    nextStep,
    prevStep,
  }
}