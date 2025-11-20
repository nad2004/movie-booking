'use client'

import { useState } from 'react'
import PageHeader from '@/app/(client)/movies/components/PageHeader'
import FilterCard from '@/app/(client)/movies/components/FilterCard'
import { TopMovieCarousel } from '@/app/(client)/components/topMovieCarousel'
import { MovieSection } from '@/app/components/shared/movie-section'
import { useMovies } from '@/lib/api/movies'
import { DEFAULT_MOVIE_LIST } from '@/constants'
// --- DỮ LIỆU MOCK (Giữ nguyên) ---
const countries = [
  'Tất cả',
  'Anh',
  'Canada',
  'Hàn Quốc',
  'Hồng Kông',
  'Mỹ',
  'Nhật Bản',
  'Pháp',
  'Thái Lan',
  'Trung Quốc',
  'Úc',
  'Đài Loan',
  'Đức',
]
const movieTypes = ['Tất cả', 'Đang chiếu', 'Sắp chiếu']
const ratings = [
  'Tất cả',
  'P (mọi lứa tuổi)',
  'K (dưới 13 tuổi)',
  'T13 (13+)',
  'T16 (16+)',
  'T18 (18+)',
]

// Dữ liệu gốc với các thể loại lặp
const genresList = [
  'Anime',
  'Bí Ẩn',
  'Chiến Tranh',
  'Chiếu Rạp',
  'Chính Kịch',
  'Hài',
  'Hành Động',
  'Lãng Mạn',
  'Kinh Dị',
  'Tâm Lý',
  'Phiêu Lưu',
  'Siêu Anh Hùng',
  'Viễn Tưởng',
  'Võ Thuật',
  'Cách Mạng',
  'Cổ Trang',
  'Cổ Điển',
  'DC',
  'Disney',
  'Gay Cần',
  'Gia Đình',
  'Giáng Sinh',
  'Giả Tưởng',
  'Hoạt Hình',
  'Hài',
  'Hành Động',
  'Học Đường',
  'Khoa Học',
  'Kinh Dị',
  'Kinh Điển',
  'Kịch Nói',
  'Ký Án',
  'LGBT+',
  'Live Action',
  'Lãng Mạn',
  'Lịch Sử',
  'Marvel',
  'Miền Viễn Tây',
  'Nghệ Nghiệp',
  'Người Mẫu',
  'Nhạc Kịch',
  'Phiêu Lưu',
  'Phép Thuật',
  'Siêu Anh Hùng',
  'Thần Thoại',
  'Thể Thao',
  'Trinh Thám',
  'Truyền Hình Trực Tiếp',
  'Tuổi Trẻ',
  'Tài Liệu',
  'Tâm Lý',
  'Tình Cảm',
  'Tập Luyện',
  'Văn Tưởng',
  'Võ Thuật',
  'Xuyên Không',
  'Đau Thương',
  'Đời Thường',
  'Âm Nhạc',
]
// ✨ GIẢI PHÁP: Tạo mảng không lặp để dùng cho key
const uniqueGenres = [...new Set(genresList)]

const versions = [
  'Tất cả',
  'Phụ đề',
  'Lồng tiếng',
  'Thuyết minh giọng Bắc',
  'Thuyết minh giọng Nam',
]
const years = [
  'Tất cả',
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
  '2016',
  '2015',
  '2014',
  '2013',
  '2012',
  '2011',
  '2010',
]
const sortOptions = ['Mới nhất', 'Mới cập nhật', 'Điểm IMDb', 'Lượt xem']

export default function PhimLoc() {
  const {
    data: listMovies = DEFAULT_MOVIE_LIST,
    isLoading,
    error,
  } = useMovies({ page: 1, limit: 10 })

  const [showFilters, setShowFilters] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('Tất cả')
  const [selectedType, setSelectedType] = useState('Tất cả')
  const [selectedRating, setSelectedRating] = useState('Tất cả')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedVersion, setSelectedVersion] = useState('Tất cả')
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
            countries={countries}
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
            versions={versions}
            selectedVersion={selectedVersion}
            onSelectVersion={setSelectedVersion}
            years={years}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
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
