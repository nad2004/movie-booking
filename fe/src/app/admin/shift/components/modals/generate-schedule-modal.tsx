// app/(admin)/shift-manager/components/modals/generate-schedule-modal.tsx
'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GenerateScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GenerateScheduleModal({ open, onOpenChange }: GenerateScheduleModalProps) {
  // State mock template options
  const templateOptions = [
    { id: 'template_sang', label: 'Ca Sáng (08:00 - 16:00)' },
    { id: 'template_chieu', label: 'Ca Chiều (16:00 - 24:00)' },
    { id: 'template_toi', label: 'Ca Tối (18:00 - 02:00)' },
  ];

  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  
  const handleGenerate = () => {
    // Payload chuẩn bị gửi đi [cite: 44-52]
    const payload = {
      theaterId: "theater_selected", // Lấy từ state hoặc props
      range: {
        from: "2025-12-01", // Lấy từ input date
        to: "2025-12-07"
      },
      templateIds: selectedTemplates
    };
    console.log("Generating Schedule Payload:", payload);
    // Call API POST /api/v1/schedules/generate [cite: 24]
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>Sinh Lịch Tự Động (Generate)</DialogTitle>
          <DialogDescription>
            Hệ thống sẽ tạo lịch làm việc trống cho khoảng thời gian bạn chọn.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Chọn Rạp */}
          <div className="space-y-2">
            <Label>Áp dụng cho Rạp</Label>
            <Select defaultValue="theater1">
              <SelectTrigger>
                <SelectValue placeholder="Chọn rạp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="theater1">CGV Vincom</SelectItem>
                <SelectItem value="theater2">Galaxy Nguyễn Du</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Chọn Thời Gian [cite: 47-50] */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <Input type="date" />
            </div>
          </div>

          {/* Chọn Ca Mẫu [cite: 51] */}
          <div className="space-y-3">
            <Label>Chọn các Ca Mẫu muốn áp dụng</Label>
            <div className="border rounded-md p-4 space-y-3">
              {templateOptions.map((t) => (
                <div key={t.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={t.id} 
                    onCheckedChange={(checked) => {
                      if(checked) setSelectedTemplates([...selectedTemplates, t.id]);
                      else setSelectedTemplates(selectedTemplates.filter(id => id !== t.id));
                    }}
                  />
                  <Label htmlFor={t.id} className="font-normal cursor-pointer">{t.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button className="bg-primary! hover:bg-primary/80! text-white" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={handleGenerate} className="bg-accent! hover:bg-accent/90! text-white">
            Tạo Lịch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}