"use client";
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar as CalendarIcon, Clock, Film, MapPin } from 'lucide-react';

export default function ScheduleManagementPage() {
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const schedules = [
    {
      id: 1,
      movie: 'Avengers: Endgame',
      theater: 'CGV Vincom',
      room: 'Phòng 1',
      date: '2024-11-05',
      time: '19:30',
      duration: '181 phút',
      price: '$20',
      availableSeats: 45,
      totalSeats: 120
    },
    {
      id: 2,
      movie: 'Spider-Man: No Way Home',
      theater: 'Lotte Cinema',
      room: 'Phòng 3',
      date: '2024-11-05',
      time: '20:00',
      duration: '148 phút',
      price: '$22',
      availableSeats: 89,
      totalSeats: 150
    },
    {
      id: 3,
      movie: 'The Batman',
      theater: 'Galaxy Cinema',
      room: 'Phòng 2',
      date: '2024-11-05',
      time: '18:00',
      duration: '176 phút',
      price: '$18',
      availableSeats: 120,
      totalSeats: 200
    },
    {
      id: 4,
      movie: 'Inception',
      theater: 'BHD Star',
      room: 'Phòng 4',
      date: '2024-11-05',
      time: '21:00',
      duration: '148 phút',
      price: '$25',
      availableSeats: 12,
      totalSeats: 100
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-gray-900 text-3xl">Quản Lý Lịch Chiếu</h1>
          <Dialog open={isAddScheduleOpen} onOpenChange={setIsAddScheduleOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Thêm Lịch Chiếu
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Thêm Lịch Chiếu Mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="movie" className="text-gray-700">Phim</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900 mt-2">
                      <SelectValue placeholder="Chọn phim..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="avengers">Avengers: Endgame</SelectItem>
                      <SelectItem value="spiderman">Spider-Man: No Way Home</SelectItem>
                      <SelectItem value="batman">The Batman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="theater" className="text-gray-700">Rạp</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900 mt-2">
                      <SelectValue placeholder="Chọn rạp..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cgv">CGV Vincom</SelectItem>
                      <SelectItem value="lotte">Lotte Cinema</SelectItem>
                      <SelectItem value="galaxy">Galaxy Cinema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="room" className="text-gray-700">Phòng Chiếu</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900 mt-2">
                      <SelectValue placeholder="Chọn phòng..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room1">Phòng 1</SelectItem>
                      <SelectItem value="room2">Phòng 2</SelectItem>
                      <SelectItem value="room3">Phòng 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-gray-700">Ngày Chiếu</Label>
                    <Input id="date" type="date" className="bg-gray-50 border-gray-300 text-gray-900 mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-gray-700">Giờ Chiếu</Label>
                    <Input id="time" type="time" className="bg-gray-50 border-gray-300 text-gray-900 mt-2" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="price" className="text-gray-700">Giá Vé ($)</Label>
                  <Input id="price" type="number" placeholder="20" className="bg-gray-50 border-gray-300 text-gray-900 mt-2" />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Thêm Lịch</Button>
                  <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => setIsAddScheduleOpen(false)}>Hủy</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tổng Suất Chiếu</p>
                <p className="text-gray-900 text-2xl">248</p>
              </div>
            </div>
          </Card>
          <Card className="bg-white border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Hôm Nay</p>
                <p className="text-gray-900 text-2xl">32</p>
              </div>
            </div>
          </Card>
          <Card className="bg-white border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Film className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phim Đang Chiếu</p>
                <p className="text-gray-900 text-2xl">15</p>
              </div>
            </div>
          </Card>
          <Card className="bg-white border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Rạp Hoạt Động</p>
                <p className="text-gray-900 text-2xl">8</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Chọn Ngày</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-gray-200"
            />
          </Card>

          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-gray-900">Lịch Chiếu</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50">
                    <TableHead className="text-gray-600">Phim</TableHead>
                    <TableHead className="text-gray-600">Rạp</TableHead>
                    <TableHead className="text-gray-600">Phòng</TableHead>
                    <TableHead className="text-gray-600">Giờ</TableHead>
                    <TableHead className="text-gray-600">Giá</TableHead>
                    <TableHead className="text-gray-600">Ghế Trống</TableHead>
                    <TableHead className="text-gray-600">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id} className="border-gray-200 hover:bg-gray-50">
                      <TableCell className="text-gray-900">{schedule.movie}</TableCell>
                      <TableCell className="text-gray-600">{schedule.theater}</TableCell>
                      <TableCell className="text-gray-600">{schedule.room}</TableCell>
                      <TableCell className="text-gray-600">{schedule.time}</TableCell>
                      <TableCell className="text-gray-900">{schedule.price}</TableCell>
                      <TableCell>
                        <Badge className={schedule.availableSeats < 20 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}>
                          {schedule.availableSeats}/{schedule.totalSeats}
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
          </div>
        </div>
      </div>
    </main>
  );
}
