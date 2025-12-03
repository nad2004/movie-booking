// app/(admin)/shift-manager/components/work-planning-tab.tsx
'use client'

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import GenerateScheduleModal from './modals/generate-schedule-modal';
import ConfirmDeleteAlert from './modals/confirm-delete-alert';

// Mock Data: Các slot đã được tạo ra (WorkSchedules)
const mockSchedules = [
    { id: 'ws1', date: '2025-12-01', templateName: 'Ca Sáng', time: '08:00 - 16:00', color: 'border-l-blue-500 bg-blue-50' },
    { id: 'ws2', date: '2025-12-01', templateName: 'Ca Chiều', time: '16:00 - 24:00', color: 'border-l-orange-500 bg-orange-50' },
    { id: 'ws3', date: '2025-12-02', templateName: 'Ca Sáng', time: '08:00 - 16:00', color: 'border-l-blue-500 bg-blue-50' },
];

export default function WorkPlanningTab() {
  const [isGenerateOpen, setGenerateOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
      setSelectedScheduleId(id);
      setDeleteAlertOpen(true);
  }

  const handleConfirmDelete = () => {
      console.log("Deleted Schedule:", selectedScheduleId);
      // API call delete work schedule
      setDeleteAlertOpen(false);
  }

  // Helper render lịch tuần (Mock 7 ngày)
  const renderDays = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
        const dateStr = `2025-12-0${i}`; // Mock date string
        const daySchedules = mockSchedules.filter(s => s.date === dateStr);
        
        days.push(
            <div key={i} className="min-h-[160px] bg-white border border-gray-100 rounded-xl p-3 flex flex-col gap-2 transition-all hover:shadow-md hover:border-indigo-100 group/cell">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-gray-700">0{i}/12</span>
                    <span className="text-xs text-gray-400 font-medium">Thứ {i + 1}</span>
                </div>
                
                {/* Empty State cho ngày không có lịch */}
                {daySchedules.length === 0 && (
                     <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
                        <span className="text-[10px] text-gray-300">Trống</span>
                     </div>
                )}

                {/* Danh sách các ca trong ngày */}
                {daySchedules.map(sch => (
                    <div key={sch.id} className={`relative group/item relative pl-2 py-2 pr-2 rounded-lg border border-gray-100 ${sch.color} transition-all`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-xs font-bold text-gray-800">{sch.templateName}</div>
                                <div className="text-[10px] text-gray-500 mt-0.5">{sch.time}</div>
                            </div>
                        </div>
                        {/* Nút xóa nhanh (chỉ hiện khi hover) */}
                        <button 
                            onClick={() => handleDeleteClick(sch.id)}
                            className="absolute top-1 right-1 opacity-0 group-hover/item:opacity-100 p-1 hover:bg-white rounded-full text-gray-400 hover:text-red-500 transition-all"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        );
    }
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <Card className="p-4 rounded-2xl border-gray-100 shadow-sm bg-white">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-3 items-center w-full md:w-auto">
            <Select defaultValue="theater1">
              <SelectTrigger className="w-[220px] rounded-xl bg-gray-50 border-gray-200 focus:ring-[#6C63FF]">
                <SelectValue placeholder="Chọn rạp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="theater1">CGV Vincom (Q1)</SelectItem>
                <SelectItem value="theater2">Galaxy Nguyễn Du (Q1)</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-200">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><ChevronLeft className="w-4 h-4 text-gray-500" /></Button>
                <div className="px-3 text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#6C63FF]" />
                    Tháng 12, 2025
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><ChevronRight className="w-4 h-4 text-gray-500" /></Button>
            </div>
          </div>

          <Button 
            onClick={() => setGenerateOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md shadow-amber-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Sinh Lịch Tự Động
          </Button>
        </div>
      </Card>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3">
        {/* Header Ngày */}
        {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map((d, i) => (
            <div key={i} className="text-center text-sm font-medium text-gray-400 py-2 uppercase tracking-wide">
                {d}
            </div>
        ))}
        
        {/* Render Cells */}
        {renderDays()}
      </div>

      {/* Modals */}
      <GenerateScheduleModal open={isGenerateOpen} onOpenChange={setGenerateOpen} />
      
      <ConfirmDeleteAlert 
        open={deleteAlertOpen} 
        onOpenChange={setDeleteAlertOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa Lịch Làm Việc?"
        description="Bạn có chắc chắn muốn xóa khung giờ này? Nếu đã có nhân viên được phân công, họ sẽ bị hủy ca."
      />
    </div>
  );
}