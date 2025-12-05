'use client'

import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Film, CalendarIcon, Calendar } from 'lucide-react';
import { Movie } from '@/types/movie';

interface MovieSelectorProps {
  movies: Movie[];
  selectedMovieId: string;
  onSelectMovie: (id: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  showAllDates: boolean;
  onToggleAllDates: (show: boolean) => void;
}

export function MovieSelector({ 
  movies, 
  selectedMovieId, 
  onSelectMovie, 
  selectedDate, 
  onSelectDate,
  showAllDates,
  onToggleAllDates
}: MovieSelectorProps) {
  return (
    <Card className="p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
          <Film className="w-4 h-4" />
        </div>
        <h3 className="font-semibold text-gray-900 text-sm">Bộ lọc suất chiếu</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chọn Phim */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Chọn Phim</label>
          <Select value={selectedMovieId} onValueChange={onSelectMovie}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="-- Chọn phim --" />
            </SelectTrigger>
            <SelectContent>
              {/* Option Tất cả phim */}
              <SelectItem value="ALL">
                <span className="font-semibold text-primary">🎬 Tất cả phim</span>
              </SelectItem>
              
              {movies.length === 0 ? (
                <SelectItem value="no-movie" disabled>
                  Không có phim nào
                </SelectItem>
              ) : (
                movies.map(movie => (
                  <SelectItem key={movie._id} value={movie._id}>
                    {movie.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Chọn Ngày */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Ngày Chiếu</label>
          <div className="relative">
             <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <Input 
                type="date" 
                className="pl-9 bg-white"
                value={selectedDate}
                onChange={(e) => {
                  onSelectDate(e.target.value)
                  // Tự động tắt "Tất cả ngày" khi chọn ngày cụ thể
                  if (showAllDates) {
                    onToggleAllDates(false)
                  }
                }}
             />
          </div>
        </div>

        {/* Nút Tất cả ngày */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Hoặc xem tất cả</label>
          <Button
            type="button"
            variant={showAllDates ? "default" : "outline"}
            className={`w-full ${showAllDates ? 'bg-primary text-white' : 'border-gray-300 hover:bg-gray-50'}`}
            onClick={() => onToggleAllDates(!showAllDates)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {showAllDates ? 'Đang xem tất cả' : 'Tất cả ngày'}
          </Button>
        </div>
      </div>

      {/* Thông báo khi đang filter */}
      {(showAllDates || selectedMovieId === 'ALL') && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 flex items-center gap-1 flex-wrap">
            {showAllDates && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Tất cả ngày
              </span>
            )}
            {showAllDates && selectedMovieId === 'ALL' && (
              <span className="mx-1">•</span>
            )}
            {selectedMovieId === 'ALL' && (
              <span className="flex items-center gap-1">
                <Film className="w-3 h-3" />
                Tất cả phim
              </span>
            )}
          </p>
        </div>
      )}
    </Card>
  );
}