import { MovieHeader } from './components/MovieHeader'
import { ShowtimeSection } from './components/ShowtimeSection'
import { ReviewSection } from './components/ReviewSection'
import { RelatedMovies } from './components/RelatedMovies'
export default function MovieDetailPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-[1200px] mx-auto px-4 py-12 space-y-16">
        <MovieHeader />

        <ShowtimeSection />
        <ReviewSection />
        <RelatedMovies />
      </div>
    </div>
  )
}
