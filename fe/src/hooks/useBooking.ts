import { useState, useMemo } from 'react';
import { BookedSeat } from '@/types/booking';
import { Schedule } from '@/types/schedule';
import { CartItem, PaymentMethodType } from '../types';
import { useCreateBooking } from '@/hooks/useCreateBooking';
import { useCreatePaymentUrl } from '@/lib/api/post/payment'; // Hook gọi API lấy link thanh toán
import { useSchedules } from '@/lib/api/get/schedules';
import { toast } from 'sonner';
import type { Product } from '@/types/product';
import type { BookingResponseData } from '@/types/booking';

export const STEPS = [
  { number: 1, label: 'Chọn suất' },
  { number: 2, label: 'Chọn ghế' },
  { number: 3, label: 'Bắp nước' },
  { number: 4, label: 'Thanh toán' }, // Bước này sẽ hiện QR
  { number: 5, label: 'Vé điện tử' },
];

export const RESERVED_SEATS = ['A5', 'B3', 'C6', 'D1', 'E8'];

interface UseBookingProps {
  movieId: string;
  preSelectedScheduleId?: string;
}

export function useBooking({ movieId, preSelectedScheduleId }: UseBookingProps) {
  // --- DATA ---
  const { data: scheduleData, isLoading: isLoadingSchedules } = useSchedules({ movieId });
  const schedules = scheduleData?.schedules || [];

  // --- STATE ---
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<BookedSeat[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('VNPAY'); // Mặc định VNPAY
  
  // State lưu kết quả trả về từ API
  const [createdBookingData, setCreatedBookingData] = useState<BookingResponseData | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string>('');

  // --- API HOOKS ---
  const { mutate: createBooking, isPending: isCreatingBooking } = useCreateBooking();
  const { mutate: createPayment, isPending: isCreatingPayment } = useCreatePaymentUrl();

  // --- LOGIC TÍNH TOÁN ---
  const totalAmount = useMemo(() => {
    const tickets = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const products = cartItems.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
    return tickets + products;
  }, [selectedSeats, cartItems]);

  // --- HANDLERS ---
  const handleSeatClick = (seatNumber: string, price: number, type: "Thường" | "VIP" | "Ghế đôi") => {
    if (RESERVED_SEATS.includes(seatNumber)) return;
    const isSelected = selectedSeats.some(s => s.seatNumber === seatNumber);
    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.seatNumber !== seatNumber));
    } else {
      setSelectedSeats(prev => [...prev, { seatNumber, seatType: type, price }]);
    }
  };

  const updateCartItem = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.product._id !== product._id));
      return;
    }
    setCartItems(prev => {
      const exists = prev.find(item => item.product._id === product._id);
      if (exists) return prev.map(item => item.product._id === product._id ? { ...item, quantity } : item);
      return [...prev, { product, quantity }];
    });
  };

  // --- CORE LOGIC: TẠO ĐƠN & LẤY LINK THANH TOÁN ---
  const handleCreateTransaction = () => {
    if (!selectedSchedule) return toast.error("Vui lòng chọn suất chiếu");
    if (selectedSeats.length === 0) return toast.error("Vui lòng chọn ít nhất 1 ghế");

    // 1. Chuẩn bị Payload
    const bookingPayload = {
      scheduleId: selectedSchedule._id,
      seats: selectedSeats.map(seat => ({
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,
        price: seat.price
      })),
      products: cartItems.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
        size: item.product.size || 'L'
      })),
      voucherCode: "" 
    };

    // 2. Gọi API Tạo Booking
    createBooking(bookingPayload, {
      onSuccess: (bookingRes) => {
        const bookingData = bookingRes.data;
        setCreatedBookingData(bookingData as BookingResponseData); // Lưu thông tin booking (mã vé, id...)

        // 3. Lấy ID để gọi tiếp API Payment
        // (Lưu ý: check kỹ response trả về bookingId nằm ở đâu, ví dụ bookingRes.data.bookingId)
        const bookingId = bookingData.bookingId || (bookingData as BookingResponseData).bookingId;

        // 4. Gọi API Lấy Link Thanh Toán VNPAY
        createPayment(bookingId, {
          onSuccess: (paymentRes) => {
            setPaymentUrl(paymentRes.paymentUrl); // Lưu link thanh toán
            toast.success("Đã tạo đơn hàng & link thanh toán!");
            setCurrentStep(4); // -> Chuyển sang bước Thanh toán (hiện QR)
          }
        });
      }
    });
  };

  // --- NAVIGATION ---
  const nextStep = () => {
    // Nếu đang ở bước 3 (Combo) -> Bấm Tiếp tục sẽ kích hoạt tạo đơn
    if (currentStep === 3) {
      handleCreateTransaction();
      return;
    }
    
    // Nếu đang ở bước 4 (Thanh toán) -> Giả lập đã thanh toán xong -> Step 5
    if (currentStep === 4) {
        setCurrentStep(5);
        return;
    }

    if (currentStep < 5) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => { 
    // Không cho back từ bước 4 (đã tạo đơn) về trước
    if (currentStep === 4) return;
    if (currentStep > 1) setCurrentStep(prev => prev - 1); 
  };

  return {
    // State cũ
    currentStep,
    selectedSchedule, setSelectedSchedule,
    selectedSeats, handleSeatClick,
    cartItems, updateCartItem,
    paymentMethod, setPaymentMethod,
    schedules, isLoadingSchedules,
    
    // State mới
    totalAmount,
    paymentUrl,          // Link VNPAY để hiển thị QR ở Step 4
    createdBookingData,  // Thông tin vé để hiển thị mã đơn
    isProcessing: isCreatingBooking || isCreatingPayment, // Loading chung cho cả 2 quá trình

    nextStep, prevStep
  };
}