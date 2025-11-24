"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default function GenreManagementPage() {
  const [isAddGenreOpen, setIsAddGenreOpen] = useState(false);

  const genres = [
    { id: 1, name: 'Action', description: 'Phim hành động kịch tính', createdDate: '2024-01-15' },
    { id: 2, name: 'Sci-Fi', description: 'Phim khoa học viễn tưởng', createdDate: '2024-01-20' },
    { id: 3, name: 'Drama', description: 'Phim tâm lý, cảm xúc sâu sắc', createdDate: '2024-02-05' },
    { id: 4, name: 'Comedy', description: 'Phim hài hước, giải trí', createdDate: '2024-02-10' },
    { id: 5, name: 'Horror', description: 'Phim kinh dị, rùng rợn', createdDate: '2024-02-15' },
    { id: 6, name: 'Romance', description: 'Phim lãng mạn, tình cảm', createdDate: '2024-03-01' },
    { id: 7, name: 'Thriller', description: 'Phim ly kỳ, căng thẳng', createdDate: '2024-03-10' },
    { id: 8, name: 'Adventure', description: 'Phim phiêu lưu, mạo hiểm', createdDate: '2024-03-15' },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-gray-900 text-3xl mb-8">Quản Lý Thể Loại</h1>

        {/* Search and Add Button */}
        <Card className="bg-white border-gray-200 p-6 mb-6">
          <div className="flex gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm theo tên thể loại..."
                className="pl-10 bg-gray-50 border-gray-300 text-gray-900"
              />
            </div>

            {/* Add Button */}
            <Dialog open={isAddGenreOpen} onOpenChange={setIsAddGenreOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Mới
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-gray-200 text-gray-900">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Thêm Thể Loại Mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="genreName" className="text-gray-700">Tên Thể Loại</Label>
                    <Input
                      id="genreName"
                      placeholder="Nhập tên thể loại..."
                      className="bg-gray-50 border-gray-300 text-gray-900 mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="genreDescription" className="text-gray-700">Mô Tả</Label>
                    <Textarea
                      id="genreDescription"
                      placeholder="Nhập mô tả thể loại..."
                      className="bg-gray-50 border-gray-300 text-gray-900 mt-2 min-h-[100px]"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      Lưu
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsAddGenreOpen(false)}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Genre Table */}
        <Card className="bg-white border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Chi Tiết Thể Loại</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 hover:bg-gray-50">
                <TableHead className="text-gray-600">STT</TableHead>
                <TableHead className="text-gray-600">Tên Thể Loại</TableHead>
                <TableHead className="text-gray-600">Mô Tả</TableHead>
                <TableHead className="text-gray-600">Ngày Tạo</TableHead>
                <TableHead className="text-gray-600">Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {genres.map((genre, index) => (
                <TableRow key={genre.id} className="border-gray-200 hover:bg-gray-50">
                  <TableCell className="text-gray-900">{index + 1}</TableCell>
                  <TableCell className="text-gray-900">{genre.name}</TableCell>
                  <TableCell className="text-gray-600">{genre.description}</TableCell>
                  <TableCell className="text-gray-600">{genre.createdDate}</TableCell>
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
      </div>
    </main>
  );
}
