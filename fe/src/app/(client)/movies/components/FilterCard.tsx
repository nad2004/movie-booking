'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filter as FilterIcon, Loader2 } from 'lucide-react' // Import thêm Loader2

type FilterCardProps = {
  // ... (Các props cũ giữ nguyên)
  countries: string[]
  selectedCountry: string
  onSelectCountry: (value: string) => void
  movieTypes: string[]
  selectedType: string
  onSelectType: (value: string) => void
  ratings: string[]
  selectedRating: string
  onSelectRating: (value: string) => void
  genres: string[]
  selectedGenres: string[]
  onToggleGenre: (value: string) => void
  customYear: string
  onSetCustomYear: (value: string) => void
  sortOptions: string[]
  selectedSort: string
  onSelectSort: (value: string) => void
  onClose: () => void

  // --- THÊM 2 PROPS MỚI ---
  onApplyFilter: () => void
  isLoading: boolean
}

// ... (Giữ nguyên FilterButtonList)
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
            key={item} 
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
  countries, selectedCountry, onSelectCountry,
  movieTypes, selectedType, onSelectType,
  ratings, selectedRating, onSelectRating,
  genres, selectedGenres, onToggleGenre,
  customYear, onSetCustomYear,
  sortOptions, selectedSort, onSelectSort,
  onClose,
  onApplyFilter, // Nhận hàm
  isLoading      // Nhận trạng thái
}: FilterCardProps) {
  
  return (
    <Card className="bg-surface border-border p-6 mb-8" style={{ borderRadius: '16px' }}>
      {/* ... (Giữ nguyên phần UI các bộ lọc) ... */}
       <h3
        className="text-text-primary mb-6 flex items-center gap-2"
        style={{ fontSize: '20px', fontWeight: 600 }}
      >
        <FilterIcon className="w-5 h-5" />
        Bộ lọc
      </h3>

      <div className="space-y-6">
        {/* Country */}
        <div>
            <label className="text-text-primary mb-3 block" style={{ fontWeight: 600 }}>Quốc gia:</label>
            <FilterButtonList items={countries} selectedItem={selectedCountry} onSelect={onSelectCountry} />
        </div>
        {/* Movie Type */}
        <div>
            <label className="text-text-primary mb-3 block" style={{ fontWeight: 600 }}>Loại phim:</label>
            <FilterButtonList items={movieTypes} selectedItem={selectedType} onSelect={onSelectType} />
        </div>
        {/* Rating */}
        <div>
            <label className="text-text-primary mb-3 block" style={{ fontWeight: 600 }}>Độ tuổi:</label>
            <FilterButtonList items={ratings} selectedItem={selectedRating} onSelect={onSelectRating} />
        </div>
        {/* Genre */}
        <div>
            <label className="text-text-primary mb-3 block" style={{ fontWeight: 600 }}>Thể loại:</label>
            <FilterButtonList items={genres} selectedItem={selectedGenres} onSelect={onToggleGenre} />
        </div>
        {/* Year */}
        <div>
            <label className="text-text-primary mb-3 block" style={{ fontWeight: 600 }}>Năm sản xuất (Nhập 0 để lọc tất cả):</label>
            <Input 
                type="text" placeholder="Nhập năm" value={customYear} 
                onChange={e => onSetCustomYear(e.target.value)} 
                className="w-32 bg-bg-secondary border-border text-text-primary rounded-lg" 
            />
        </div>
        {/* Sort */}
        <div>
            <label className="text-text-primary mb-3 block" style={{ fontWeight: 600 }}>Sắp xếp:</label>
            <FilterButtonList items={sortOptions} selectedItem={selectedSort} onSelect={onSelectSort} />
        </div>
      </div>

      {/* CẬP NHẬT PHẦN BUTTONS */}
      <div className="flex gap-4 mt-8">
        <Button 
            onClick={onApplyFilter} // Gọi hàm khi click
            disabled={isLoading}    // Disable khi đang tải
            className="bg-accent hover:bg-accent/90 text-white rounded-lg px-8 flex items-center gap-2"
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang lọc...
                </>
            ) : (
                "Lọc kết quả"
            )}
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