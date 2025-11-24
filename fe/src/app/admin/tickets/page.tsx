"use client";

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Ticket } from 'lucide-react';

export default function TicketManagementPage() {
  const tickets = [
    {
      id: 'TK001',
      movie: 'Avengers: Endgame',
      customer: 'Nguyen Van A',
      theater: 'CGV Vincom',
      room: 'Phòng 5',
      seat: 'A12',
      showtime: '2024-11-05 19:30',
      price: '$20',
      status: 'Đã thanh toán',
      bookingDate: '2024-11-01'
    },
    {
      id: 'TK002',
      movie: 'Spider-Man: No Way Home',
      customer: 'Tran Thi B',
      theater: 'Lotte Cinema',
      room: 'Phòng 3',
      seat: 'B08',
      showtime: '2024-11-06 20:00',
      price: '$22',
      status: 'Đã thanh toán',
      bookingDate: '2024-11-02'
    },
    {
      id: 'TK003',
      movie: 'The Batman',
      customer: 'Le Minh C',
      theater: 'Galaxy Cinema',
      room: 'Phòng 2',
      seat: 'C15',
      showtime: '2024-11-07 18:00',
      price: '$18',
      status: 'Chờ thanh toán',
      bookingDate: '2024-11-03'
    },
    {
      id: 'TK004',
      movie: 'Inception',
      customer: 'Pham Van D',
      theater: 'BHD Star',
      room: 'Phòng 1',
      seat: 'D20',
      showtime: '2024-11-08 21:00',
      price: '$25',
      status: 'Đã hủy',
      bookingDate: '2024-11-04'
    },
    {
      id: 'TK005',
      movie: 'Interstellar',
      customer: 'Vo Thi E',
      theater: 'Platinum Cineplex',
      room: 'Phòng 4',
      seat: 'E10',
      showtime: '2024-11-09 19:00',
      price: '$23',
      status: 'Đã thanh toán',
      bookingDate: '2024-11-05'
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-gray-900 text-3xl mb-8">Quản Lý Vé</h1>

        <Card className="bg-white border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm mã vé..."
                className="pl-10 bg-gray-50 border-gray-300 text-gray-900"
              />
            </div>
            <Select>
              <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                <SelectValue placeholder="Rạp chiếu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="cgv">CGV Vincom</SelectItem>
                <SelectItem value="lotte">Lotte Cinema</SelectItem>
                <SelectItem value="galaxy">Galaxy Cinema</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
                <SelectItem value="pending">Chờ thanh toán</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="bg-gray-50 border-gray-300 text-gray-900"
            />
          </div>
        </Card>

        <Card className="bg-white border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Danh Sách Vé</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 hover:bg-gray-50">
                <TableHead className="text-gray-600">Mã Vé</TableHead>
                <TableHead className="text-gray-600">Phim</TableHead>
                <TableHead className="text-gray-600">Khách Hàng</TableHead>
                <TableHead className="text-gray-600">Rạp</TableHead>
                <TableHead className="text-gray-600">Phòng</TableHead>
                <TableHead className="text-gray-600">Ghế</TableHead>
                <TableHead className="text-gray-600">Suất Chiếu</TableHead>
                <TableHead className="text-gray-600">Giá</TableHead>
                <TableHead className="text-gray-600">Trạng Thái</TableHead>
                <TableHead className="text-gray-600">Ngày Đặt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="border-gray-200 hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-900">{ticket.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900">{ticket.movie}</TableCell>
                  <TableCell className="text-gray-600">{ticket.customer}</TableCell>
                  <TableCell className="text-gray-600">{ticket.theater}</TableCell>
                  <TableCell className="text-gray-600">{ticket.room}</TableCell>
                  <TableCell className="text-gray-600">{ticket.seat}</TableCell>
                  <TableCell className="text-gray-600">{ticket.showtime}</TableCell>
                  <TableCell className="text-gray-900">{ticket.price}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        ticket.status === 'Đã thanh toán'
                          ? 'bg-green-100 text-green-700'
                          : ticket.status === 'Chờ thanh toán'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{ticket.bookingDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </main>
  );
}
