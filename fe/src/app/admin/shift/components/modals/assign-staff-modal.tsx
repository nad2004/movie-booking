// app/(admin)/shift-manager/components/modals/assign-staff-modal.tsx
'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AssignStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSchedule?: { id: string, name: string, time: string, date: string }; // Context data
}

export default function AssignStaffModal({ open, onOpenChange, selectedSchedule }: AssignStaffModalProps) {
  const [role, setRole] = useState('Staff');
  const [userId, setUserId] = useState('');

  const handleAssign = () => {
    const payload = {
      workScheduleId: selectedSchedule?.id, // [cite: 59]
      userId: userId, // [cite: 60]
      role: role // [cite: 61]
    };
    console.log("Assigning Staff Payload:", payload);
    // Call API POST /api/v1/assignments
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>Phân Công Nhân Viên</DialogTitle>
          {selectedSchedule && (
             <div className="text-sm text-gray-500 mt-1">
                {selectedSchedule.date} - {selectedSchedule.name} ({selectedSchedule.time})
             </div>
          )}
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Chọn Nhân Viên</Label>
            <Select onValueChange={setUserId}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Tìm kiếm nhân viên..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user_1">
                   <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6"><AvatarFallback>NA</AvatarFallback></Avatar>
                      <span>Nguyễn Văn A (Full-time)</span>
                   </div>
                </SelectItem>
                <SelectItem value="user_2">
                   <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6"><AvatarFallback>TB</AvatarFallback></Avatar>
                      <span>Trần Thị B (Part-time)</span>
                   </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Vai Trò Trong Ca</Label>
            <Select defaultValue="Staff" onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manager">Quản lý ca (Shift Leader)</SelectItem>
                <SelectItem value="Staff">Nhân viên phục vụ</SelectItem>
                <SelectItem value="Ticket">Bán vé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={handleAssign} className="bg-[#6C63FF] hover:bg-[#5a52e0] text-white">
            Xác Nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}