'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { Movie } from '@/types/schedule'

type MovieShowtimeCardProps = {
  movie: Movie
}

export default function MovieShowtimeCard({ movie }: MovieShowtimeCardProps) {
  return (
    <Card
      key={movie.id}
      className={`bg-surface border-2 p-3 sm:p-4 md:p-6 ${movie.highlight ? 'border-accent' : 'border-border'}`}
      style={{ borderRadius: '16px' }}
    >
      {movie.highlight && (
        <div className="mb-3 sm:mb-4 bg-accent/10 border border-accent/30 p-2.5 sm:p-3 rounded-lg flex items-center gap-2">
          <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-accent flex-shrink-0" />
          <span className="text-text-primary text-sm sm:text-base" style={{ fontWeight: 500 }}>
            Được ra rạp
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
        {/* Movie Poster */}
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Movie Info & Showtimes */}
        <div className="flex-1 min-w-0">
          <div className="mb-3 sm:mb-4">
            <h4 className="text-text-primary mb-2 text-base sm:text-lg" style={{ fontWeight: 600 }}>
              {movie.title}
            </h4>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-text-secondary text-xs sm:text-sm mb-2">
              <span className="line-clamp-1">{movie.genre}</span>
              <span className="hidden sm:inline">•</span>
              <span>{movie.duration}</span>
              <span className="hidden sm:inline">•</span>
              <span>{movie.rating}</span>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                Trailer
              </Badge>
            </div>
            <div className="text-text-primary text-sm sm:text-base" style={{ fontWeight: 500 }}>
              {movie.format}
            </div>
          </div>

          {/* Showtimes Grid */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-3">
            {movie.showtimes.map((time, index) => (
              <button
                key={index}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 transition-all text-text-primary text-sm sm:text-base"
                style={{ fontWeight: 500 }}
              >
                {time}
                <div className="text-xs text-text-secondary">~360k</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
