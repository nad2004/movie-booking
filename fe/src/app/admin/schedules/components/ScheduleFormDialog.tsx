'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Schedule } from '@/types/schedule'
import { useScheduleMutations } from '../hooks/useScheduleMutations'
import { Loader2 } from 'lucide-react'
import { TheaterComboboxForm } from '@/app/admin/components/TheaterComboboxForm'
import type { Movie } from '@/types/movie'
import type { Theater } from '@/types/theater'

interface ScheduleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  scheduleToEdit?: Schedule | null
  // [Mới] Nhận dữ liệu từ cha
  movies: Movie[] // Nên thay bằng Type Movie[] chuẩn
  theaters: Theater[] // Nên thay bằng Type Theater[] chuẩn
  isReferenceLoading: boolean
  isReferenceError: boolean
}

export function ScheduleFormDialog({
  open,
  onOpenChange,
  scheduleToEdit,
  movies,
  theaters,
  isReferenceLoading,
  isReferenceError
}: ScheduleFormDialogProps) {
  const { createMutation, updateMutation } = useScheduleMutations()

  // Loading khi submit form
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      movieId: '',
      theaterId: '',
      roomId: '',
      roomName: '',
      showDate: '',
      startTime: '',
      endTime: '',
      standardPrice: 80000,
      vipPrice: 100000,
      couplePrice: 180000,
    },
  })

  // Tìm Rạp và Phòng dựa trên props `theaters`
  const selectedTheaterId = watch('theaterId')
  const currentTheater = theaters.find(t => t._id === selectedTheaterId)
  const rooms = currentTheater?.rooms || []

  useEffect(() => {
    if (scheduleToEdit) {
      setValue('movieId', scheduleToEdit.movie._id)
      setValue('theaterId', scheduleToEdit.theater._id)
      // Logic set các giá trị khác giữ nguyên
      setValue('roomId', scheduleToEdit.room.roomName) 
      setValue('showDate', new Date(scheduleToEdit.showDate).toISOString().split('T')[0])
      setValue('startTime', scheduleToEdit.startTime)
      setValue('endTime', scheduleToEdit.endTime)
      setValue('standardPrice', scheduleToEdit.ticketPrices.standard)
      setValue('vipPrice', scheduleToEdit.ticketPrices.vip || 0)
    } else {
      reset()
    }
  }, [scheduleToEdit, open, reset, setValue])

  const onSubmit = (data: any) => {
    const selectedMovie = movies.find(m => m._id === data.movieId)
    const selectedRoom = rooms.find((r: any) => r.roomName === data.roomName) || {
      roomName: 'Phòng 1',
      roomType: '2D',
    }

    const payload: any = {
      movieId: data.movieId,
      theaterId: data.theaterId,
      roomId: data.roomId, // Lưu ý check lại logic ID vs Name
      roomName: selectedRoom.roomName,
      roomType: '2D',
      showDate: data.showDate,
      startTime: data.startTime,
      endTime: data.endTime,
      ticketPrices: {
        standard: Number(data.standardPrice),
        vip: Number(data.vipPrice),
        couple: Number(data.couplePrice),
      },
      language: selectedMovie?.language || 'English',
      subtitles: selectedMovie?.subtitles || ['Vietnamese'],
      status: 'Sắp chiếu',
    }

    if (scheduleToEdit) {
      updateMutation.mutate(
        { id: scheduleToEdit._id, data: payload },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createMutation.mutate(payload, { onSuccess: () => onOpenChange(false) })
    }
  }
  if (isReferenceError){
    return <>
    Lỗi!
    </>
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gray-50 text-gray-900 transition-all">
        <DialogHeader>
          <DialogTitle>
            {scheduleToEdit ? 'Cập Nhật Lịch Chiếu' : 'Thêm Lịch Chiếu Mới'}
          </DialogTitle>
        </DialogHeader>

        {/* [Mới] Kiểm tra Loading Data */}
        {isReferenceLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-sm text-gray-500 font-medium">Đang tải dữ liệu phim và rạp...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Chọn Phim */}
            <div className="space-y-2">
              <Label>Phim</Label>
              <Select onValueChange={val => setValue('movieId', val)} defaultValue={watch('movieId')}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phim..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-100 text-gray-900/90 max-h-[300px] overflow-y-auto">
                  {movies.map(m => (
                    <SelectItem key={m._id} value={m._id}>
                      {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chọn Rạp */}
            <div className="space-y-2">
              <Label>Rạp</Label>
              <TheaterComboboxForm
                theaters={theaters}
                value={watch('theaterId')} 
                onValueChange={val => setValue('theaterId', val)}
                placeholder="Chọn rạp chiếu..."
                searchPlaceholder="Tìm kiếm rạp..."
                showAllOption={false}
              />
            </div>

            {/* Chọn Phòng */}
            <div className="space-y-2">
              <Label>Phòng Chiếu</Label>
              <Select
                onValueChange={val => setValue('roomId', val)}
                defaultValue={watch('roomId')}
                disabled={!selectedTheaterId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-100 text-gray-900/90 max-h-[300px] overflow-y-auto">
                  {rooms.length > 0 ? (
                    rooms.map((r: any) => (
                      <SelectItem key={r._id} value={r._id}>
                        {r.roomName} ({r.roomType})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="mock_room_1">Phòng 1 (2D) - Mock</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Ngày Giờ */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày Chiếu</Label>
                <Input type="date" {...register('showDate')} />
              </div>
              <div className="space-y-2">
                <Label>Giờ Bắt Đầu</Label>
                <Input type="time" {...register('startTime')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Giờ Kết Thúc (Dự kiến)</Label>
              <Input type="time" {...register('endTime')} />
            </div>

            {/* Giá Vé */}
            <div className="grid grid-cols-3 gap-4 bg-gray-100 text-gray-900/90">
              <div className="space-y-2">
                <Label>Giá Thường</Label>
                <Input type="number" {...register('standardPrice')} />
              </div>
              <div className="space-y-2">
                <Label>Giá VIP</Label>
                <Input type="number" {...register('vipPrice')} />
              </div>
              <div className="space-y-2 ">
                <Label>Giá Couple</Label>
                <Input className="" type="number" {...register('couplePrice')} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Lưu Lịch'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}