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
import { Plus, Edit, Trash2, Search, MapPin, Phone } from 'lucide-react';

export default function TheaterManagementPage() {
  const [isAddTheaterOpen, setIsAddTheaterOpen] = useState(false);

  const theaters = [
    {
      id: 1,
      name: 'CGV Vincom',
      address: '191 Bà Triệu, Hai Bà Trưng',
      city: 'Hà Nội',
      phone: '1900 6017',
      rooms: 8,
      seats: 1200,
      status: 'active',
      manager: 'Nguyễn Văn A'
    },
    {
      id: 2,
      name: 'Lotte Cinema',
      address: '54 Liễu Giai, Ba Đình',
      city: 'Hà Nội',
      phone: '1900 5454',
      rooms: 10,
      seats: 1500,
      status: 'active',
      manager: 'Trần Thị B'
    },
    {
      id: 3,
      name: 'Galaxy Cinema',
      address: '116 Nguyễn Du, Quận 1',
      city: 'TP.HCM',
      phone: '1900 2224',
      rooms: 6,
      seats: 900,
      status: 'active',
      manager: 'Lê Minh C'
    },
    {
      id: 4,
      name: 'BHD Star',
      address: '3 Tháng 2, Quận 10',
      city: 'TP.HCM',
      phone: '1900 2099',
      rooms: 7,
      seats: 1050,
      status: 'maintenance',
      manager: 'Phạm Văn D'
    },
    {
      id: 5,
      name: 'Platinum Cineplex',
      address: '135 Hai Bà Trưng, Hải Châu',
      city: 'Đà Nẵng',
      phone: '0236 3823 222',
      rooms: 5,
      seats: 750,
      status: 'active',
      manager: 'Võ Thị E'
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-gray-900 text-3xl">Quản Lý Rạp</h1>
          <Dialog open={isAddTheaterOpen} onOpenChange={setIsAddTheaterOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Thêm Rạp Mới
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Thêm Rạp Mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="theaterName" className="text-gray-700">Tên Rạp</Label>
                  <Input
                    id="theaterName"
                    placeholder="Nhập tên rạp..."
                    className="bg-gray-50 border-gray-300 text-gray-900 mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-gray-700">Địa Chỉ</Label>
                  <Textarea
                    id="address"
                    placeholder="Nhập địa chỉ..."
                    className="bg-gray-50 border-gray-300 text-gray-900 mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-gray-700">Thành Phố / Tỉnh</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900 mt-2">
                        <SelectValue placeholder="Chọn thành phố..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hanoi">Hà Nội</SelectItem>
                        <SelectItem value="hcm">TP.HCM</SelectItem>
                        <SelectItem value="danang">Đà Nẵng</SelectItem>
                        <SelectItem value="haiphong">Hải Phòng</SelectItem>
                        <SelectItem value="cantho">Cần Thơ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-700">Số Điện Thoại</Label>
                    <Input
                      id="phone"
                      placeholder="1900 xxxx"
                      className="bg-gray-50 border-gray-300 text-gray-900 mt-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rooms" className="text-gray-700">Số Phòng Chiếu</Label>
                    <Input
                      id="rooms"
                      type="number"
                      placeholder="8"
                      className="bg-gray-50 border-gray-300 text-gray-900 mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalSeats" className="text-gray-700">Tổng Số Ghế</Label>
                    <Input
                      id="totalSeats"
                      type="number"
                      placeholder="1200"
                      className="bg-gray-50 border-gray-300 text-gray-900 mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status" className="text-gray-700">Tình Trạng</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900 mt-2">
                      <SelectValue placeholder="Chọn tình trạng..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="maintenance">Bảo trì</SelectItem>
                      <SelectItem value="closed">Đóng cửa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="logo" className="text-gray-700">Ảnh / Logo Rạp</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="bg-gray-50 border-gray-300 text-gray-900 mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="manager" className="text-gray-700">Người Quản Lý</Label>
                  <Input
                    id="manager"
                    placeholder="Nhập tên người quản lý..."
                    className="bg-gray-50 border-gray-300 text-gray-900 mt-2"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    Lưu
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsAddTheaterOpen(false)}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Advanced Filters */}
        <Card className="bg-white border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm tên / địa chỉ..."
                className="pl-10 bg-gray-50 border-gray-300 text-gray-900"
              />
            </div>

            {/* City Filter */}
            <Select>
              <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                <SelectValue placeholder="🏙 Khu vực" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="hanoi">Hà Nội</SelectItem>
                <SelectItem value="hcm">TP.HCM</SelectItem>
                <SelectItem value="danang">Đà Nẵng</SelectItem>
                <SelectItem value="haiphong">Hải Phòng</SelectItem>
                <SelectItem value="cantho">Cần Thơ</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select>
              <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                <SelectValue placeholder="⚙️ Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
                <SelectItem value="closed">Đóng cửa</SelectItem>
              </SelectContent>
            </Select>

            {/* Rooms Filter */}
            <Select>
              <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                <SelectValue placeholder="🎬 Số phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="gt5">&gt; 5 phòng</SelectItem>
                <SelectItem value="5-10">5-10 phòng</SelectItem>
                <SelectItem value="lt5">&lt; 5 phòng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Theaters Table */}
        <Card className="bg-white border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Danh Sách Rạp</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 hover:bg-gray-50">
                <TableHead className="text-gray-600">Tên Rạp</TableHead>
                <TableHead className="text-gray-600">Địa Chỉ</TableHead>
                <TableHead className="text-gray-600">Thành Phố / Tỉnh</TableHead>
                <TableHead className="text-gray-600">Số Điện Thoại</TableHead>
                <TableHead className="text-gray-600">Số Phòng</TableHead>
                <TableHead className="text-gray-600">Tổng Ghế</TableHead>
                <TableHead className="text-gray-600">Trạng Thái</TableHead>
                <TableHead className="text-gray-600">Người Quản Lý</TableHead>
                <TableHead className="text-gray-600">Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {theaters.map((theater) => (
                <TableRow key={theater.id} className="border-gray-200 hover:bg-gray-50">
                  <TableCell className="text-gray-900">{theater.name}</TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{theater.address}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{theater.city}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{theater.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{theater.rooms}</TableCell>
                  <TableCell className="text-gray-600">{theater.seats}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        theater.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : theater.status === 'maintenance'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {theater.status === 'active' ? 'Hoạt động' : theater.status === 'maintenance' ? 'Bảo trì' : 'Đóng cửa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{theater.manager}</TableCell>
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
