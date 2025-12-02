'use client'

import { useState } from 'react'
import { TicketScanner } from './components/TicketScanner'
import { TicketInfoDisplay } from './components/TicketInfoDisplay'
import { TicketStatsCards, type TicketStats } from './components/TicketStatsCards'
import type { Booking } from '@/types/booking'
export default function ConfirmTicket() {
  const [ticketInfo, setTicketInfo] = useState<Booking | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  // Mock stats data - thay bằng API thực tế
  const stats: TicketStats = {
    total: 245,
    valid: 238,
    invalid: 7,
  }

  // Xử lý quét vé
  const handleScanTicket = async (ticketData: Booking) => {
    setIsScanning(true)
    
    try {
      // TODO: Call API kiểm tra vé thực tế
      // const response = await verifyTicket(ticketCode)
      
      // Mock data giả lập
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTicketInfo(ticketData)
    } catch (error) {
      console.error('Error scanning ticket:', error)
      // TODO: Hiển thị error toast
    } finally {
      setIsScanning(false)
    }
  }

  // Xử lý xác nhận vào rạp
  const handleConfirmEntry = async () => {
    if (!ticketInfo) return
    
    setIsConfirming(true)
    
    try {
      // TODO: Call API xác nhận vé thực tế
      // await confirmTicketEntry(ticketInfo.maVe)
      
      await new Promise(resolve => setTimeout(resolve, 800))
      
      alert('Đã xác nhận khách vào rạp!')
      
      // Reset form
      setTicketInfo(null)
    } catch (error) {
      console.error('Error confirming entry:', error)
      // TODO: Hiển thị error toast
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
        <p className="text-muted-foreground mt-1">
          Quét mã vé điện tử và xác nhận khách vào rạp
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TicketScanner 
          onScan={handleScanTicket} 
          isLoading={isScanning}
        />
        
        <TicketInfoDisplay 
          ticket={ticketInfo} 
          onConfirm={handleConfirmEntry}
          isConfirming={isConfirming}
        />
      </div>

      {/* Stats */}
      <TicketStatsCards stats={stats} />
    </div>
  )
}