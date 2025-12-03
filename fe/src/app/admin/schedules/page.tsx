'use client'

import { useRouter, useSearchParams } from 'next/navigation' // [Mới]
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { useSchedules } from '@/lib/api/schedules'
import { useScheduleMutations } from './hooks/useScheduleMutations'
import { ScheduleTable } from './components/ScheduleTable'
// import { ScheduleStats } from './components/ScheduleStats';
import { ScheduleFormDialog } from './components/ScheduleFormDialog'
import { Schedule } from '@/types/schedule'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
// [Mới] Import components phân trang
import { CustomPagination, PaginationInfo } from '@/app/components/shared/custom-pagination'

export default function ScheduleManagementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // [Mới] Lấy page từ URL
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10)
  const itemsPerPage = 10 // Giảm limit xuống để test phân trang

  // State
  const [date, setDate] = useState<Date | undefined>(new Date())
  // [Mới] State page
  const [currentPage, setCurrentPage] = useState(pageFromUrl)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [scheduleToEdit, setScheduleToEdit] = useState<Schedule | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Sync URL to State
  useEffect(() => {
    setCurrentPage(pageFromUrl)
  }, [pageFromUrl])

  // Convert Date object sang YYYY-MM-DD để gọi API
  const formattedDate = date ? date.toLocaleDateString('en-CA') : undefined

  // Fetch API
  const { data: scheduleData, isLoading } = useSchedules({
    date: formattedDate,
    page: currentPage, // [Mới]
    limit: itemsPerPage, // [Mới]
  })

  // [Mới] Lấy thông tin phân trang từ API
  const totalPages = scheduleData?.pagination?.totalPages || 1
  const totalItems = scheduleData?.pagination?.totalItems || 0

  const { deleteMutation } = useScheduleMutations()

  // [Mới] Helper update URL
  const updateUrlParams = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateUrlParams(page)
    // Scroll nhẹ lên đầu phần bảng (nếu cần)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // [Mới] Xử lý khi chọn ngày -> Reset về trang 1
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    if (currentPage !== 1) {
      setCurrentPage(1)
      updateUrlParams(1)
    }
  }

  const handleAdd = () => {
    setScheduleToEdit(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (schedule: Schedule) => {
    setScheduleToEdit(schedule)
    setIsDialogOpen(true)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) })
    }
  }

  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-gray-900 text-3xl font-bold">Quản Lý Lịch Chiếu</h1>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="w-4 h-4" /> Thêm Lịch Chiếu
          </Button>
        </div>

        {/* Stats (Commented out in original code) */}
        {/* <ScheduleStats /> */}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Cột Trái: Chọn Ngày */}
          <Card className="bg-white border-gray-200 p-4 h-fit shadow-sm">
            <div className="flex mb-2">
              <h3 className="text-gray-900 font-semibold mb-4 px-2 flex-1">Chọn Ngày Chiếu</h3>
              <Button
                className=" bg-gray-50 text-gray-900 hover:bg-gray-200 "
                onClick={() => handleDateChange(undefined)}
              >
                Tất cả
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange} // Sử dụng handler mới
              className="rounded-md border border-gray-100 w-full bg-gray-50 text-gray-950"
            />
          </Card>

          {/* Cột Phải: Bảng Lịch Chiếu */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="bg-white border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-gray-900 font-bold">
                  Danh sách lịch chiếu {date ? `- ${date.toLocaleDateString('vi-VN')}` : ''}
                </h3>
              </div>
              <ScheduleTable
                schedules={scheduleData?.schedules || []}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={id => setDeleteId(id)}
              />
            </Card>

            {/* [Mới] Phần phân trang */}
            <div className="pt-4">
              <PaginationInfo
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />

              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showPageNumbers={5}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ScheduleFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        scheduleToEdit={scheduleToEdit}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-gray-50 text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-300! hover:text-gray-800!">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}