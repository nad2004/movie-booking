'use client'

import { MapPin, Search, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

const cinemaBrands = ['CGV', 'Lotte', 'Galaxy', 'Beta', 'BHD', 'Cinestar', 'MegaGS']

const cinemas = [
  { id: 1, name: 'CGV Vincom Center', brand: 'CGV', distance: '2.5 km' },
  { id: 2, name: 'Lotte Cinema Landmark', brand: 'Lotte', distance: '3.1 km' },
  { id: 3, name: 'Galaxy Nguyễn Du', brand: 'Galaxy', distance: '1.8 km' },
  { id: 4, name: 'Beta Thanh Xuân', brand: 'Beta', distance: '4.2 km' },
]

const showtimes = [
  {
    id: 1,
    movie: 'The Dark Knight',
    format: '2D Phụ đề | CINE SUITE',
    times: ['10:30', '13:45', '16:20', '19:00', '21:30'],
    image:
      'https://images.unsplash.com/photo-1666698907755-672d406ea71d?auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 2,
    movie: 'Inception',
    format: '4DX',
    times: ['11:00', '14:30', '17:45', '20:15'],
    image:
      'https://images.unsplash.com/photo-1700174561966-36ed87c7bbeb?auto=format&fit=crop&w=800&q=60',
  },
]

const dates = [
  { day: 'T2', date: '04', month: '11' },
  { day: 'T3', date: '05', month: '11' },
  { day: 'T4', date: '06', month: '11' },
  { day: 'T5', date: '07', month: '11' },
  { day: 'T6', date: '08', month: '11' },
  { day: 'T7', date: '09', month: '11' },
  { day: 'CN', date: '10', month: '11' },
]

export function ShowtimeSection() {
  const [selectedBrand, setSelectedBrand] = useState('CGV')
  const [selectedCinema, setSelectedCinema] = useState(1)
  const [selectedDate, setSelectedDate] = useState(0)

  return (
    <section className="py-16 bg-background text-foreground">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <h2 className="text-center text-2xl font-semibold mb-8">Lịch chiếu phim</h2>

        <Card className="rounded-3xl border border-border bg-surface shadow-sm p-6 md:p-8">
          {/* Top Filters */}
          <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <select className="bg-muted border border-border rounded-full px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary transition">
                <option>Hồ Chí Minh</option>
                <option>Hà Nội</option>
                <option>Đà Nẵng</option>
              </select>
            </div>

            <Button
              variant="outline"
              className="rounded-full border-border hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Gần bạn
            </Button>

            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm theo tên rạp..."
                  className="w-full bg-muted border border-border rounded-full pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Brand Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
            {cinemaBrands.map(brand => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedBrand === brand
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-8">
            {/* Left - Cinema List */}
            <div className="space-y-3">
              {cinemas.map(cinema => (
                <button
                  key={cinema.id}
                  onClick={() => setSelectedCinema(cinema.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all ${
                    selectedCinema === cinema.id
                      ? 'bg-primary/10 border-l-4 border-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-semibold">{cinema.brand.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <h5 className="truncate text-foreground font-medium">{cinema.name}</h5>
                      <p className="text-sm text-muted-foreground">{cinema.distance}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right - Showtimes */}
            <div className="space-y-6">
              {/* Date Selector */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {dates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(index)}
                    className={`flex-shrink-0 w-16 sm:w-20 py-3 rounded-xl text-center transition-all ${
                      selectedDate === index
                        ? 'bg-primary text-primary-foreground shadow'
                        : 'bg-muted text-muted-foreground hover:bg-primary/10'
                    }`}
                  >
                    <div className="text-xs">{date.day}</div>
                    <div className="font-semibold">{date.date}</div>
                    <div className="text-xs opacity-80">Th{date.month}</div>
                  </button>
                ))}
              </div>

              {/* Showtime cards */}
              {showtimes.map(showtime => (
                <div
                  key={showtime.id}
                  className="bg-muted/50 rounded-2xl p-5 transition hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <img
                      src={showtime.image}
                      alt={showtime.movie}
                      className="w-full sm:w-24 h-36 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <h4 className="text-lg font-semibold text-foreground">{showtime.movie}</h4>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                        {showtime.format}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {showtime.times.map((time, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="rounded-full text-sm border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Button */}
          <div className="text-center mt-10">
            <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 rounded-full px-10 py-5 shadow-md">
              Xem tất cả
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
