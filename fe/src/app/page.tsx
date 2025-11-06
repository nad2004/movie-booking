import { HeroSection } from '@/app/components/hero-section'
import { GenreGrid } from '@/app/components/genre-grid'
import { MovieSection } from '@/app/components/movie-section'
import { FeaturedReviews } from '@/app/components/featured-reviews'
import { mockMovies, mockReviews } from '@/lib/mock-data'
import { ShowtimeSection } from '@/app/components/showtimeSection'
export default function HomePage() {
  const nowPlayingMovies = mockMovies.slice(0, 6)
  const comingSoonMovies = mockMovies.slice(0, 6)
  const topMovies = mockMovies.slice(0, 6)

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero full width */}
      <HeroSection />
      {/* Body content full width with centered content */}
      <main
        className="
          w-full max-w-none
          px-[25px] md:px-[60px] xl:px-[86px] 
          py-12 space-y-16
        "
      >
        <MovieSection
          title="🔥 Top Movies"
          movies={topMovies}
          viewAllHref="/movies?filter=top-rated"
        />
        <MovieSection
          title="🎟️ Đang chiếu"
          movies={nowPlayingMovies}
          viewAllHref="/movies?filter=now-playing"
        />
        <MovieSection
          title="📅 Sắp chiếu"
          movies={comingSoonMovies}
          viewAllHref="/movies?filter=coming-soon"
        />
        {/* Genre grid section */}
        <GenreGrid />
        <ShowtimeSection />
        <FeaturedReviews />
      </main>
    </div>
  )
}
