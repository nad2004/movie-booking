"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Star } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function MovieManagementPage() {
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);

  const movies = [
    {
      id: 1,
      poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=200',
      title: 'Avengers: Endgame',
      genre: 'Action, Sci-Fi',
      duration: '181 phút',
      releaseDate: '2019-04-26',
      rating: 8.4,
      status: 'Đang chiếu'
    },
    {
      id: 2,
      poster: 'https://images.unsplash.com/photo-1666022976723-1973522c9ebc?w=200',
      title: 'The Dark Knight',
      genre: 'Action, Crime',
      duration: '152 phút',
      releaseDate: '2008-07-18',
      rating: 9.0,
      status: 'Đang chiếu'
    },
    {
      id: 3,
      poster: 'https://images.unsplash.com/photo-1703737547632-bac624d89ff5?w=200',
      title: 'Inception',
      genre: 'Sci-Fi, Thriller',
      duration: '148 phút',
      releaseDate: '2010-07-16',
      rating: 8.8,
      status: 'Ngừng chiếu'
    },
    {
      id: 4,
      poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=200',
      title: 'Spider-Man: No Way Home',
      genre: 'Action, Adventure',
      duration: '148 phút',
      releaseDate: '2021-12-17',
      rating: 8.2,
      status: 'Đang chiếu'
    },
    {
      id: 5,
      poster: 'https://images.unsplash.com/photo-1666022976723-1973522c9ebc?w=200',
      title: 'Interstellar',
      genre: 'Sci-Fi, Drama',
      duration: '169 phút',
      releaseDate: '2014-11-07',
      rating: 8.6,
      status: 'Sắp chiếu'
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-gray-900 text-3xl mb-8">Quản Lý Phim</h1>

        <Card className="bg-white border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Tìm kiếm phim..."
                  className="pl-10 bg-gray-50 border-gray-300 text-gray-900"
                />
              </div>
            </div>
            <div>
              <Select>
                <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                  <SelectValue placeholder="Thể loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="scifi">Sci-Fi</SelectItem>
                  <SelectItem value="drama">Drama</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select>
                <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                  <SelectValue placeholder="Đánh giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9+">9.0+</SelectItem>
                  <SelectItem value="8+">8.0+</SelectItem>
                  <SelectItem value="all">Tất cả</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select>
                <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="showing">Đang chiếu</SelectItem>
                  <SelectItem value="upcoming">Sắp chiếu</SelectItem>
                  <SelectItem value="stopped">Ngừng chiếu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="bg-white border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 hover:bg-gray-50">
                <TableHead className="text-gray-600">Poster</TableHead>
                <TableHead className="text-gray-600">Tên Phim</TableHead>
                <TableHead className="text-gray-600">Thể Loại</TableHead>
                <TableHead className="text-gray-600">Thời Lượng</TableHead>
                <TableHead className="text-gray-600">Ngày Phát Hành</TableHead>
                <TableHead className="text-gray-600">Đánh Giá</TableHead>
                <TableHead className="text-gray-600">Trạng Thái</TableHead>
                <TableHead className="text-gray-600">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie.id} className="border-gray-200 hover:bg-gray-50">
                  <TableCell>
                    <ImageWithFallback
                      src={movie.poster}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="text-gray-900">{movie.title}</TableCell>
                  <TableCell className="text-gray-600">{movie.genre}</TableCell>
                  <TableCell className="text-gray-600">{movie.duration}</TableCell>
                  <TableCell className="text-gray-600">{movie.releaseDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <span className="text-gray-900">{movie.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        movie.status === 'Đang chiếu'
                          ? 'bg-green-100 text-green-700'
                          : movie.status === 'Sắp chiếu'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {movie.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-gray-300 text-blue-600 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-300 text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Dialog open={isAddMovieOpen} onOpenChange={setIsAddMovieOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Thêm Phim Mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title" className="text-gray-700">Tên Phim</Label>
                <Input id="title" placeholder="Nhập tên phim..." className="bg-gray-50 border-gray-300 text-gray-900 mt-2" />
              </div>
              <div>
                <Label htmlFor="genre" className="text-gray-700">Thể Loại</Label>
                <Input id="genre" placeholder="Action, Sci-Fi..." className="bg-gray-50 border-gray-300 text-gray-900 mt-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration" className="text-gray-700">Thời Lượng (phút)</Label>
                  <Input id="duration" type="number" placeholder="120" className="bg-gray-50 border-gray-300 text-gray-900 mt-2" />
                </div>
                <div>
                  <Label htmlFor="releaseDate" className="text-gray-700">Ngày Phát Hành</Label>
                  <Input id="releaseDate" type="date" className="bg-gray-50 border-gray-300 text-gray-900 mt-2" />
                </div>
              </div>
              <div>
                <Label htmlFor="trailer" className="text-gray-700">URL Trailer</Label>
                <Input id="trailer" placeholder="https://youtube.com/..." className="bg-gray-50 border-gray-300 text-gray-900 mt-2" />
              </div>
              <div>
                <Label htmlFor="description" className="text-gray-700">Mô Tả</Label>
                <Textarea id="description" placeholder="Nhập mô tả phim..." className="bg-gray-50 border-gray-300 text-gray-900 mt-2 min-h-[100px]" />
              </div>
              <div>
                <Label htmlFor="poster" className="text-gray-700">Upload Poster</Label>
                <Input id="poster" type="file" accept="image/*" className="bg-gray-50 border-gray-300 text-gray-900 mt-2" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Thêm Phim</Button>
                <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => setIsAddMovieOpen(false)}>Hủy</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
