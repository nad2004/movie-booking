'use client'

import { memo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filter as FilterIcon, Loader2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils' // Giả sử bạn có utility này từ shadcn/ui

// --- TYPES ---
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
  genres: string[]
  selectedGenres: string[]
  onToggleGenre: (value: string) => void
  customYear: string
  onSetCustomYear: (value: string) => void
  sortOptions: string[]
  selectedSort: string
  onSelectSort: (value: string) => void
  onClose: () => void
  onApplyFilter: () => void
  isLoading: boolean
  // Optional: Thêm prop reset nếu cần
  onResetFilter?: () => void 
}

type FilterButtonListProps = {
  items: string[]
  selectedItem: string | string[]
  onSelect: (item: string) => void
  className?: string
}

// --- SUB-COMPONENT: MEMOIZED LIST ---
// Sử dụng memo để tránh re-render khi parent thay đổi state không liên quan (vd: nhập input year)
const FilterButtonList = memo(({ items, selectedItem, onSelect, className }: FilterButtonListProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map(item => {
        const isSelected = Array.isArray(selectedItem)
          ? selectedItem.includes(item)
          : selectedItem === item

        return (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
            )}
            type="button"
          >
            {item}
          </button>
        )
      })}
    </div>
  )
})
FilterButtonList.displayName = 'FilterButtonList'

// --- MAIN COMPONENT ---
export default function FilterCard({
  countries, selectedCountry, onSelectCountry,
  movieTypes, selectedType, onSelectType,
  ratings, selectedRating, onSelectRating,
  genres, selectedGenres, onToggleGenre,
  customYear, onSetCustomYear,
  sortOptions, selectedSort, onSelectSort,
  onClose,
  onApplyFilter,
  isLoading,
  onResetFilter
}: FilterCardProps) {

  return (
    <Card className="bg-card border-border shadow-lg p-6 mb-8 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
          <FilterIcon className="w-5 h-5 text-primary" />
          Bộ lọc tìm kiếm
        </h3>
        {/* Nút đóng trên mobile hiển thị rõ hơn ở đây nếu cần */}
      </div>

      <div className="space-y-8">
        {/* Grid Layout cho các nhóm filter nhỏ */}
        <div className="grid grid-cols-1  gap-8">
          
          {/* Cột 1 */}
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wider opacity-80">Quốc gia</label>
              <FilterButtonList items={countries} selectedItem={selectedCountry} onSelect={onSelectCountry} />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wider opacity-80">Loại phim</label>
              <FilterButtonList items={movieTypes} selectedItem={selectedType} onSelect={onSelectType} />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wider opacity-80">Độ tuổi</label>
              <FilterButtonList items={ratings} selectedItem={selectedRating} onSelect={onSelectRating} />
            </div>
          </div>

          {/* Cột 2 */}
          <div className="space-y-6">
            <div>
               <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wider opacity-80">Sắp xếp theo</label>
               <FilterButtonList items={sortOptions} selectedItem={selectedSort} onSelect={onSelectSort} />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wider opacity-80">
                Năm sản xuất
              </label>
              <div className="flex items-center gap-4">
                 <Input
                  type="number"
                  placeholder="VD: 2024 (Nhập 0 = Tất cả)"
                  value={customYear}
                  onChange={e => onSetCustomYear(e.target.value)}
                  className="max-w-[200px] bg-muted border-border focus-visible:ring-primary rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Thể loại (Chiếm full width vì thường nhiều item) */}
        <div>
           <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wider opacity-80">Thể loại</label>
           <FilterButtonList items={genres} selectedItem={selectedGenres} onSelect={onToggleGenre} />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1 rounded-xl border-border hover:bg-muted"
        >
          Đóng
        </Button>

        {onResetFilter && (
           <Button
            variant="ghost"
            onClick={onResetFilter}
            className="flex-none rounded-xl text-muted-foreground hover:text-foreground"
            title="Đặt lại bộ lọc"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Đặt lại
          </Button>
        )}

        <Button
          onClick={onApplyFilter}
          disabled={isLoading}
          className="flex-1 sm:flex-[2] bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-md shadow-primary/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang áp dụng...
            </>
          ) : (
            "Xem kết quả"
          )}
        </Button>
      </div>
    </Card>
  )
}