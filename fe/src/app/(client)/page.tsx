'use client'
import { HeroSection } from '@/app/(client)/components/hero-section'
import { GenreGrid } from '@/app/(client)/components/genre-grid'
import { MovieSection } from '@/app/components/shared/movie-section'
import { FeaturedReviews } from '@/app/(client)/components/featured-reviews'
import { ShowtimeSection } from '@/app/(client)/components/showtimeSection'
import { TopMovieCarousel } from '@/app/(client)/components/topMovieCarousel'
import { useMovies } from '@/lib/api/movies'
import { useTheaters } from '@/lib/api/theaters'
import { useGenres } from '@/lib/api/genres'
import { DEFAULT_MOVIE_LIST, DEFAULT_THEATER_LIST, DEFAULT_GENRE_LIST } from '@/constants'
export default function HomePage() {
  const {
    data: listMovies = DEFAULT_MOVIE_LIST,
    isLoading,
    error,
  } = useMovies({ page: 1, limit: 10 })
  const { data: listTheater = DEFAULT_THEATER_LIST } = useTheaters({})
  const { data: listGenres = DEFAULT_GENRE_LIST } = useGenres({})

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading data</div>
  }

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <HeroSection movies={listMovies.movies.slice(0, 5)} />

      <main
        className="
          w-full max-w-none
          px-[25px] md:px-[60px] xl:px-[86px] 
          py-12 space-y-16
        "
      >
        <TopMovieCarousel title="🔥 Top Movies" movies={listMovies.movies.slice(0, 5)} />
        <MovieSection
          title="🎟️ Đang chiếu"
          movies={listMovies.movies.slice(0, 5)}
          viewAllHref="/movies?filter=now-playing"
        />
        <MovieSection
          title="📅 Sắp chiếu"
          movies={listMovies.movies.slice(0, 5)}
          viewAllHref="/movies?filter=coming-soon"
        />

        <GenreGrid genres={listGenres} />
        <ShowtimeSection cinemas={listTheater.theaters} />
        <FeaturedReviews />
      </main>
    </div>
  )
}
