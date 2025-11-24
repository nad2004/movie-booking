'use client'

import { useState } from 'react'
import PageHeader from '@/app/(client)/movies/components/PageHeader'
import FilterCard from '@/app/(client)/movies/components/FilterCard'
import { TopMovieCarousel } from '@/app/(client)/components/topMovieCarousel'
import { MovieSection } from '@/app/components/shared/movie-section'
import { useMovies, GetMoviesParams } from '@/lib/api/get/movies'
import { DEFAULT_MOVIE_LIST } from '@/constants'
import { COUNTRIES } from '@/constants/location'
import { useGenres } from '@/lib/api/get/genres'
import { DEFAULT_GENRE_LIST } from '@/constants'

// --- CONSTANTS UI ---
const movieTypes = ['Tất cả', 'Đang chiếu', 'Sắp chiếu']
const ratings = ['P', 'C13', 'C16', 'C18']
const sortOptions = ['Mới nhất', 'Mới cập nhật', 'Điểm IMDb', 'Lượt xem']

export default function PhimLoc() {
  // --- 1. DRAFT STATE (Dữ liệu trên UI - Chưa gửi API) ---
  const [showFilters, setShowFilters] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('Tất cả')
  const [selectedType, setSelectedType] = useState('Tất cả')
  const [selectedRating, setSelectedRating] = useState('P')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState('Tất cả')
  const [customYear, setCustomYear] = useState('')
  const [selectedSort, setSelectedSort] = useState('Mới nhất')

  const { data: listGenres = DEFAULT_GENRE_LIST } = useGenres()
  
  // Lấy danh sách thể loại unique
  const uniqueGenres = Array.from(new Set(listGenres.map(genre => genre.name)))

  // --- 2. APPLIED STATE (Dữ liệu thật sự gửi đi API) ---
  // Mặc định ban đầu là load trang 1, limit 12
  const [queryParams, setQueryParams] = useState<GetMoviesParams>({
    page: 1,
    limit: 12,
    sortBy: 'releaseDate',
    order: 'desc'
  })

  // --- 3. FETCH DATA (Dựa trên queryParams) ---
  const { 
    data: listMovies = DEFAULT_MOVIE_LIST, 
    isLoading, // Lấy trạng thái loading từ đây
    isFetching // Lấy thêm isFetching để biết khi nào đang refetch lại
  } = useMovies(queryParams)

  const { data: topMoviesData = DEFAULT_MOVIE_LIST } = useMovies({ 
    page: 1, limit: 10, sortBy: 'view_count', order: 'desc' 
  })

  // --- 4. LOGIC XỬ LÝ KHI BẤM NÚT "LỌC KẾT QUẢ" ---
  const handleApplyFilter = () => {
    const params: GetMoviesParams = {
      page: 1,
      limit: 12,
      sortBy: selectedSort === 'Mới nhất' ? 'releaseDate' : 'view_count' ,
      order: 'desc',
      rating: selectedRating === 'P' ? undefined : selectedRating,
      status: selectedType === 'Tất cả' ? undefined : (selectedType === 'Đang chiếu' ? 'showing' : 'coming_soon'),
      year: selectedYear === 'Tất cả' ? undefined : parseInt(selectedYear, 10),
      country: selectedCountry === 'Tất cả' ? undefined : selectedCountry,
      genres:  selectedGenres.length === 0 ? undefined : selectedGenres.join(','),
    }

    // A. Xử lý Genres
    if (selectedGenres.length > 0) {
      params.genres = selectedGenres.join(',')
    }

    // B. Xử lý Quốc gia
    if (selectedCountry !== 'Tất cả') {
      params.country = selectedCountry
    }

    // C. Xử lý Loại phim
    if (selectedType === 'Đang chiếu') params.status = 'showing'
    if (selectedType === 'Sắp chiếu') params.status = 'coming_soon'

    // D. Xử lý Độ tuổi
    // if (selectedRating !== 'Tất cả') {
    //   const ageMatch = selectedRating.match(/\d+/)
    //   if (ageMatch) {
    //     params.minAge = parseInt(ageMatch[0], 10)
    //   } else if (selectedRating.startsWith('P')) {
    //     params.minAge = 0
    //   }
    // }

    // E. Xử lý Năm
    if (customYear) {
      params.year = parseInt(customYear, 10)
    } else if (selectedYear !== 'Tất cả') {
      params.year = parseInt(selectedYear, 10)
    }

    // F. Xử lý Sắp xếp
    switch (selectedSort) {
      case 'Mới nhất': params.sortBy = 'releaseDate'; params.order = 'desc'; break
      case 'Mới cập nhật': params.sortBy = 'createdAt'; params.order = 'desc'; break
      case 'Điểm IMDb': params.sortBy = 'vote_average'; params.order = 'desc'; break
      case 'Lượt xem': params.sortBy = 'view_count'; params.order = 'desc'; break
      default: params.sortBy = 'releaseDate'; params.order = 'desc'
    }

    // CẬP NHẬT STATE -> Kích hoạt useQuery chạy lại
    setQueryParams(params)
  }

  // --- 5. HANDLERS UI ---
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre))
    } else {
      setSelectedGenres([...selectedGenres, genre])
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
            // Truyền Props UI
            countries={COUNTRIES}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            movieTypes={movieTypes}
            selectedType={selectedType}
            onSelectType={setSelectedType}
            ratings={ratings}
            selectedRating={selectedRating}
            onSelectRating={setSelectedRating}
            genres={uniqueGenres}
            selectedGenres={selectedGenres}
            onToggleGenre={toggleGenre}
            customYear={customYear}
            onSetCustomYear={setCustomYear}
            sortOptions={sortOptions}
            selectedSort={selectedSort}
            onSelectSort={setSelectedSort}
            onClose={() => setShowFilters(false)}

            // THÊM PROPS MỚI
            onApplyFilter={handleApplyFilter} // Hàm xử lý khi click nút
            isLoading={isLoading || isFetching} // Trạng thái đang tải
          />
        )}

        {/* <TopMovieCarousel title="🔥 Top Movies" movies={topMoviesData.movies} /> */}

        <div id="movie-list-section">
            {/* Hiển thị loading overlay hoặc text */}
            {(isLoading || isFetching) && (
                 <div className="text-white py-4 text-center animate-pulse">Đang lọc phim...</div>
            )}

            <MovieSection
              title={`📽️ Kết quả lọc (${listMovies.pagination?.totalItems || 0} phim)`}
              movies={listMovies.movies}
              viewAllHref="#"
            />
            
            {!isLoading && !isFetching && listMovies.movies.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                    Không tìm thấy phim nào phù hợp.
                </div>
            )}
        </div>
      </div>
    </div>
  )
}