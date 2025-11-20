'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filter as FilterIcon } from 'lucide-react'

// Props cho component FilterCard
type FilterCardProps = {
  countries: string[]
  selectedCountry: string
  onSelectCountry: (value: string) => void
  movieTypes: string[]
  selectedType: string
  onSelectType: (value: string) => void
  ratings: string[]
  selectedRating: string
  onSelectRating: (value: string) => void
  genres: string[] // Đã được lọc trùng ở component cha
  selectedGenres: string[]
  onToggleGenre: (value: string) => void
  versions: string[]
  selectedVersion: string
  onSelectVersion: (value: string) => void
  years: string[]
  selectedYear: string
  onSelectYear: (value: string) => void
  customYear: string
  onSetCustomYear: (value: string) => void
  sortOptions: string[]
  selectedSort: string
  onSelectSort: (value: string) => void
  onClose: () => void
}

// Component con để render các nút lọc
type FilterButtonListProps = {
  items: string[]
  selectedItem: string | string[]
  onSelect: (item: string) => void
}

const FilterButtonList: React.FC<FilterButtonListProps> = ({ items, selectedItem, onSelect }) => (
  <div className="flex flex-wrap gap-2">
    {items.map(item => {
      const isSelected = Array.isArray(selectedItem)
        ? selectedItem.includes(item)
        : selectedItem === item

      return (
        <button
          key={item} // Key an toàn vì mảng genres đã được lọc
          onClick={() => onSelect(item)}
          className={`px-4 py-2 rounded-lg transition-all ${
            isSelected
              ? 'bg-primary text-white'
              : 'bg-bg-secondary text-text-primary hover:bg-bg-secondary/80'
          }`}
        >
          {item}
        </button>
      )
    })}
  </div>
)

export default function FilterCard({
  countries,
  selectedCountry,
  onSelectCountry,
  movieTypes,
  selectedType,
  onSelectType,
  ratings,
  selectedRating,
  onSelectRating,
  genres,
  selectedGenres,
  onToggleGenre,
  versions,
  selectedVersion,
  onSelectVersion,
  years,
  selectedYear,
  onSelectYear,
  customYear,
  onSetCustomYear,
  sortOptions,
  selectedSort,
  onSelectSort,
  onClose,
}: FilterCardProps) {
  return (
    <Card className="bg-surface border-border p-6 mb-8" style={{ borderRadius: '16px' }}>
      <h3
        className="text-text-primary mb-6 flex items-center gap-2"
        style={{ fontSize: '20px', fontWeight: 600 }}
      >
        <FilterIcon className="w-5 h-5" />
        Bộ lọc
      </h3>

      <div className="space-y-6">
        {/* Country Filter */}
        <div>
          <label className="text-text-primary mb-3 block" style={{ fontWeight: 600 }}>
            Quốc gia:
          </label>
          <FilterButtonList
            items={countries}
            selectedItem={selectedCountry}
            onSelect={onSelectCountry}
          />
        </div>

        {/* Movie Type Filter */}
        <div>
          <label className="text-text-primary mb-3 block" style={{ fontWeight: 600 }}>
            Loại phim:
          </label>
          <FilterButtonList
            items={movieTypes}
            selectedItem={selectedType}
            onSelect={onSelectType}
          />
        </div>

        {/* Rating Filter */}
        <div>
          <label className="text-text-primary mb-3 block" style={{ fontWeight: 600 }}>
            Xếp hạng:
          </label>
          <FilterButtonList
            items={ratings}
            selectedItem={selectedRating}
            onSelect={onSelectRating}
          />
        </div>

        {/* Genre Filter */}
        <div>
          <label className="text-text-primary mb-3 block" style={{ fontWeight: 600 }}>
            Thể loại:
          </label>
          <FilterButtonList items={genres} selectedItem={selectedGenres} onSelect={onToggleGenre} />
        </div>

        {/* Version Filter */}
        <div>
          <label className="text-text-primary mb-3 block" style={{ fontWeight: 600 }}>
            Phiên bản:
          </label>
          <FilterButtonList
            items={versions}
            selectedItem={selectedVersion}
            onSelect={onSelectVersion}
          />
        </div>

        {/* Year Filter */}
        <div>
          <label className="text-text-primary mb-3 block" style={{ fontWeight: 600 }}>
            Năm sản xuất:
          </label>
          <div className="flex flex-wrap gap-2 items-center">
            {years.map(year => (
              <button
                key={year}
                onClick={() => onSelectYear(year)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedYear === year
                    ? 'bg-primary text-white'
                    : 'bg-bg-secondary text-text-primary hover:bg-bg-secondary/80'
                }`}
              >
                {year}
              </button>
            ))}
            <Input
              type="text"
              placeholder="Nhập năm"
              value={customYear}
              onChange={e => onSetCustomYear(e.target.value)}
              className="w-32 bg-bg-secondary border-border text-text-primary rounded-lg"
            />
          </div>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="text-text-primary mb-3 block" style={{ fontWeight: 600 }}>
            Sắp xếp:
          </label>
          <FilterButtonList
            items={sortOptions}
            selectedItem={selectedSort}
            onSelect={onSelectSort}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mt-8">
        <Button className="bg-accent hover:bg-accent/90 text-white rounded-lg px-8">
          Lọc kết quả
        </Button>
        <Button
          variant="outline"
          className="border-border text-text-primary rounded-lg px-8"
          onClick={onClose}
        >
          Đóng
        </Button>
      </div>
    </Card>
  )
}
