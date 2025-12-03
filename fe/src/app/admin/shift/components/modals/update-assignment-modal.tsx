// app/(admin)/shift-manager/components/modals/update-assignment-modal.tsx
'use client'

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShiftAssignment } from '@/types/shift';

interface UpdateAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ShiftAssignment | null;
}

export default function UpdateAssignmentModal({ open, onOpenChange, data }: UpdateAssignmentModalProps) {
  const [formData, setFormData] = useState<Partial<ShiftAssignment>>({});

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleSave = () => {
    console.log("Updating Assignment:", formData);
    // Call API PUT /api/v1/assignments/{id}
    onOpenChange(false);
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>Cập nhật Phân Công</DialogTitle>
          <div className="text-sm text-gray-500">{data.userName} - {data.id}</div>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <Label>Vai Trò</Label>
            <Select 
                value={formData.role} 
                onValueChange={(val: any) => setFormData({...formData, role: val})}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manager">Quản lý (Manager)</SelectItem>
                <SelectItem value="Staff">Nhân viên (Staff)</SelectItem>
                <SelectItem value="Ticket">Soát vé (Ticket)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Giờ Check-in</Label>
                <Input 
                    type="time" 
                    value={formData.checkInTime || ''} 
                    onChange={(e) => setFormData({...formData, checkInTime: e.target.value})}
                    className="bg-gray-50 border-gray-200"
                />
            </div>
            <div className="space-y-2">
                <Label>Giờ Check-out</Label>
                <Input 
                    type="time" 
                    value={formData.checkOutTime || ''} 
                    onChange={(e) => setFormData({...formData, checkOutTime: e.target.value})}
                    className="bg-gray-50 border-gray-200"
                />
            </div>
          </div>

           <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select 
                value={formData.status} 
                onValueChange={(val: any) => setFormData({...formData, status: val})}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Assigned">Đã phân công</SelectItem>
                <SelectItem value="Working">Đang làm việc</SelectItem>
                <SelectItem value="Completed">Đã hoàn thành</SelectItem>
                <SelectItem value="Absent">Vắng mặt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={handleSave} className="bg-[#6C63FF] hover:bg-[#5a52e0] text-white">Lưu Thay Đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}