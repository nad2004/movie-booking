'use client'

import { useState, useMemo, useEffect, useRef, MouseEvent as ReactMouseEvent } from 'react'
import Link from 'next/link'
import { MapPin, Search, Loader2, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

// Import API và Types
import type { Theater } from '@/types/theater'
import type { Schedule } from '@/types/schedule'
import type { Movie } from '@/types/movie'
import { useSchedules } from '@/lib/api/schedules'
import { VIETNAM_CITIES } from '@/constants/location'
import MovieShowtimeCard from '@/app/(client)/showtimes/components/MovieShowtimeCard'

interface ShowtimeSectionProps {
  cinemas: Theater[]
}

export function ShowtimeSection({ cinemas }: ShowtimeSectionProps) {
  // --- 1. STATES ---
  const [selectedCity, setSelectedCity] = useState('Hà Nội')
  const [searchCinema, setSearchCinema] = useState('')
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    new Date().toLocaleDateString('vi-VN')
  )

  // **THÊM: States cho drag to scroll**
  const dateScrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // **THÊM: Drag handlers**
  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!dateScrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - dateScrollRef.current.offsetLeft)
    setScrollLeft(dateScrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dateScrollRef.current) return
    e.preventDefault()
    const x = e.pageX - dateScrollRef.current.offsetLeft
    const walk = (x - startX) * 0.7 // Tốc độ scroll
    dateScrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  // --- 2. FILTER CINEMAS ---
  const filteredCinemas = useMemo(() => {
    return cinemas.filter(
      c => c.city === selectedCity && c.name.toLowerCase().includes(searchCinema.toLowerCase())
    )
  }, [cinemas, selectedCity, searchCinema])

  // Auto select rạp đầu tiên khi đổi thành phố
  useEffect(() => {
    async function setCondition() {
      if (filteredCinemas.length > 0) {
        await setSelectedCinemaId(filteredCinemas[0]._id)
      } else {
        await setSelectedCinemaId('')
      }
    }
    setCondition()
  }, [selectedCity, filteredCinemas.length])

  // --- 3. FETCH SCHEDULES ---
  const { data: scheduleData, isFetching: isLoadingSchedules } = useSchedules({
    theaterId: selectedCinemaId,
  })

  const schedules = scheduleData?.schedules || []

  // --- 4. GROUP SCHEDULES BY MOVIE ---
  const groupedData = useMemo(() => {
    if (!schedules) return []

    // 1. Lọc theo ngày (nếu người dùng có chọn ngày trên DateSelector)
    let filtered = schedules
    if (selectedDate) {
      filtered = schedules.filter(s => s.showDate.startsWith(selectedDate))
    }
    interface GroupedMovieSchedule {
      uniqueKey: string
      date: string
      movie: Movie
      schedules: Schedule[]
    }
    // 2. Gom nhóm theo: MOVIE_ID + DATE
    const groups: Record<string, GroupedMovieSchedule> = {}

    filtered.forEach(schedule => {
      // Lấy phần ngày (bỏ giờ). Giả sử showDate là ISO string "2024-11-28T10:00..." hoặc "2024-11-28"
      const dateKey = schedule.showDate.split('T')[0]
      const movieId = schedule.movie._id

      // Tạo key duy nhất kết hợp giữa phim và ngày
      const uniqueKey = `${movieId}_${dateKey}`

      if (!groups[uniqueKey]) {
        groups[uniqueKey] = {
          uniqueKey,
          date: dateKey,
          movie: schedule.movie,
          schedules: [],
        }
      }
      groups[uniqueKey].schedules.push(schedule)
    })

    return Object.values(groups)
  }, [schedules, selectedDate])

  // --- 5. GENERATE DATES (14 days) ---
  const dates = useMemo(() => {
    const days = []
    const today = new Date()

    // Thêm option "Tất cả" với value là undefined hoặc empty string
    days.push({ label: 'Tất cả', displayDate: 'All', value: '' }) // Đổi từ undefined sang ""

    for (let i = 0; i < 12; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const value = date.toLocaleDateString('en-CA')
      const label =
        i === 0 ? 'Hôm nay' : new Intl.DateTimeFormat('vi-VN', { weekday: 'short' }).format(date)
      const displayDate = new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      }).format(date)
      days.push({ value, label, displayDate })
    }
    return days
  }, [])

  return (
    <section className="py-16 bg-background text-foreground overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <h2 className="text-center text-2xl font-semibold mb-8">Lịch chiếu phim</h2>

        <Card className="rounded-3xl border border-border bg-surface shadow-sm p-4 md:p-8 w-full max-w-full overflow-hidden">
          {/* Top Toolbar: Select City & Search */}
          <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[160px] sm:w-[180px] rounded-2xl border-border bg-muted">
                  <SelectValue placeholder="Chọn thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {VIETNAM_CITIES.map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm theo tên rạp..."
                  value={searchCinema}
                  onChange={e => setSearchCinema(e.target.value)}
                  className="w-full bg-muted border-border rounded-full pl-10"
                />
              </div>
            </div>
          </div>

          {/* City Tabs (Quick Select) */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {VIETNAM_CITIES.slice(0, 5).map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 sm:px-6 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
            {/* Left Column: Cinema List */}
            <div className="space-y-3 max-h-[400px] lg:max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredCinemas.length > 0 ? (
                filteredCinemas.map(cinema => (
                  <button
                    key={cinema._id}
                    onClick={() => setSelectedCinemaId(cinema._id)}
                    className={`w-full text-left p-3 sm:p-4 rounded-2xl transition-all border-2 ${
                      selectedCinemaId === cinema._id
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'border-transparent hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          selectedCinemaId === cinema._id
                            ? 'bg-primary text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <span className="font-bold">{cinema.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5
                          className={`truncate font-medium text-sm sm:text-base ${
                            selectedCinemaId === cinema._id ? 'text-primary' : 'text-foreground'
                          }`}
                        >
                          {cinema.name}
                        </h5>
                        <p className="text-xs text-muted-foreground truncate">{cinema.address}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4 text-sm">
                  Không tìm thấy rạp nào.
                </p>
              )}
            </div>

            {/* Right Column: Date & Showtimes */}
            <div className="space-y-6 min-w-0">
              {/* Date Selector - THÊM drag to scroll */}
              <div
                ref={dateScrollRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className={`flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 select-none ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
              >
                {dates.map(date => (
                  <button
                    key={date.value}
                    onClick={() => setSelectedDate(date.value)}
                    className={`flex-shrink-0 w-16 sm:w-20 py-2 sm:py-3 rounded-xl text-center transition-all border ${
                      selectedDate === date.value
                        ? 'bg-primary text-primary-foreground border-primary shadow'
                        : 'bg-muted text-muted-foreground border-transparent hover:bg-primary/10'
                    }`}
                  >
                    <div className="text-[10px] sm:text-xs capitalize opacity-90">{date.label}</div>
                    <div className="font-bold text-sm sm:text-lg">{date.displayDate}</div>
                  </button>
                ))}
              </div>

              {/* Showtimes Content */}
              {selectedCinemaId ? (
                <div className="space-y-4">
                  {isLoadingSchedules ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <p>Đang tải lịch chiếu...</p>
                    </div>
                  ) : groupedData.length > 0 ? (
                    groupedData.map(({ movie, schedules, uniqueKey }) => (
                      <MovieShowtimeCard key={uniqueKey} movie={movie} schedules={schedules} />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                      <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Không có suất chiếu nào vào ngày này.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  Vui lòng chọn một rạp để xem lịch chiếu.
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 sm:mt-10">
            <Button
              asChild
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 rounded-full px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg shadow-md"
            >
              <Link href="/showtimes">Xem tất cả lịch chiếu</Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
