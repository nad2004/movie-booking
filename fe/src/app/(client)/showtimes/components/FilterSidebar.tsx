'use client'

import { Card } from '@/components/ui/card'

import { CITIES } from '@/constants'
// Gom tất cả props cần thiết vào đây
type FilterSidebarProps = {
  selectedCity: string
  onSelectCity: (id: string) => void
  currentCinemas: string[]
  selectedCinema: string
  onSelectCinema: (name: string) => void
}

export default function FilterSidebar({
  selectedCity,
  onSelectCity,
  currentCinemas,
  selectedCinema,
  onSelectCinema,
}: FilterSidebarProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* --- 1. City Filter --- */}
      <Card className="bg-surface border-border p-3 sm:p-4" style={{ borderRadius: '16px' }}>
        <h3 className="text-text-primary mb-3 text-sm sm:text-base" style={{ fontWeight: 600 }}>
          Khu vực
        </h3>
        <div className="space-y-2 max-h-[300px] sm:max-h-[500px] overflow-y-auto">
          {CITIES.map(city => (
            <button
              key={city.id}
              onClick={() => onSelectCity(city.id)}
              className={`w-full flex items-center justify-between px-2.5 sm:px-3 py-2 rounded-lg transition-all text-sm sm:text-base ${
                selectedCity === city.id
                  ? 'bg-primary text-white'
                  : 'hover:bg-bg-secondary text-text-primary'
              }`}
            >
              <span>{city.name}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* --- 3. Cinema Filter --- */}
      <Card className="bg-surface border-border p-3 sm:p-4" style={{ borderRadius: '16px' }}>
        <h3 className="text-text-primary mb-3 text-sm sm:text-base" style={{ fontWeight: 600 }}>
          Rạp
        </h3>
        <div className="space-y-2">
          {currentCinemas.map(cinema => (
            <button
              key={cinema}
              onClick={() => onSelectCinema(cinema)}
              className={`w-full text-left px-2.5 sm:px-3 py-2 rounded-lg transition-all text-sm sm:text-base ${
                selectedCinema === cinema
                  ? 'bg-primary text-white'
                  : 'hover:bg-bg-secondary text-text-secondary'
              }`}
            >
              {cinema}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
