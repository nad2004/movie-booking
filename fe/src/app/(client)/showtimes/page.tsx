'use client'

import { useState, useEffect } from 'react'
import type { Movie } from '@/types/movie'
import type { Theater } from '@/types/theater'
import { useMovies } from '@/lib/api/movies'
import { useTheaters } from '@/lib/api/theaters'
import PageHeader from '@/app/(client)/showtimes/components/PageHeader'
import FilterSidebar from '@/app/(client)/showtimes/components/FilterSidebar'
import ShowtimeContent from '@/app/(client)/showtimes/components/ShowtimeContent'
import { DEFAULT_MOVIE_LIST, DEFAULT_THEATER_LIST } from '@/constants'

export default function LichChieuHomNay() {
  // 1. Dữ liệu giả lập - Ngày tháng
  const dates = ['4/11', '5/11', '6/11', '7/11', '8/11', '9/11', '10/11']
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDate, setSelectedDate] = useState('4/11')
   // 2. Lấy dữ liệu từ API
  const { data: movieData = DEFAULT_MOVIE_LIST } = useMovies({ page: 1, limit: 20 })
  const { data: theaterData = DEFAULT_THEATER_LIST, error, isLoading } = useTheaters({city: selectedCity})

  const movies: Movie[] = movieData ? movieData.movies : []
  const theaters: Theater[] = theaterData ? theaterData.theaters : []
    // Thay đổi quan trọng: State này chỉ lưu khi người dùng TỰ TAY chọn. 
  // Mặc định là null.
  const [manualCinema, setManualCinema] = useState<Theater | null>(null)

  const activeCinema = manualCinema || theaters[0] || null;

  // 5. Xử lý Side Effect (Chỉ dùng để log lỗi, KHÔNG set state logic ở đây)
  useEffect(() => {
    if (error) {
      console.error("Error fetching theaters:", error);
    }
  }, [error])

  // Hàm wrapper để reset rạp khi đổi thành phố (nếu cần logic này)
  const handleSelectCity = (city: string) => {
      setSelectedCity(city);
      setManualCinema(null); // Reset về rạp đầu tiên của thành phố mới
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PageHeader
          title="📅 Lịch chiếu phim hôm nay"
          subtitle="Xem lịch chiếu phim theo rạp, suất chiếu và định dạng phim"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-4 lg:gap-6">
          {/* Kiểm tra activeCinema có tồn tại không để tránh lỗi render */}
          
             <>
                <FilterSidebar
                  selectedCity={selectedCity}
                  onSelectCity={handleSelectCity}
                  currentCinemas={theaters}
                  selectedCinema={activeCinema} 
                  onSelectCinema={setManualCinema} 
                  isLoading={isLoading}
                />

                <ShowtimeContent
                  dates={dates}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  selectedCinema={activeCinema} // Truyền giá trị đã tính toán
                  movies={movies}
                  checkCinema={activeCinema !== null}
                />
             </>
         
        </div>
      </div>
    </div>
  )
}