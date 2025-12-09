import { useState, useMemo } from 'react'
import { BookedSeat } from '@/types/booking'
import { Schedule } from '@/types/schedule'
import { CartItem, PaymentMethodType } from '../types'
import { useCreateBooking } from '@/hooks/useCreateBooking'
import { useCreatePaymentUrl } from '@/lib/api/payment'
import { useSchedules } from '@/lib/api/schedules'
import { toast } from 'sonner'
import type { Product } from '@/types/product'
import type { BookingResponseData } from '@/types/booking'
// Thêm import Seat
import type { Seat } from '@/types/theater'

export const STEPS = [
  { number: 1, label: 'Chọn suất' },
  { number: 2, label: 'Chọn ghế' },
  { number: 3, label: 'Bắp nước' },
  { number: 4, label: 'Thanh toán' },
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('VNPAY')

  const [createdBookingData, setCreatedBookingData] = useState<BookingResponseData | null>(null)
  const [paymentUrl, setPaymentUrl] = useState<string>('')

  // --- API HOOKS ---
  const { mutate: createBooking, isPending: isCreatingBooking } = useCreateBooking()
  const { mutate: createPayment, isPending: isCreatingPayment } = useCreatePaymentUrl()

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
  // SỬA ĐỔI: Nhận object Seat, tự tính giá dựa trên selectedSchedule
  const handleSeatClick = (seat: Seat) => {
    if (!selectedSchedule) {
      toast.error('Vui lòng chọn suất chiếu trước')
      return
    }

    // Kiểm tra ghế hardcode reserved (nếu cần giữ logic cũ)
    if (RESERVED_SEATS.includes(seat.seatNumber)) return

    const isSelected = selectedSeats.some(s => s.seatNumber === seat.seatNumber)

    if (isSelected) {
      // Bỏ chọn
      setSelectedSeats(prev => prev.filter(s => s.seatNumber !== seat.seatNumber))
    } else {
      // Chọn mới -> Tính giá
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

  // --- CORE LOGIC: TẠO ĐƠN & LẤY LINK THANH TOÁN ---
  const handleCreateTransaction = () => {
    if (!selectedSchedule) return toast.error('Vui lòng chọn suất chiếu')
    if (selectedSeats.length === 0) return toast.error('Vui lòng chọn ít nhất 1 ghế')

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

    createBooking(bookingPayload, {
      onSuccess: bookingRes => {
        const bookingData = bookingRes.data
        setCreatedBookingData(bookingData as BookingResponseData)

        const bookingId = bookingData.bookingId || (bookingData as BookingResponseData).bookingId

        createPayment(bookingId, {
          onSuccess: paymentRes => {
            setPaymentUrl(paymentRes.paymentUrl)
            toast.success('Đã tạo đơn hàng & link thanh toán!')
            setCurrentStep(4)
          },
        })
      },
    })
  }

  // --- NAVIGATION ---
  const nextStep = () => {
    if (currentStep === 3) {
      handleCreateTransaction()
      return
    }
    if (currentStep === 4) {
      setCurrentStep(5)
      return
    }
    if (currentStep < 5) setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    if (currentStep === 4) return
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
    isProcessing: isCreatingBooking || isCreatingPayment,
    nextStep,
    prevStep,
  }
}
