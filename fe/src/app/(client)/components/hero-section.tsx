'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Info, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Movie } from '@/types/movie'
import Image from 'next/image'
interface MovieSectionProps {
  movies: Movie[]
}
export function HeroSection({ movies }: MovieSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % movies.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [movies.length])

  const currentMovie = movies[currentIndex]
  if (movies.length === 0) {
    return <div>Không có thể loại nào để hiển thị.</div>
  }
  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden ">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden aspect-2/3">
            {/* Next.js Image as background */}
            <Image
              src={currentMovie.posterUrl || '/placeholder-poster.jpg'}
              alt={currentMovie.title || 'Movie poster'}
              fill
              className="object-cover"
              priority
              quality={75}
              sizes="100vw"
            />

            {/* Overlay gradients */}
            <div className="absolute inset-0 bg-linear-to-r from-background via-background/85 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative flex h-full items-center">
            <div className="px-[25px] md:px-[60px] xl:px-[86px] max-w-[680px] space-y-6">
              {/* Title */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold leading-tight text-foreground"
              >
                {currentMovie.title}
              </motion.h1>

              {/* Metadata */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
              >
                <span className="uppercase tracking-wide font-semibold">
                  Đạo diễn:&nbsp;
                  <span className="text-foreground">{currentMovie.director}</span>
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="uppercase">Thời lượng</span>
                <span className="text-foreground">{currentMovie.duration} phút</span>
                <span className="text-muted-foreground">•</span>
                <span className="uppercase">Đánh giá</span>
                <span className="flex items-center gap-1 text-[hsl(var(--accent))] font-semibold">
                  <Star className="h-4 w-4 fill-[hsl(var(--accent))]" />{' '}
                  {currentMovie.averageRating}/5
                </span>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[600px]"
              >
                {currentMovie.description}
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3"
              >
                <Button
                  size="lg"
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl"
                >
                  <Link href={`/movies/${currentMovie._id}`}>
                    <Play className="mr-2 h-5 w-5" />
                    Đặt vé
                  </Link>
                </Button>
                {/* <Button size="lg" variant="outline" asChild className="rounded-xl border-border">
                  <Link href={`/movies/${currentMovie._id}`}>
                    <Info className="mr-2 h-5 w-5" />
                    Xem chi tiết
                  </Link>
                </Button> */}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setCurrentIndex(prev => (prev === 0 ? movies.length - 1 : prev - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setCurrentIndex(prev => (prev + 1) % movies.length)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-[hsl(var(--primary))]' : 'w-4 bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
