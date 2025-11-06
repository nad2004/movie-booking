'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const genres = [
  { name: 'Hành động', icon: '⚡', color: 'from-red-500 to-orange-500' },
  { name: 'Kinh dị', icon: '👻', color: 'from-purple-500 to-pink-500' },
  { name: 'Hài', icon: '😂', color: 'from-yellow-500 to-green-500' },
  { name: 'Tình cảm', icon: '💕', color: 'from-pink-500 to-rose-500' },
  { name: 'Khoa học viễn tưởng', icon: '🚀', color: 'from-blue-500 to-cyan-500' },
  { name: 'Hoạt hình', icon: '🎨', color: 'from-indigo-500 to-purple-500' },
]

export function GenreGrid() {
  return (
    <div className=" py-12   ">
      <div className="container">
        <h2 className="mb-8 text-start font-semibold text-foreground">Khám phá theo thể loại</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ">
          {genres.map((genre, index) => (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/movies?genre=${encodeURIComponent(genre.name)}`}
                className="group block"
              >
                <div
                  className={`
                    relative flex items-center justify-center gap-3
                    h-28 md:h-32 rounded-2xl border border-border 
                    bg-card transition-all duration-300
                    hover:text-white hover:border-transparent 
                    hover:bg-gradient-to-br ${genre.color}
                    group-hover:shadow-lg hover:-translate-y-1
                  `}
                >
                  <span
                    className="
                      text-3xl md:text-4xl 
                      transition-transform duration-300
                      group-hover:scale-110
                    "
                  >
                    {genre.icon}
                  </span>
                  <span
                    className="
                      text-sm md:text-base font-medium 
                      text-foreground group-hover:text-white
                    "
                  >
                    {genre.name}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
