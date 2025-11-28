import { useState, useEffect, useCallback } from 'react'
import { FlatRoom } from './RoomFormDialog'
import { Seat } from '@/types/theater'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { X, Save, Check, MousePointer2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface AdminSeatMapProps {
  room: FlatRoom
  onClose: () => void
  onSave: (updatedSeatMap: Seat[]) => void
  isSaving: boolean
}

export function AdminSeatMap({ room, onClose, onSave, isSaving }: AdminSeatMapProps) {
  // State quản lý danh sách ghế (Local state để edit trước khi save)
  const [seats, setSeats] = useState<Seat[]>(room.seatMap ? room.seatMap : [])

  // State quản lý ghế đang chọn
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([])

  // --- LOGIC CHÍNH: Xử lý chọn ghế ---
  const handleSeatClick = (seatNumber: string) => {
    setSelectedSeatIds(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(id => id !== seatNumber) // Bỏ chọn
      }
      return [...prev, seatNumber] // Chọn thêm
    })
  }

  const handleSelectRow = (rowLabel: string) => {
    // Tìm tất cả ghế trong hàng đó
    const seatsInRow = seats.filter(s => s.row === rowLabel).map(s => s.seatNumber)

    // Nếu đã chọn hết thì bỏ chọn, ngược lại thì chọn hết
    const allSelected = seatsInRow.every(id => selectedSeatIds.includes(id))

    if (allSelected) {
      setSelectedSeatIds(prev => prev.filter(id => !seatsInRow.includes(id)))
    } else {
      // Merge unique
      setSelectedSeatIds(prev => Array.from(new Set([...prev, ...seatsInRow])))
    }
  }

  // --- LOGIC QUAN TRỌNG: Sửa "setSeat" (Cập nhật loại ghế) ---
  const updateSeatType = useCallback(
    (newType: 'Thường' | 'VIP' | 'Ghế đôi') => {
      if (selectedSeatIds.length === 0) return

      setSeats(currentSeats => {
        return currentSeats.map(seat => {
          // Chỉ cập nhật những ghế đang được chọn
          if (selectedSeatIds.includes(seat.seatNumber)) {
            return {
              ...seat,
              seatType: newType,
              // Logic phụ: Nếu là ghế đôi, có thể cần logic ghép cặp (ở đây xử lý đơn giản là gán type)
            }
          }
          return seat
        })
      })

      // Tùy chọn: Có muốn bỏ chọn sau khi sửa không?
      // setSelectedSeatIds([]); // Uncomment nếu muốn reset sau khi chọn
    },
    [selectedSeatIds]
  )

  // --- LOGIC PHỤ: Toggle trạng thái Active/Bảo trì ---
  const toggleSeatStatus = () => {
    setSeats(currentSeats =>
      currentSeats.map(seat =>
        selectedSeatIds.includes(seat.seatNumber)
          ? { ...seat, isAvailable: !seat.isAvailable }
          : seat
      )
    )
  }

  // Helper: Màu sắc theo loại ghế
  const getSeatStyle = (type: string, isAvailable: boolean, isSelected: boolean) => {
    if (isSelected) return 'bg-blue-600 text-white border-blue-700 shadow-md transform scale-105'
    if (!isAvailable) return 'bg-gray-300 text-gray-400 cursor-not-allowed opacity-50'

    switch (type) {
      case 'VIP':
        return 'bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200'
      case 'Ghế đôi':
        return 'bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200'
      default: // Thường
        return 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
    }
  }

  // Render lưới ghế
  const rows = Array.from(new Set(seats.map(s => s.row))).sort()

  return (
    <Card className="mt-4 border-2 border-blue-50/50 shadow-lg animate-in fade-in slide-in-from-top-2 bg-gray-50">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-gray-50/50">
        <div>
          <CardTitle className="text-lg text-blue-950 flex items-center gap-2 ">
            <MousePointer2 className="w-5 h-5" />
            Thiết lập sơ đồ ghế: {room.roomName}
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Chọn ghế bên dưới và sử dụng thanh công cụ để đổi loại ghế (quy định giá vé).
          </p>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 text-gray-900">
          <div className="text-sm font-medium mr-2">
            Đang chọn:{' '}
            <Badge variant="secondary" className="ml-1">
              {selectedSeatIds.length}
            </Badge>{' '}
            ghế
          </div>
          <Button className='bg-gray-50 text-gray-900 hover:bg-gray-300!' size="sm" onClick={onClose}>
            <X className="w-4 h-4 mr-2" /> Đóng
          </Button>
          <Button
            size="sm"
            onClick={() => onSave(seats)}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
          >
            {isSaving ? (
              'Đang lưu...'
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Lưu Thay Đổi
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* TOOLBAR ACTIONS */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 sticky top-0 z-10 bg-white/95 backdrop-blur p-3 rounded-xl border shadow-sm">
          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Cập nhật loại ghế:
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-gray-100 border-gray-200"
              onClick={() => updateSeatType('Thường')}
              disabled={selectedSeatIds.length === 0}
            >
              <div className="w-3 h-3 bg-white border border-gray-400 rounded-sm mr-2"></div> Thường
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-orange-50 border-orange-200 text-orange-700"
              onClick={() => updateSeatType('VIP')}
              disabled={selectedSeatIds.length === 0}
            >
              <div className="w-3 h-3 bg-orange-100 border border-orange-400 rounded-sm mr-2"></div>{' '}
              VIP
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-pink-50 border-pink-200 text-pink-700"
              onClick={() => updateSeatType('Ghế đôi')}
              disabled={selectedSeatIds.length === 0}
            >
              <div className="w-3 h-3 bg-pink-100 border border-pink-400 rounded-sm mr-2"></div> Ghế
              đôi
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2"></div>

          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={toggleSeatStatus}
            disabled={selectedSeatIds.length === 0}
          >
            Bật/Tắt Bảo trì
          </Button>
        </div>

        {/* SCREEN VISUAL */}
        <div className="flex justify-center mb-10">
          <div className="w-2/3 max-w-2xl relative group">
            <div className="absolute -inset-1 bg-blue-400/20 blur-xl rounded-[50%] opacity-0  transition-opacity"></div>
            <div className="h-2 w-full bg-blue-200 rounded-t-[50%] rounded-b-[10%] shadow-[0_10px_20px_rgba(59,130,246,0.2)]"></div>
            <p className="text-center text-xs text-blue-300 font-bold uppercase tracking-[0.3em] mt-3">
              Màn Hình
            </p>
          </div>
        </div>

        {/* SEAT GRID */}
        <div className="flex justify-center overflow-x-auto pb-8">
          <div className="min-w-max mx-auto px-4">
            {rows.map(rowLabel => (
              <div key={rowLabel} className="flex items-center gap-4 mb-3">
                {/* Row Label (Clickable to select row) */}
                <div
                  className="w-8 text-center text-sm font-bold text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSelectRow(rowLabel)}
                  title={`Chọn cả hàng ${rowLabel}`}
                >
                  {rowLabel}
                </div>

                {/* Seats in Row */}
                <div className="flex gap-2">
                  {seats
                    .filter(s => s.row === rowLabel)
                    .sort((a, b) => a.column - b.column)
                    .map(seat => {
                      const isSelected = selectedSeatIds.includes(seat.seatNumber)
                      return (
                        <div
                          key={seat.seatNumber}
                          onClick={() => handleSeatClick(seat.seatNumber)}
                          className={cn(
                            'w-9 h-9 flex items-center justify-center rounded-md border text-xs font-medium cursor-pointer transition-all duration-150 select-none',
                            getSeatStyle(seat.seatType, seat.isAvailable, isSelected)
                          )}
                        >
                          {/* Hiển thị số ghế. Nếu ghế đôi có thể hiển thị icon khác */}
                          {seat.seatType === 'Ghế đôi' ? 'D' + seat.column : seat.column}
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LEGEND */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 pt-6 border-t mt-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-gray-300 bg-white"></div> Thường
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-orange-300 bg-orange-100"></div> VIP
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-pink-300 bg-pink-100"></div> Ghế đôi
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-gray-300 bg-gray-300 opacity-50"></div>{' '}
            Đang bảo trì
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-blue-600 bg-blue-600"></div> Đang chọn
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
