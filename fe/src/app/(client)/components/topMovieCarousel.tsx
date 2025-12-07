'use client'

import { Button } from '@/components/ui/button'
import { Star, Clock } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback'
import type { Movie } from '@/types/movie'

// Embla (shadcn)
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface MovieCarouselProps {
  title: string
  movies: Movie[]
}

export function TopMovieCarousel({ title, movies }: MovieCarouselProps) {
  if (movies.length === 0) {
    return <div>Không có thể loại nào để hiển thị.</div>
  }
  return (
    <section className="w-full mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>

      {/* Responsive Carousel (3 breakpoints) */}
      <Carousel className="w-full" opts={{ align: 'start', dragFree: true }}>
        <CarouselContent className="-ml-3">
          {movies.map((movie, index) => (
            <CarouselItem
              key={movie._id}
              className="
                pl-3
                basis-1/2         /* mobile: 2 items */
                sm:basis-1/3      /* ≥640px: 3 items */
                md:basis-1/4      /* ≥768px: 4 items */
                lg:basis-1/5      /* ≥1024px: 5 items */
                xl:basis-1/6      /* ≥1280px: 6 items */
                2xl:basis-1/6     /* ≥1536px: 6 items */
              "
            >
              <MovieCard movie={movie} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Nút điều hướng */}
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}
function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/movies/${movie._id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl aspect-2/3 mb-3">
          <ImageWithFallback
            src={movie.posterUrl}
            alt={movie.title}
            className="object-cover w-full h-full transition-transform group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
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

        <div className="space-y-1 px-1">
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
