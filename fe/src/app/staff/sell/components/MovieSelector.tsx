'use client'

import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Film, CalendarIcon } from 'lucide-react';
import { Movie } from '@/types/movie';

interface MovieSelectorProps {
  movies: Movie[];
  selectedMovieId: string;
  onSelectMovie: (id: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function MovieSelector({ 
  movies, 
  selectedMovieId, 
  onSelectMovie, 
  selectedDate, 
  onSelectDate 
}: MovieSelectorProps) {
  return (
    <Card className="p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
          <Film className="w-4 h-4" />
        </div>
        <h3 className="font-semibold text-gray-900 text-sm">Thông tin phim</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chọn Phim */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Chọn Phim</label>
          <Select value={selectedMovieId} onValueChange={onSelectMovie}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="-- Chọn phim đang chiếu --" />
            </SelectTrigger>
            <SelectContent>
              {movies.map(movie => (
                <SelectItem key={movie._id} value={movie._id}>
                  {movie.title}
                </SelectItem>
              ))}
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
                onChange={(e) => onSelectDate(e.target.value)}
             />
          </div>
        </div>
      </div>
    </Card>
  );
}