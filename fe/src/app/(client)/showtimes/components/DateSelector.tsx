'use client'

import { Card } from '@/components/ui/card'
import { ShowtimeDate } from '@/types/schedule'

type DateSelectorProps = {
  dates: ShowtimeDate[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

export default function DateSelector({ dates, selectedDate, onSelectDate }: DateSelectorProps) {
  return (
    <Card className="bg-surface border-border p-3 sm:p-4 md:p-6" style={{ borderRadius: '16px' }}>
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {dates.map(dateItem => (
          <button
            key={dateItem.date}
            onClick={() => onSelectDate(dateItem.date)}
            className={`flex-shrink-0 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg transition-all ${
              selectedDate === dateItem.date
                ? 'bg-primary text-white'
                : 'bg-bg-secondary text-text-primary hover:bg-bg-secondary/80'
            }`}
          >
            <div className="text-center">
              <div className="text-sm sm:text-base" style={{ fontWeight: 600 }}>
                {dateItem.date}
              </div>
              <div className="text-xs sm:text-sm opacity-80">{dateItem.day}</div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}
