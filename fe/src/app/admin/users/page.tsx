"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Eye, Mail, Phone, Calendar, MapPin, CreditCard, Plus, Edit, Trash2, UserPlus, Users } from 'lucide-react';

export default function UserManagementPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('customers');

  const customers = [
    {
      id: 1,
      name: 'Nguyen Van A',
      email: 'nguyenvana@email.com',
      phone: '0912345678',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      role: 'Khách hàng',
      status: 'Hoạt động',
      joinDate: '2024-01-15',
      tickets: 12,
      spent: '$240'
    },
    {
      id: 2,
      name: 'Tran Thi B',
      email: 'tranthib@email.com',
      phone: '0923456789',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      role: 'Khách hàng VIP',
      status: 'Hoạt động',
      joinDate: '2024-02-20',
      tickets: 45,
      spent: '$890'
    },
    {
      id: 3,
      name: 'Le Minh C',
      email: 'leminhc@email.com',
      phone: '0934567890',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
      role: 'Khách hàng',
      status: 'Hoạt động',
      joinDate: '2024-03-10',
      tickets: 8,
      spent: '$160'
    },
    {
      id: 4,
      name: 'Pham Van D',
      email: 'phamvand@email.com',
      phone: '0945678901',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
      role: 'Khách hàng',
      status: 'Tạm khóa',
      joinDate: '2024-04-05',
      tickets: 3,
      spent: '$60'
    },
    {
      id: 5,
      name: 'Vo Thi E',
      email: 'vothie@email.com',
      phone: '0956789012',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      role: 'Khách hàng VIP',
      status: 'Hoạt động',
      joinDate: '2024-05-12',
      tickets: 67,
      spent: '$1,340'
    },
  ];

  const employees = [
    {
      id: 1,
      name: 'Nguyen Van Manager',
      email: 'manager@cinema.com',
      phone: '0901234567',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager1',
      position: 'Quản lý',
      department: 'Vận hành',
      status: 'Hoạt động',
      joinDate: '2023-01-10',
      salary: '25,000,000 VND'
    },
    {
      id: 2,
      name: 'Tran Thi Staff',
      email: 'staff1@cinema.com',
      phone: '0902345678',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Staff1',
      position: 'Nhân viên bán vé',
      department: 'Bán vé',
      status: 'Hoạt động',
      joinDate: '2023-06-15',
      salary: '12,000,000 VND'
    },
    {
      id: 3,
      name: 'Le Van Technician',
      email: 'tech@cinema.com',
      phone: '0903456789',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech1',
      position: 'Kỹ thuật viên',
      department: 'Kỹ thuật',
      status: 'Hoạt động',
      joinDate: '2023-03-20',
      salary: '15,000,000 VND'
    },
    {
      id: 4,
      name: 'Pham Thi Support',
      email: 'support@cinema.com',
      phone: '0904567890',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Support1',
      position: 'Hỗ trợ khách hàng',
      department: 'Dịch vụ',
      status: 'Nghỉ phép',
      joinDate: '2023-08-01',
      salary: '10,000,000 VND'
    },
    {
      id: 5,
      name: 'Hoang Van Marketing',
      email: 'marketing@cinema.com',
      phone: '0905678901',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marketing1',
      position: 'Marketing',
      department: 'Marketing',
      status: 'Hoạt động',
      joinDate: '2023-04-12',
      salary: '18,000,000 VND'
    },
  ];

  const handleViewProfile = (user: any) => {
    setSelectedUser(user);
    setIsProfileOpen(true);
  };

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-[#F8F8F9]">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-gray-900 mb-8">Quản Lý Người Dùng</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-xl">
            <TabsTrigger 
              value="customers" 
              className="rounded-lg data-[state=active]:bg-[#6C63FF] data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Khách hàng
            </TabsTrigger>
            <TabsTrigger 
              value="employees"
              className="rounded-lg data-[state=active]:bg-[#6C63FF] data-[state=active]:text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Nhân viên
            </TabsTrigger>
          </TabsList>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card className="bg-white border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Tìm kiếm khách hàng..."
                    className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
                  />
                </div>
                <Button className="bg-[#6C63FF] hover:bg-[#5a52e0] text-white rounded-xl shadow-md px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm mới
                </Button>
              </div>
            </Card>

            <Card className="bg-white border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50">
                    <TableHead className="text-gray-600">Người Dùng</TableHead>
                    <TableHead className="text-gray-600">Email</TableHead>
                    <TableHead className="text-gray-600">Số Điện Thoại</TableHead>
                    <TableHead className="text-gray-600">Vai Trò</TableHead>
                    <TableHead className="text-gray-600">Trạng Thái</TableHead>
                    <TableHead className="text-gray-600">Ngày Tham Gia</TableHead>
                    <TableHead className="text-gray-600">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((user) => (
                    <TableRow key={user.id} className="border-gray-200 hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-gray-900">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell className="text-gray-600">{user.phone}</TableCell>
                      <TableCell>
                        <Badge className={user.role === 'Khách hàng VIP' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={user.status === 'Hoạt động' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.joinDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-200 text-[#6C63FF] hover:bg-[#6C63FF]/5 rounded-lg"
                            onClick={() => handleViewProfile(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6">
            <Card className="bg-white border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Tìm kiếm nhân viên..."
                    className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
                  />
                </div>
                <Button className="bg-[#6C63FF] hover:bg-[#5a52e0] text-white rounded-xl shadow-md px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm mới
                </Button>
              </div>
            </Card>

            <Card className="bg-white border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50">
                    <TableHead className="text-gray-600">Nhân Viên</TableHead>
                    <TableHead className="text-gray-600">Email</TableHead>
                    <TableHead className="text-gray-600">Số Điện Thoại</TableHead>
                    <TableHead className="text-gray-600">Chức Vụ</TableHead>
                    <TableHead className="text-gray-600">Phòng Ban</TableHead>
                    <TableHead className="text-gray-600">Trạng Thái</TableHead>
                    <TableHead className="text-gray-600">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id} className="border-gray-200 hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback className="bg-purple-100 text-purple-700">{employee.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-gray-900">{employee.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{employee.email}</TableCell>
                      <TableCell className="text-gray-600">{employee.phone}</TableCell>
                      <TableCell>
                        <Badge className="bg-[#6C63FF]/10 text-[#6C63FF] border-[#6C63FF]/20">
                          {employee.position}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{employee.department}</TableCell>
                      <TableCell>
                        <Badge className={employee.status === 'Hoạt động' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}>
                          {employee.status}
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
        </Tabs>

        <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <SheetContent className="bg-white border-gray-200 text-gray-900 w-[400px] sm:w-[540px] overflow-y-auto">
            {selectedUser && (
              <>
                <SheetHeader>
                  <SheetTitle className="text-gray-900">Thông Tin Người Dùng</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">{selectedUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-gray-900 text-xl mb-2">{selectedUser.name}</h3>
                    <Badge className={selectedUser.role === 'Khách hàng VIP' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>
                      {selectedUser.role}
                    </Badge>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-500 text-sm">Email</p>
                        <p className="text-gray-900">{selectedUser.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-500 text-sm">Số Điện Thoại</p>
                        <p className="text-gray-900">{selectedUser.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-500 text-sm">Ngày Tham Gia</p>
                        <p className="text-gray-900">{selectedUser.joinDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-gray-900 mb-4">Thống Kê</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-gray-50 border-gray-200 p-4">
                        <p className="text-gray-500 text-sm mb-1">Tổng Vé</p>
                        <p className="text-gray-900 text-2xl">{selectedUser.tickets}</p>
                      </Card>
                      <Card className="bg-gray-50 border-gray-200 p-4">
                        <p className="text-gray-500 text-sm mb-1">Đã Chi Tiêu</p>
                        <p className="text-gray-900 text-2xl">{selectedUser.spent}</p>
                      </Card>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-gray-900 mb-4">Lịch Sử Giao Dịch</h4>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-gray-900 text-sm">Avengers: Endgame</p>
                              <p className="text-gray-500 text-xs">2024-11-0{i}</p>
                            </div>
                          </div>
                          <span className="text-green-600">$20</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </main>
  );
}