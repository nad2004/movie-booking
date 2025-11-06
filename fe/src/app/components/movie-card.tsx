'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Clock } from 'lucide-react'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import type { Movie } from '@/types'

interface MovieCardProps {
  movie: Movie
  index?: number
}

export function MovieCard({ movie, index = 0 }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/movies/${movie.id}`} className="block relative overflow-hidden rounded-2xl">
        {/* Poster */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <ImageWithFallback
            src={movie.poster}
            alt={movie.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Rating */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-lg flex items-center gap-1 text-sm">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-medium">{movie.rating}</span>
          </div>

          {/* Info text */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3
              className="
                text-sm font-semibold leading-tight 
                truncate group-hover:text-[hsl(var(--primary))] transition-colors
              "
              title={movie.title} /* Tooltip khi hover */
            >
              {movie.title}
            </h3>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="truncate">{movie.genre}</span>
              <span>•</span>
              <Clock className="h-3 w-3 shrink-0" />
              <span>{movie.duration} phút</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
