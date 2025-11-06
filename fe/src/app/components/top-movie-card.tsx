'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import type { Movie } from '@/types'

interface MovieCardProps {
  movie: Movie
  index?: number
}

export function TopMovieCard({ movie, index = 0 }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/movies/${movie.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl aspect-[2/3] mb-3">
          <ImageWithFallback
            src={movie.poster}
            alt={movie.title}
            className="object-cover w-full h-full transition-transform group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Button size="sm" className="w-full">
                Đặt vé
              </Button>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-lg flex items-center gap-1 text-sm">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-white">{movie.rating}</span>
          </div>
        </div>

        <div className="space-y-1 px-2">
          <h3 className="text-sm line-clamp-2 group-hover:text-[hsl(var(--primary))] transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{movie.duration} phút</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
