// app/(admin)/shift-manager/components/work-planning-tab.tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sparkles,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns'
import { vi } from 'date-fns/locale'

// Imports Modals & API
import GenerateScheduleModal from './modals/generate-schedule-modal'
import ConfirmDeleteAlert from './modals/confirm-delete-alert'
import { useWorkSchedules, useWorkScheduleMutations } from '@/lib/api/work-schedules'
import { WorkSchedule } from '@/types/work-schedule'
import { useTheaters } from '@/lib/api/theaters'
export default function WorkPlanningTab() {
  // --- 1. State Quản lý ---
  const [isGenerateOpen, setGenerateOpen] = useState(false)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null)

  // State Filter
  const [selectedTheaterId, setSelectedTheaterId] = useState<string>('69198f14b80a32bf8ea5d91c') // Default Theater ID (cần sửa lại logic lấy dynamic)
  const [currentDate, setCurrentDate] = useState(new Date())

  // --- 2. Tính toán ngày tháng ---
  // Lấy ngày đầu và cuối của view lịch (bao gồm cả ngày của tháng trước/sau nếu tuần vắt qua)
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Bắt đầu từ Thứ 2
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  // Format params cho API
  const apiFromDate = format(startDate, 'yyyy-MM-dd')
  const apiToDate = format(endDate, 'yyyy-MM-dd')

  // --- 3. API Hooks ---
  const { data: schedules = [], isLoading } = useWorkSchedules({
    theaterId: selectedTheaterId,
    from: apiFromDate,
    to: apiToDate,
  })
  const { data: theaters } = useTheaters({})
  const { remove } = useWorkScheduleMutations()

  // --- 4. Handlers ---
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  const handleDeleteClick = (id: string) => {
    setSelectedScheduleId(id)
    setDeleteAlertOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedScheduleId) {
      await remove.mutateAsync(selectedScheduleId)
      setDeleteAlertOpen(false)
    }
  }

  // --- 5. Helper Render Card Lịch ---
  // Hàm chọn màu dựa trên tên ca (hoặc logic khác tùy bạn)
  const getShiftColor = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('sáng')) return 'border-l-blue-500 bg-blue-50 text-blue-700'
    if (lowerName.includes('chiều')) return 'border-l-orange-500 bg-orange-50 text-orange-700'
    if (lowerName.includes('tối') || lowerName.includes('đêm'))
      return 'border-l-purple-500 bg-purple-50 text-purple-700'
    return 'border-l-gray-500 bg-gray-50 text-gray-700'
  }

  const renderCalendarGrid = () => {
    if (isLoading) {
      return (
        <div className="col-span-7 h-96 flex items-center justify-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mr-2" /> Đang tải lịch...
        </div>
      )
    }

    return calendarDays.map((day, dayIdx) => {
      const dateKey = format(day, 'yyyy-MM-dd')
      // Filter lịch cho ngày này
      const daySchedules = schedules.filter(s => s.date === dateKey)

      // Style cho ngày không thuộc tháng hiện tại
      const isCurrentMonth = isSameMonth(day, monthStart)
      const dayClass = isCurrentMonth ? 'bg-white text-gray-900' : 'bg-gray-50/50 text-gray-400'
      const todayClass = isToday(day) ? 'bg-indigo-50/30 ring-1 ring-inset ring-indigo-200' : ''

      return (
        <div
          key={day.toString()}
          className={`min-h-[140px] border border-gray-100 rounded-xl p-2 flex flex-col gap-1.5 transition-all hover:shadow-md hover:border-indigo-100 group/cell ${dayClass} ${todayClass}`}
        >
          {/* Header Ngày */}
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm font-semibold ${isToday(day) ? 'text-indigo-600' : ''}`}>
              {format(day, 'dd/MM')}
            </span>
          </div>

          {/* Empty State */}
          {daySchedules.length === 0 && isCurrentMonth && (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg opacity-0 group-hover/cell:opacity-100 transition-opacity">
              <span className="text-[10px] text-gray-300 select-none">Trống</span>
            </div>
          )}

          {/* List Schedules */}
          <div className="space-y-1.5">
            {daySchedules.map((sch: WorkSchedule) => {
              const colorClass = getShiftColor(sch.shiftTemplateId.name)
              return (
                <div
                  key={sch._id}
                  className={`relative group/item pl-2 py-1.5 pr-6 rounded-lg border border-l-4 text-xs ${colorClass} transition-all`}
                >
                  <div className="font-bold truncate">{sch.shiftTemplateId.name}</div>
                  <div className="opacity-80 text-[10px] mt-0.5">
                    {sch.shiftTemplateId.startTime} - {sch.shiftTemplateId.endTime}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleDeleteClick(sch._id)
                    }}
                    className="absolute top-1 right-1 opacity-0 group-hover/item:opacity-100 p-1 hover:bg-white/80 rounded-full hover:text-red-500 transition-all cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <Card className="p-4 rounded-2xl border-gray-100 shadow-sm bg-white">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-3 items-center w-full md:w-auto">
            {/* Theater Select */}
            <Select value={selectedTheaterId} onValueChange={setSelectedTheaterId}>
              <SelectTrigger className="w-[220px] rounded-xl bg-gray-50 border-gray-200 focus:ring-[#6C63FF]">
                <SelectValue placeholder="Chọn rạp" />
              </SelectTrigger>
              <SelectContent>
                <SelectContent>
                  {theaters?.theaters.map(t => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectContent>
            </Select>

            {/* Month Navigation */}
            <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-200 select-none">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </Button>
              <div className="px-3 text-sm font-semibold text-gray-700 flex items-center gap-2 min-w-[140px] justify-center">
                <CalendarIcon className="w-4 h-4 text-[#6C63FF]" />
                <span className="capitalize">
                  {format(currentDate, 'MMMM, yyyy', { locale: vi })}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          </div>

          <Button
            onClick={() => setGenerateOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md shadow-amber-200 transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Sinh Lịch Tự Động
          </Button>
        </div>
      </Card>

      {/* Calendar Grid Container */}
      <div className="grid grid-cols-7 gap-3">
        {/* Header Thứ */}
        {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map((d, i) => (
          <div
            key={i}
            className="text-center text-sm font-medium text-gray-400 py-2 uppercase tracking-wide"
          >
            {d}
          </div>
        ))}

        {/* Render Cells */}
        {renderCalendarGrid()}
      </div>

      {/* Modals */}
      <GenerateScheduleModal open={isGenerateOpen} onOpenChange={setGenerateOpen} />

      <ConfirmDeleteAlert
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
