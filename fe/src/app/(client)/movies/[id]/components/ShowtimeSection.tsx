
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'

export function ShowtimeSection() {
  const showtimes = [
    {
      time: '14:00',
      cinema: 'Galaxy Cinema - Downtown',
      room: 'Phòng chiếu 1',
    },
    {
      time: '19:00',
      cinema: 'Galaxy Cinema - Downtown',
      room: 'Phòng chiếu 2',
    },
  ]

  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold mb-4">Lịch chiếu</h2>

      <div className="flex flex-wrap gap-4">
        {showtimes.map((show, i) => (
          <div
            key={i}
            className="flex items-center justify-between w-full md:w-[48%] border border-border rounded-2xl bg-surface px-6 py-4 hover:border-primary/60 transition-all"
          >
            {/* Left info */}
            <div>
              <p className="text-xl font-semibold text-primary">{show.time}</p>
              <p className="text-sm text-text-primary mt-1">{show.cinema}</p>
              <div className="flex items-center gap-1 text-xs text-text-secondary mt-1">
                <MapPin className="w-3 h-3 text-primary" />
                {show.room}
              </div>
            </div>

            {/* Button */}
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white rounded-lg text-sm px-5 py-2"
            >
              Đặt vé
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
