'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Sparkles, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// Định nghĩa Props cần thiết
interface PlanningToolbarProps {
  theaters: any[] | undefined // Hoặc type cụ thể nếu có
  selectedTheaterId: string
  onTheaterChange: (val: string) => void
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onGenerate: () => void
}

export default function PlanningToolbar({
  theaters,
  selectedTheaterId,
  onTheaterChange,
  currentDate,
  onPrevMonth,
  onNextMonth,
  onGenerate,
}: PlanningToolbarProps) {
  const formattedMonth = format(currentDate, 'MMMM, yyyy', { locale: vi })

  return (
    <Card className="p-4 rounded-2xl border-gray-100 shadow-sm bg-white">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-3 items-center w-full md:w-auto">
          {/* Theater Select */}
          <Select value={selectedTheaterId} onValueChange={onTheaterChange}>
            <SelectTrigger className="w-[220px] rounded-xl bg-gray-50 border-gray-200 focus:ring-[#6C63FF]">
              <SelectValue placeholder="Chọn rạp" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {theaters?.map((t: any) => (
                <SelectItem key={t._id} value={t._id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month Navigation */}
          <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-200 select-none">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevMonth}
              className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </Button>
            <div className="px-3 text-sm font-semibold text-gray-700 flex items-center gap-2 min-w-[140px] justify-center">
              <CalendarIcon className="w-4 h-4 text-[#6C63FF]" />
              <span className="capitalize">{formattedMonth}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNextMonth}
              className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </div>

        <Button
          onClick={onGenerate}
          className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md shadow-amber-200 transition-transform active:scale-95"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Sinh Lịch Tự Động
        </Button>
      </div>
    </Card>
  )
}
