'use client'

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Search, Plus, Edit, Trash2, Clock, Calendar, CheckCircle, XCircle, Sparkles, Filter } from 'lucide-react';

export default function WorkShiftManagementPage() {
  const [activeTab, setActiveTab] = useState('shifts');
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data cho ca làm việc
  const shifts = [
    { id: 1, code: 'CA001', name: 'Ca Sáng', startTime: '06:00', endTime: '14:00', status: 'Hoạt động' },
    { id: 2, code: 'CA002', name: 'Ca Chiều', startTime: '14:00', endTime: '22:00', status: 'Hoạt động' },
    { id: 3, code: 'CA003', name: 'Ca Tối', startTime: '18:00', endTime: '02:00', status: 'Hoạt động' },
    { id: 4, code: 'CA004', name: 'Ca Đêm', startTime: '22:00', endTime: '06:00', status: 'Không hoạt động' },
  ];

  // Mock data cho yêu cầu đổi ca
  const swapRequests = [
    {
      id: 1,
      employee: 'Nguyễn Văn A',
      currentShift: 'Ca Sáng - 06:00-14:00',
      requestedShift: 'Ca Chiều - 14:00-22:00',
      reason: 'Có việc gia đình',
      requestDate: '2024-11-20 09:30',
      status: 'Pending'
    },
    {
      id: 2,
      employee: 'Trần Thị B',
      currentShift: 'Ca Tối - 18:00-02:00',
      requestedShift: 'Ca Sáng - 06:00-14:00',
      reason: 'Xin chuyển ca để đi học',
      requestDate: '2024-11-21 14:15',
      status: 'Approved'
    },
    {
      id: 3,
      employee: 'Lê Minh C',
      currentShift: 'Ca Chiều - 14:00-22:00',
      requestedShift: 'Ca Đêm - 22:00-06:00',
      reason: 'Đổi ca với đồng nghiệp',
      requestDate: '2024-11-22 10:45',
      status: 'Rejected'
    },
    {
      id: 4,
      employee: 'Phạm Văn D',
      currentShift: 'Ca Sáng - 06:00-14:00',
      requestedShift: 'Ca Tối - 18:00-02:00',
      reason: 'Yêu cầu đổi ca vì lý do cá nhân',
      requestDate: '2024-11-23 08:20',
      status: 'Pending'
    },
  ];

  // Mock data cho chấm công
  const attendance = [
    {
      id: 1,
      employee: 'Nguyễn Văn A',
      shift: 'Ca Sáng',
      checkIn: '06:05',
      checkOut: '14:10',
      totalHours: '8.0',
      note: 'Đúng giờ'
    },
    {
      id: 2,
      employee: 'Trần Thị B',
      shift: 'Ca Chiều',
      checkIn: '14:15',
      checkOut: '22:05',
      totalHours: '7.8',
      note: 'Đến trễ 15 phút'
    },
    {
      id: 3,
      employee: 'Lê Minh C',
      shift: 'Ca Tối',
      checkIn: '18:00',
      checkOut: '02:00',
      totalHours: '8.0',
      note: 'Đúng giờ'
    },
    {
      id: 4,
      employee: 'Phạm Văn D',
      shift: 'Ca Sáng',
      checkIn: '05:55',
      checkOut: '14:00',
      totalHours: '8.1',
      note: 'Đến sớm'
    },
    {
      id: 5,
      employee: 'Võ Thị E',
      shift: 'Ca Chiều',
      checkIn: '14:00',
      checkOut: '21:50',
      totalHours: '7.8',
      note: 'Về sớm 10 phút'
    },
  ];

  const handleApprove = (id: number) => {
    console.log('Approved request:', id);
  };

  const handleReject = (id: number) => {
    console.log('Rejected request:', id);
  };

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-[#F8F8F9]">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-gray-900 mb-8">Quản Lý Ca Làm Việc</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-xl">
            <TabsTrigger 
              value="shifts" 
              className="rounded-lg data-[state=active]:bg-[#6C63FF] data-[state=active]:text-white"
            >
              <Clock className="w-4 h-4 mr-2" />
              Danh Sách Ca Làm Việc
            </TabsTrigger>
            <TabsTrigger 
              value="swap"
              className="rounded-lg data-[state=active]:bg-[#6C63FF] data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Duyệt Đổi Ca
            </TabsTrigger>
            <TabsTrigger 
              value="attendance"
              className="rounded-lg data-[state=active]:bg-[#6C63FF] data-[state=active]:text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Chấm Công
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Danh sách ca làm việc */}
          <TabsContent value="shifts" className="space-y-6">
            <Card className="bg-white border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Tìm kiếm theo tên ca..."
                    className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
                  />
                </div>
                <Button 
                  className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md px-6"
                  onClick={() => console.log('Auto generate')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Tạo Lịch Tự Động
                </Button>
                <Button 
                  className="bg-[#6C63FF] hover:bg-[#5a52e0] text-white rounded-xl shadow-md px-6"
                  onClick={() => setIsShiftModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Ca Làm Việc
                </Button>
              </div>

              <div className="flex gap-4">
                <Select value={selectedTheater} onValueChange={setSelectedTheater}>
                  <SelectTrigger className="w-[200px] bg-gray-50 border-gray-200 rounded-xl">
                    <SelectValue placeholder="Chọn rạp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả rạp</SelectItem>
                    <SelectItem value="theater1">CGV Vincom</SelectItem>
                    <SelectItem value="theater2">Galaxy Nguyễn Du</SelectItem>
                    <SelectItem value="theater3">Lotte Cinema</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[200px] bg-gray-50 border-gray-200 rounded-xl">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <Card className="bg-white border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50">
                    <TableHead className="text-gray-600">Mã Ca</TableHead>
                    <TableHead className="text-gray-600">Tên Ca</TableHead>
                    <TableHead className="text-gray-600">Giờ Bắt Đầu</TableHead>
                    <TableHead className="text-gray-600">Giờ Kết Thúc</TableHead>
                    <TableHead className="text-gray-600">Trạng Thái</TableHead>
                    <TableHead className="text-gray-600">Hành Động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.map((shift) => (
                    <TableRow key={shift.id} className="border-gray-200 hover:bg-gray-50">
                      <TableCell className="text-gray-900">{shift.code}</TableCell>
                      <TableCell className="text-gray-900">{shift.name}</TableCell>
                      <TableCell className="text-gray-600">{shift.startTime}</TableCell>
                      <TableCell className="text-gray-600">{shift.endTime}</TableCell>
                      <TableCell>
                        <Badge className={shift.status === 'Hoạt động' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}>
                          {shift.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-200 text-[#6C63FF] hover:bg-[#6C63FF]/5 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-200 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Tab 2: Duyệt đổi ca */}
          <TabsContent value="swap" className="space-y-6">
            <Card className="bg-white border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">Yêu Cầu Đổi Ca</h2>
                <div className="flex gap-2">
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 px-3 py-1">
                    {swapRequests.filter(r => r.status === 'Pending').length} chờ duyệt
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50">
                    <TableHead className="text-gray-600">Nhân Viên</TableHead>
                    <TableHead className="text-gray-600">Ca Hiện Tại</TableHead>
                    <TableHead className="text-gray-600">Ca Muốn Đổi</TableHead>
                    <TableHead className="text-gray-600">Lý Do</TableHead>
                    <TableHead className="text-gray-600">Thời Gian Gửi</TableHead>
                    <TableHead className="text-gray-600">Trạng Thái</TableHead>
                    <TableHead className="text-gray-600">Hành Động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {swapRequests.map((request) => (
                    <TableRow key={request.id} className="border-gray-200 hover:bg-gray-50">
                      <TableCell className="text-gray-900">{request.employee}</TableCell>
                      <TableCell className="text-gray-600">{request.currentShift}</TableCell>
                      <TableCell className="text-gray-600">{request.requestedShift}</TableCell>
                      <TableCell className="text-gray-600 max-w-xs truncate">{request.reason}</TableCell>
                      <TableCell className="text-gray-600">{request.requestDate}</TableCell>
                      <TableCell>
                        <Badge className={
                          request.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          request.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                          'bg-red-100 text-red-700 border-red-200'
                        }>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.status === 'Pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                              onClick={() => handleApprove(request.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                              onClick={() => handleReject(request.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Từ chối
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Tab 3: Chấm công */}
          <TabsContent value="attendance" className="space-y-6">
            <Card className="bg-white border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[200px] bg-gray-50 border-gray-200 rounded-xl">
                    <SelectValue placeholder="Chọn rạp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả rạp</SelectItem>
                    <SelectItem value="theater1">CGV Vincom</SelectItem>
                    <SelectItem value="theater2">Galaxy Nguyễn Du</SelectItem>
                    <SelectItem value="theater3">Lotte Cinema</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  className="w-[200px] bg-gray-50 border-gray-200 rounded-xl"
                  defaultValue="2024-11-26"
                />

                <Button className="bg-[#6C63FF] hover:bg-[#5a52e0] text-white rounded-xl px-6">
                  <Filter className="w-4 h-4 mr-2" />
                  Lọc
                </Button>
              </div>
            </Card>

            <Card className="bg-white border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50">
                    <TableHead className="text-gray-600">Nhân Viên</TableHead>
                    <TableHead className="text-gray-600">Ca Làm Việc</TableHead>
                    <TableHead className="text-gray-600">Check-in</TableHead>
                    <TableHead className="text-gray-600">Check-out</TableHead>
                    <TableHead className="text-gray-600">Tổng Giờ Làm</TableHead>
                    <TableHead className="text-gray-600">Ghi Chú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record) => (
                    <TableRow key={record.id} className="border-gray-200 hover:bg-gray-50">
                      <TableCell className="text-gray-900">{record.employee}</TableCell>
                      <TableCell className="text-gray-600">{record.shift}</TableCell>
                      <TableCell className="text-gray-600">{record.checkIn}</TableCell>
                      <TableCell className="text-gray-600">{record.checkOut}</TableCell>
                      <TableCell className="text-gray-900">{record.totalHours}h</TableCell>
                      <TableCell>
                        <Badge className={
                          record.note.includes('Đúng giờ') || record.note.includes('sớm') ? 
                          'bg-green-100 text-green-700 border-green-200' : 
                          'bg-amber-100 text-amber-700 border-amber-200'
                        }>
                          {record.note}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal thêm/sửa ca làm việc */}
        <Dialog open={isShiftModalOpen} onOpenChange={setIsShiftModalOpen}>
          <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Thêm Ca Làm Việc</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="shift-name">Tên Ca</Label>
                <Input
                  id="shift-name"
                  placeholder="VD: Ca Sáng"
                  className="bg-gray-50 border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Giờ Bắt Đầu</Label>
                  <Input
                    id="start-time"
                    type="time"
                    className="bg-gray-50 border-gray-200 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">Giờ Kết Thúc</Label>
                  <Input
                    id="end-time"
                    type="time"
                    className="bg-gray-50 border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Ghi Chú</Label>
                <Textarea
                  id="note"
                  placeholder="Nhập ghi chú (nếu có)..."
                  className="bg-gray-50 border-gray-200 rounded-xl min-h-[100px]"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="status">Trạng Thái</Label>
                <Switch id="status" />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsShiftModalOpen(false)}
                className="border-gray-200 rounded-xl"
              >
                Hủy
              </Button>
              <Button
                className="bg-[#6C63FF] hover:bg-[#5a52e0] text-white rounded-xl"
                onClick={() => setIsShiftModalOpen(false)}
              >
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
