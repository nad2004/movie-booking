'use client'

import { useState } from 'react'
// Import các kiểu dữ liệu
import { City, CinemaChain, Movie, ShowtimeDate } from '@/types/schedule'

// Import các component con
import PageHeader from '@/app/(client)/showtimes/components/PageHeader'
import FilterSidebar from '@/app/(client)/showtimes/components/FilterSidebar'
import ShowtimeContent from '@/app/(client)/showtimes/components/ShowtimeContent'


const movies: Movie[] = [
  {
    id: 1,
    title: 'Phá Đảm Sinh Nhật Mẹ',
    poster:
      'https://images.unsplash.com/photo-1594908900066-3f47337549d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    genre: "Comedy, Mom's Birthday Party",
    duration: 'T16',
    rating: '16+',
    format: '2D Phụ Đề Anh',
    showtimes: ['08:45', '10:45', '12:45', '14:45', '16:45', '18:45', '22:45'],
    highlight: true,
  },
  // ...
]

const dates: ShowtimeDate[] = [
  { date: '4/11', day: 'Th 3' },
  { date: '5/11', day: 'Th 4' },
  // ...
]
// --- KẾT THÚC DỮ LIỆU MOCK ---

export default function LichChieuHomNay() {
  const [selectedCity, setSelectedCity] = useState('hanoi')
  const [selectedCinema, setSelectedCinema] = useState('Beta Tây Sơn')
  const [selectedDate, setSelectedDate] = useState('4/11')

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader
          title="📅 Lịch chiếu phim hôm nay"
          subtitle="Xem lịch chiếu phim theo rạp, suất chiếu và định dạng phim"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-4 lg:gap-6">
          <FilterSidebar
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            currentCinemas={[]}
            selectedCinema={selectedCinema}
            onSelectCinema={setSelectedCinema}
          />

          <ShowtimeContent
            dates={dates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedCinema={selectedCinema}
            movies={movies}
          />
        </div>
      </div>
    </div>
  )
}
