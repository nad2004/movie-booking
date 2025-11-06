'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Star, Clock, Ticket, Calendar, User, Play, Undo2 } from 'lucide-react'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function MovieHeader() {
  const [showTrailer, setShowTrailer] = useState(false)
  const router = useRouter()
  return (
    <>
      <Button
        onClick={() => router.back()}
        className="text-sm hover:text-[hsl(var(--primary))] transition"
      >
        <Undo2 className="w-4 h-4" />
        Quay lại
      </Button>
      <section className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0 py-8 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 lg:gap-12 items-start">
        {/* Poster */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-border shadow-sm group h-[480px] md:h-[520px] lg:h-[540px]"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=900&fit=crop"
            alt="Spider-Man: No Way Home"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>

          {/* Play Button */}
          <button
            onClick={() => setShowTrailer(true)}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1" />
            </div>
          </button>
        </motion.div>

        {/* Info Section */}
        <div className="flex flex-col space-y-6">
          {/* Title + rating */}
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-text-primary">
              Guardians of the Galaxy Vol. 3
            </h1>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
              <span className="font-semibold text-lg md:text-xl text-text-primary">8.5</span>
              <span className="text-sm text-text-secondary">(1,234 đánh giá)</span>
            </div>
          </div>

          {/* Info boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Clock, label: 'Thời lượng', value: '150 phút' },
              { icon: Ticket, label: 'Trạng thái', value: 'Đang chiếu' },
              { icon: Calendar, label: 'Khởi chiếu', value: '15-01-2025' },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-border rounded-xl py-5 px-6 text-center bg-surface hover:border-primary/60 transition-all"
              >
                <item.icon className="w-5 h-5 mx-auto text-primary mb-2" />
                <p className="text-xs text-text-secondary">{item.label}</p>
                <p className="font-medium text-text-primary mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-medium text-text-primary mb-2">Mô tả</h3>
            <p className="text-text-secondary leading-relaxed">
              Câu chuyện tiếp theo của nhóm Vệ binh Dải Ngân Hà khi họ đối mặt với những thử thách
              mới và khám phá những bí mật về quá khứ của Rocket. Một cuộc phiêu lưu đầy cảm xúc với
              hành động mãn nhãn và kỹ xảo hoành tráng.
            </p>
          </div>

          {/* Director & Cast */}
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>
                <span className="text-text-secondary">Đạo diễn:</span>{' '}
                <span className="font-medium text-text-primary">James Gunn</span>
              </span>
            </p>
            <p className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>
                <span className="text-text-secondary">Diễn viên:</span>{' '}
                <span className="font-medium text-text-primary">
                  Chris Pratt, Zoe Saldana, Dave Bautista, Karen Gillan
                </span>
              </span>
            </p>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['Action', 'Superhero', 'Adventure', 'Sci-Fi'].map(genre => (
              <span
                key={genre}
                className="px-3 py-1 text-xs border border-border rounded-full text-text-secondary bg-bg-secondary"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Booking Button */}
          <Button className="bg-primary text-white rounded-lg w-full py-5 hover:bg-primary/90 text-base font-medium">
            Đặt vé ngay
          </Button>
        </div>

        {/* Trailer Modal */}
        {showTrailer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-xl overflow-hidden w-full max-w-3xl shadow-lg animate-fadeIn">
              <iframe
                src="https://www.youtube.com/embed/JfVOs4VSpmA"
                title="Trailer"
                className="w-full aspect-video"
                allowFullScreen
              />
              <div className="p-3 flex justify-end border-t border-border bg-bg-secondary">
                <Button variant="outline" className="text-sm" onClick={() => setShowTrailer(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
