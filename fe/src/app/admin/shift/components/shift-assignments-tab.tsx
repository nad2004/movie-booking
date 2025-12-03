// app/(admin)/shift-manager/components/shift-assignments-tab.tsx
'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserPlus, Search, MoreVertical, Edit3, UserX, Clock, MapPin } from 'lucide-react';
import { ShiftAssignment } from '@/types/shift';

// Import Modals
import AssignStaffModal from './modals/assign-staff-modal';
import UpdateAssignmentModal from './modals/update-assignment-modal';
import ConfirmDeleteAlert from './modals/confirm-delete-alert';

// Mock Data
const assignments: ShiftAssignment[] = [
  { id: '1', workScheduleId: 'ws1', userId: 'u1', userName: 'Nguyễn Văn A', role: 'Staff', status: 'Working', checkInTime: '07:55', checkOutTime: '--:--' },
  { id: '2', workScheduleId: 'ws1', userId: 'u2', userName: 'Trần Thị B', role: 'Manager', status: 'Assigned', checkInTime: '--:--', checkOutTime: '--:--' },
  { id: '3', workScheduleId: 'ws2', userId: 'u3', userName: 'Lê C', role: 'Ticket', status: 'Completed', checkInTime: '15:50', checkOutTime: '24:05' },
];

export default function ShiftAssignmentsTab() {
  // Modal States
  const [isAssignOpen, setAssignOpen] = useState(false);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  
  const [selectedAssignment, setSelectedAssignment] = useState<ShiftAssignment | null>(null);

  // Handlers
  const handleEdit = (item: ShiftAssignment) => {
      setSelectedAssignment(item);
      setUpdateOpen(true);
  }

  const handleDelete = (item: ShiftAssignment) => {
      setSelectedAssignment(item);
      setDeleteOpen(true);
  }

  const handleConfirmRemove = () => {
      console.log("Removed staff from shift:", selectedAssignment?.id);
      setDeleteOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Tìm tên nhân viên, mã ca..." className="pl-9 rounded-xl bg-white border-gray-200 focus:ring-[#6C63FF]" />
            </div>
            <Input type="date" className="w-[160px] rounded-xl bg-white border-gray-200" defaultValue="2025-12-01"/>
        </div>
        
        <Button onClick={() => setAssignOpen(true)} className="bg-[#6C63FF] hover:bg-[#5a52e0] text-white rounded-xl shadow-md w-full md:w-auto">
            <UserPlus className="w-4 h-4 mr-2" />
            Phân Công Mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-gray-100 shadow-sm rounded-xl p-4 flex items-center gap-3">
             <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Clock className="w-5 h-5"/></div>
             <div><p className="text-xs text-gray-500 font-medium">Đang làm việc</p><p className="text-xl font-bold text-gray-800">12</p></div>
          </Card>
          <Card className="bg-white border-gray-100 shadow-sm rounded-xl p-4 flex items-center gap-3">
             <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><UserPlus className="w-5 h-5"/></div>
             <div><p className="text-xs text-gray-500 font-medium">Chưa Check-in</p><p className="text-xl font-bold text-gray-800">3</p></div>
          </Card>
      </div>

      {/* Table */}
      <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-0">
            <Table>
            <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="font-medium text-gray-500">Nhân Viên</TableHead>
                <TableHead className="font-medium text-gray-500">Vai Trò</TableHead>
                <TableHead className="font-medium text-gray-500">Check-in / Out</TableHead>
                <TableHead className="font-medium text-gray-500">Trạng Thái</TableHead>
                <TableHead className="text-right w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {assignments.map((a) => (
                <TableRow key={a.id} className="group hover:bg-gray-50 transition-colors">
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9 border border-gray-200">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a.userName}`} />
                                <AvatarFallback className="bg-indigo-50 text-[#6C63FF]">{a.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold text-gray-700">{a.userName}</div>
                                <div className="text-xs text-gray-400">ID: {a.userId}</div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className="font-normal bg-gray-50 text-gray-600 border-gray-200">
                            {a.role}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col text-sm">
                            <span className={a.checkInTime !== '--:--' ? "text-green-600 font-medium" : "text-gray-400"}>
                                In: {a.checkInTime}
                            </span>
                            <span className={a.checkOutTime !== '--:--' ? "text-gray-600" : "text-gray-400"}>
                                Out: {a.checkOutTime}
                            </span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge className={`rounded-lg px-2.5 py-1 font-medium border shadow-none ${
                            a.status === 'Working' ? 'bg-green-50 text-green-700 border-green-100' :
                            a.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                            {a.status === 'Working' && <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>}
                            {a.status === 'Working' ? 'Đang làm' : 
                             a.status === 'Completed' ? 'Hoàn thành' : 'Chờ làm'}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-gray-100 w-[180px]">
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEdit(a)} className="cursor-pointer gap-2">
                                    <Edit3 className="w-4 h-4" /> Cập nhật
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-2">
                                    <MapPin className="w-4 h-4" /> Xem vị trí
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(a)} className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50">
                                    <UserX className="w-4 h-4" /> Hủy phân công
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
      </Card>

      {/* Render Modals */}
      <AssignStaffModal open={isAssignOpen} onOpenChange={setAssignOpen} />
      
      <UpdateAssignmentModal 
        open={isUpdateOpen} 
        onOpenChange={setUpdateOpen} 
        data={selectedAssignment}
      />

      <ConfirmDeleteAlert 
        open={isDeleteOpen} 
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmRemove}
        title="Hủy Phân Công?"
        description={`Bạn muốn xóa ${selectedAssignment?.userName} khỏi ca làm việc này?`}
      />
    </div>
  );
}