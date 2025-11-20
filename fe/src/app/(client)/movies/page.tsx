'use client'

import { useState } from 'react'
import PageHeader from '@/app/(client)/movies/components/PageHeader'
import FilterCard from '@/app/(client)/movies/components/FilterCard'
import { TopMovieCarousel } from '@/app/(client)/components/topMovieCarousel'
import { MovieSection } from '@/app/components/shared/movie-section'
import { useMovies } from '@/lib/api/movies'
import { DEFAULT_MOVIE_LIST } from '@/constants'
import { COUNTRIES } from '@/constants/location'
import { useGenres } from '@/lib/api/genres'
import { DEFAULT_GENRE_LIST } from '@/constants'
// --- DỮ LIỆU MOCK (Giữ nguyên) ---

const movieTypes = ['Tất cả', 'Đang chiếu', 'Sắp chiếu']
const ratings = ['P (mọi lứa tuổi)', 'C13 (13+)', 'C16 (16+)', 'C18 (18+)']
const sortOptions = ['Mới nhất', 'Mới cập nhật', 'Điểm IMDb', 'Lượt xem']

export default function PhimLoc() {
  const {
    data: listMovies = DEFAULT_MOVIE_LIST,
    isLoading,
    error,
  } = useMovies({ page: 1, limit: 10 })
  const { data: listGenres = DEFAULT_GENRE_LIST } = useGenres()
  // Lọc trùng thể loại
  const uniqueGenres = Array.from(new Set(listGenres.map(genre => genre.name)))

  const [showFilters, setShowFilters] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('Tất cả')
  const [selectedType, setSelectedType] = useState('Tất cả')
  const [selectedRating, setSelectedRating] = useState('Tất cả')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState('Tất cả')
  const [customYear, setCustomYear] = useState('')
  const [selectedSort, setSelectedSort] = useState('Mới nhất')

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre))
    } else {
      setSelectedGenres([...selectedGenres, genre])
    }
  }

  const scrollTopMovies = (direction: 'left' | 'right') => {
    const container = document.getElementById('top-movies-slider')
    if (container) {
      const scrollAmount = 300
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount
      } else {
        container.scrollLeft += scrollAmount
      }
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <PageHeader
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {showFilters && (
          <FilterCard
            countries={COUNTRIES}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            movieTypes={movieTypes}
            selectedType={selectedType}
            onSelectType={setSelectedType}
            ratings={ratings}
            selectedRating={selectedRating}
            onSelectRating={setSelectedRating}
            genres={uniqueGenres} // Dùng mảng đã lọc
            selectedGenres={selectedGenres}
            onToggleGenre={toggleGenre}
            customYear={customYear}
            onSetCustomYear={setCustomYear}
            sortOptions={sortOptions}
            selectedSort={selectedSort}
            onSelectSort={setSelectedSort}
            onClose={() => setShowFilters(false)}
          />
        )}

        <TopMovieCarousel title="🔥 Top Movies" movies={listMovies.movies.slice(0, 5)} />
        <MovieSection
          title={`📽️ Tất cả phim (${listMovies.movies.length} phim)`}
          movies={listMovies.movies.slice(0, 5)}
          viewAllHref="/movies?filter=coming-soon"
        />
      </div>
    </div>
  )
}
