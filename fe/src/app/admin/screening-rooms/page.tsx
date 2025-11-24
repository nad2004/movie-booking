'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Grid3x3, Users, Armchair } from 'lucide-react';

export default function ScreeningRoomPage() {
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(1);

  const rooms = [
    { id: 1, name: 'Phòng 1', theater: 'CGV Vincom', type: '2D', seats: 120, rows: 10, cols: 12, status: 'Hoạt động' },
    { id: 2, name: 'Phòng 2', theater: 'CGV Vincom', type: '3D', seats: 150, rows: 12, cols: 13, status: 'Hoạt động' },
    { id: 3, name: 'Phòng 3', theater: 'Lotte Cinema', type: 'IMAX', seats: 200, rows: 15, cols: 14, status: 'Hoạt động' },
    { id: 4, name: 'Phòng 4', theater: 'Galaxy Cinema', type: '2D', seats: 100, rows: 10, cols: 10, status: 'Bảo trì' },
    { id: 5, name: 'Phòng 5', theater: 'BHD Star', type: '4DX', seats: 80, rows: 8, cols: 10, status: 'Hoạt động' },
  ];

  const seatTypes = [
    { type: 'standard', label: 'Ghế thường', color: 'bg-blue-500', count: 80 },
    { type: 'vip', label: 'Ghế VIP', color: 'bg-purple-500', count: 30 },
    { type: 'couple', label: 'Ghế đôi', color: 'bg-pink-500', count: 10 },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-gray-900 text-3xl">Quản Lý Phòng Chiếu</h1>
          <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Thêm Phòng Mới
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Thêm Phòng Chiếu Mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="roomName" className="text-gray-700">Tên Phòng</Label>
                  <Input id="roomName" placeholder="Phòng 1" className="bg-gray-50 border-gray-300 text-gray-900 mt-2" />
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
                  <Label htmlFor="type" className="text-gray-700">Loại Phòng</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900 mt-2">
                      <SelectValue placeholder="Chọn loại..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2d">2D</SelectItem>
                      <SelectItem value="3d">3D</SelectItem>
                      <SelectItem value="imax">IMAX</SelectItem>
                      <SelectItem value="4dx">4DX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="rows" className="text-gray-700">Số Hàng</Label>
                    <Input id="rows" type="number" placeholder="10" className="bg-gray-50 border-gray-300 text-gray-900 mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="cols" className="text-gray-700">Số Cột</Label>
                    <Input id="cols" type="number" placeholder="12" className="bg-gray-50 border-gray-300 text-gray-900 mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="totalSeats" className="text-gray-700">Tổng Ghế</Label>
                    <Input id="totalSeats" type="number" placeholder="120" className="bg-gray-50 border-gray-300 text-gray-900 mt-2" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Lưu</Button>
                  <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => setIsAddRoomOpen(false)}>Hủy</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Grid3x3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tổng Phòng</p>
                <p className="text-gray-900 text-2xl">{rooms.length}</p>
              </div>
            </div>
          </Card>
          <Card className="bg-white border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tổng Ghế</p>
                <p className="text-gray-900 text-2xl">650</p>
              </div>
            </div>
          </Card>
          <Card className="bg-white border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Armchair className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Đang Hoạt Động</p>
                <p className="text-gray-900 text-2xl">4</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-white border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Danh Sách Phòng Chiếu</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 hover:bg-gray-50">
                <TableHead className="text-gray-600">Tên Phòng</TableHead>
                <TableHead className="text-gray-600">Rạp</TableHead>
                <TableHead className="text-gray-600">Loại</TableHead>
                <TableHead className="text-gray-600">Số Ghế</TableHead>
                <TableHead className="text-gray-600">Hàng x Cột</TableHead>
                <TableHead className="text-gray-600">Trạng Thái</TableHead>
                <TableHead className="text-gray-600">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow
                  key={room.id}
                  className={`border-gray-200 hover:bg-gray-50 cursor-pointer ${selectedRoom === room.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  <TableCell className="text-gray-900">{room.name}</TableCell>
                  <TableCell className="text-gray-600">{room.theater}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-700">{room.type}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{room.seats}</TableCell>
                  <TableCell className="text-gray-600">{room.rows} x {room.cols}</TableCell>
                  <TableCell>
                    <Badge className={room.status === 'Hoạt động' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                      {room.status}
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

        {selectedRoom && (
          <Card className="bg-white border-gray-200 p-6">
            <h3 className="text-gray-900 mb-6">Sơ Đồ Ghế - {rooms.find(r => r.id === selectedRoom)?.name}</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-gray-800 text-white px-8 py-2 rounded-lg mb-4">Màn Hình</div>
              
              <div className="flex gap-6 mb-6">
                {seatTypes.map((type) => (
                  <div key={type.type} className="flex items-center gap-2">
                    <div className={`w-6 h-6 ${type.color} rounded`}></div>
                    <span className="text-gray-700 text-sm">{type.label} ({type.count})</span>
                  </div>
                ))}
              </div>

              <div className="grid gap-2">
                {Array.from({ length: 10 }).map((_, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2 items-center">
                    <span className="text-gray-600 w-6 text-center">{String.fromCharCode(65 + rowIndex)}</span>
                    {Array.from({ length: 12 }).map((_, colIndex) => {
                      const seatNumber = rowIndex * 12 + colIndex + 1;
                      let seatColor = 'bg-blue-500';
                      if (seatNumber > 80) seatColor = 'bg-purple-500';
                      if (seatNumber > 110) seatColor = 'bg-pink-500';
                      
                      return (
                        <div
                          key={colIndex}
                          className={`w-8 h-8 ${seatColor} rounded cursor-pointer hover:opacity-80 transition-opacity`}
                        ></div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
