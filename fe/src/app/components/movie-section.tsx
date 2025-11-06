import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import type { Movie } from '@/types'
import { MovieCard } from '@/app/components/movie-card'
import { TopMovieCard } from '@/app/components/top-movie-card'

interface MovieSectionProps {
  title: string
  movies: Movie[]
  viewAllHref: string
}

export function MovieSection({ title, movies, viewAllHref }: MovieSectionProps) {
  const isTopMovies = title.toLowerCase().includes('top movies') || title.includes('🔥')

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <Button variant="ghost" asChild className="text-sm hover:text-[hsl(var(--primary))]">
          <Link href={viewAllHref}>
            Xem tất cả
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Movie Grid */}
      <div
        className={`
          grid gap-6
          ${
            isTopMovies
              ? 'grid-cols-3 md:grid-cols-4 xl:grid-cols-6'
              : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
          }
        `}
      >
        {movies.map((movie, index) =>
          isTopMovies ? (
            <TopMovieCard key={movie.id} movie={movie} index={index} />
          ) : (
            <MovieCard key={movie.id} movie={movie} index={index} />
          )
        )}
      </div>
    </section>
  )
}
