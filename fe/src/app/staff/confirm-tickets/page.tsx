'use client'

import { useState } from 'react'
import { TicketScanner } from './components/TicketScanner'
import { TicketInfoDisplay } from './components/TicketInfoDisplay'
import {FoodSalesModal} from './components/FoodSalesModal'
import { type TicketStats } from './components/TicketStatsCards'
import type { TicketVerify } from '@/types/booking'
import { useNotification } from '@/providers/NotificationProvider'
import { useConfirmTicket } from './hooks/useConfirmTicket'

interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
}

export default function ConfirmTicket() {
  const { showSuccess, showError } = useNotification()

  const [ticketInfo, setTicketInfo] = useState<TicketVerify | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  
  const { confirmTicket } = useConfirmTicket()

  // Mock stats data - replace with real API
  const stats: TicketStats = {
    total: 245,
    valid: 238,
    invalid: 7,
  }

  // Handle ticket scan - now receives full Booking object from API
  const handleScanTicket = async (ticketData: TicketVerify) => {
    setTicketInfo(ticketData)
    // Reset cart when new ticket is scanned
    setCartItems([])
  }

  // Handle open food sales modal
  const handleOpenFoodSales = () => {
    if (!ticketInfo) return
    setIsFoodModalOpen(true)
  }

  // Handle close food sales modal
  const handleCloseFoodSales = () => {
    setIsFoodModalOpen(false)
  }

  // Handle confirm food order
  const handleConfirmFoodOrder = (items: CartItem[]) => {
    setCartItems(items)
    setIsFoodModalOpen(false)
    showSuccess(
      'Đã thêm sản phẩm!', 
      `Đã thêm ${items.length} sản phẩm vào đơn hàng. Vui lòng thu tiền từ khách hàng.`
    )
  }

  // Handle confirm entry - now also processes cart if exists
  const handleConfirmEntry = async () => {
    if (!ticketInfo) return
    
    if (cartItems.length > 0) {
      showError(
        'Chưa xác nhận đơn hàng!',
        'Vui lòng xác nhận đơn hàng đồ ăn trước khi cho khách vào rạp.'
      )
      return
    }

    setIsConfirming(true)
    try {
      confirmTicket.mutate(ticketInfo.booking.bookingCode)
      setTicketInfo(null)
      setCartItems([])
    } catch (error) {
      console.error('Error confirming entry:', error)
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
          Kiểm tra & Xác nhận vé
        </h2>
        <p className="text-muted-foreground mt-1">Quét mã vé điện tử và xác nhận khách vào rạp</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TicketScanner onScan={handleScanTicket} />
        <TicketInfoDisplay
          ticket={ticketInfo}
          onConfirm={handleConfirmEntry}
          isConfirming={isConfirming}
          onOpenFoodSales={handleOpenFoodSales}
          hasCartItems={cartItems.length > 0}
        />
      </div>

      {/* Food Sales Modal */}
      {ticketInfo && (
        <FoodSalesModal
          isOpen={isFoodModalOpen}
          onClose={handleCloseFoodSales}
          onConfirm={handleConfirmFoodOrder}
          bookingCode={ticketInfo.booking.bookingCode}
        />
      )}

      {/* Stats */}
      {/* <TicketStatsCards stats={stats} /> */}
    </div>
  )
}