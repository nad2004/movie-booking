'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Clock, Loader2, MapPin, CalendarDays } from 'lucide-react'
import DateSelector from './DateSelector'
import SelectedCinemaHeader from './SelectedCinemaHeader'
import MovieShowtimeCard from './MovieShowtimeCard'
import type { Theater } from '@/types/theater'
import type { Schedule } from '@/types/schedule'
import type { Movie } from '@/types/movie'

type ShowtimeContentProps = {
  selectedDate: string | undefined
  onSelectDate: (date: string) => void
  selectedCinema: Theater | null
  schedules: Schedule[]
  checkCinema: boolean
  isLoading?: boolean
}

type GroupedMovie = {
  movie: Movie;
  schedules: Schedule[];
}

export default function ShowtimeContent({
  selectedDate,
  onSelectDate,
  selectedCinema,
  schedules,
  checkCinema,
  isLoading = false,
}: ShowtimeContentProps) {

  const filteredSchedules = useMemo(() => {
    if (!selectedDate) return [];
    return schedules.filter(s => s.showDate.startsWith(selectedDate)); 
  }, [schedules, selectedDate]);

  // 2. Gom nhóm theo phim
  const groupedMovies = useMemo(() => {
    const groups: Record<string, GroupedMovie> = {};

    filteredSchedules.forEach(schedule => {
      const movieId = schedule.movie._id;
      if (!groups[movieId]) {
        groups[movieId] = {
          movie: schedule.movie,
          schedules: []
        };
      }
      groups[movieId].schedules.push(schedule);
    });

    return Object.values(groups);
  }, [filteredSchedules]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Date Selector không cần truyền dates cứng nữa */}
      <DateSelector selectedDate={selectedDate} onSelectDate={onSelectDate} />

      <Card className="bg-accent/10 border-accent/30 p-3 sm:p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-text-primary">
          <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-accent flex-shrink-0" />
          <span className="text-sm sm:text-base font-medium">
            Lịch chiếu có thể thay đổi. Vui lòng kiểm tra kỹ trước khi đặt vé.
          </span>
        </div>
      </Card>

      {/* --- LOGIC HIỂN THỊ CHÍNH --- */}
      
      {/* 1. Chưa chọn Rạp */}
      {(!checkCinema || !selectedCinema) ? (
        <div className="text-center py-16 bg-surface border border-border rounded-2xl flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center">
             <MapPin className="w-8 h-8 text-text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">Chưa chọn rạp chiếu</h3>
            <p className="text-text-secondary">Vui lòng chọn khu vực và rạp để xem lịch chiếu.</p>
          </div>
        </div>
      ) : 
      /* 2. Đã chọn Rạp nhưng Chưa chọn Ngày */
      (!selectedDate) ? (
        <div className="text-center py-16 bg-surface border border-border rounded-2xl flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
           <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
             <CalendarDays className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">Vui lòng chọn ngày chiếu</h3>
            <p className="text-text-secondary">Chọn một ngày ở trên để xem các suất chiếu có sẵn.</p>
          </div>
        </div>
      ) :
      /* 3. Đã chọn đủ -> Hiển thị list */
      (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-4">
          <SelectedCinemaHeader
            cinemaName={selectedCinema.name || ''}
            address={selectedCinema.address || ''}
          />

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : groupedMovies.length > 0 ? (
            <div className="space-y-4">
              {groupedMovies.map(({ movie, schedules }) => (
                <MovieShowtimeCard 
                  key={movie._id} 
                  movie={movie} 
                  schedules={schedules} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface border border-border border-dashed rounded-2xl">
              <p className="text-text-secondary">Không tìm thấy suất chiếu nào vào ngày này.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}