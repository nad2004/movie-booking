'use client'

import { Card } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { Movie, ShowtimeDate } from '@/types/schedule'
import DateSelector from './DateSelector'
import SelectedCinemaHeader from './SelectedCinemaHeader'
import MovieShowtimeCard from './MovieShowtimeCard'

type ShowtimeContentProps = {
  dates: ShowtimeDate[]
  selectedDate: string
  onSelectDate: (date: string) => void
  selectedCinema: string
  movies: Movie[]
}

export default function ShowtimeContent({
  dates,
  selectedDate,
  onSelectDate,
  selectedCinema,
  movies,
}: ShowtimeContentProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DateSelector dates={dates} selectedDate={selectedDate} onSelectDate={onSelectDate} />

      {/* Cinema Info */}
      <Card className="bg-accent/10 border-accent/30 p-3 sm:p-4" style={{ borderRadius: '16px' }}>
        <div className="flex items-center gap-2 text-text-primary">
          <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-accent flex-shrink-0" />
          <span className="text-sm sm:text-base" style={{ fontWeight: 500 }}>
            Nhấn vào suất chiếu để tiến hành mua vé
          </span>
        </div>
      </Card>

      <SelectedCinemaHeader
        cinemaName={selectedCinema}
        // NOTE: Địa chỉ và ngày đang bị hardcode, bạn có thể truyền thêm props nếu cần
        address="Thứ Ba, 04/11/2025 - Tầng 5, MIPEC Tower, số 229 Tây Sơn, phường Ngã Tư Sở, quận Đống Đa, Hà Nội - Bản đồ"
      />

      {/* Movie Showtimes List */}
      <div className="space-y-3 sm:space-y-4">
        {movies.map(movie => (
          <MovieShowtimeCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}
