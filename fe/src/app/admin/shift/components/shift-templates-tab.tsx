// app/(admin)/shift-manager/components/shift-templates-tab.tsx
'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Plus, Clock, MoreHorizontal, Pencil, Trash2, Power } from 'lucide-react';
import { ShiftTemplate } from '@/types/shift';

// Imports Modals
import CreateTemplateModal from './modals/create-template-modal';
import UpdateTemplateModal from './modals/update-template-modal';
import ConfirmDeleteAlert from './modals/confirm-delete-alert';

// Imports API Hooks
import { useShiftTemplates, useShiftTemplateMutations, ShiftTemplateCreateDTO } from "@/lib/api/shift-templates";

export default function ShiftTemplatesTab() {
  // 1. Quản lý State Modal
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  
  // 2. State dữ liệu đang chọn
  const [selectedTemplate, setSelectedTemplate] = useState<ShiftTemplate | null>(null);

  // 3. API Hooks (React Query)
  const { data: templates = [], isLoading } = useShiftTemplates();
  const { create, update, remove } = useShiftTemplateMutations();
  const isCreating = create.isPending; 
  const isUpdating = update.isPending;
  const isDeleting = remove.isPending;
  // --- Handlers Mở Modal ---
  const openEdit = (t: ShiftTemplate) => {
      setSelectedTemplate(t);
      setUpdateOpen(true);
  }

  const openDelete = (t: ShiftTemplate) => {
      setSelectedTemplate(t);
      setDeleteAlertOpen(true);
  }
  const handleConfirmDelete = async () => {
      if (!selectedTemplate) return;
      
      await remove.mutate(selectedTemplate._id);
      setDeleteAlertOpen(false)
  }

  // Xử lý Cập nhật
  const handleUpdateSubmit = async (formData: ShiftTemplateCreateDTO) => {
      if (!selectedTemplate) return;
      await update.mutate({
          id: selectedTemplate._id,
          data: formData as ShiftTemplateCreateDTO 
      });
      setUpdateOpen(false)
  }
  const handleCreateSubmit = async (formData: ShiftTemplateCreateDTO) => {
      await create.mutate(formData as ShiftTemplateCreateDTO );
      console.log('test')
      setUpdateOpen(false)
  }

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h3 className="text-xl font-bold text-gray-900">Cấu Hình Ca Mẫu</h3>
            <p className="text-sm text-gray-500">Định nghĩa các khung giờ làm việc chuẩn cho hệ thống.</p>
        </div>
        <Button 
            onClick={() => setCreateOpen(true)}
            className="bg-[#6C63FF] hover:bg-[#5a52e0] text-white rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" /> Thêm Mới
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="w-[100px] text-gray-500 font-medium">Mã Ca</TableHead>
                <TableHead className="text-gray-500 font-medium">Tên Ca</TableHead>
                <TableHead className="text-gray-500 font-medium">Khung Giờ</TableHead>
                <TableHead className="text-gray-500 font-medium">Trạng Thái</TableHead>
                <TableHead className="text-right text-gray-500 font-medium w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((t: ShiftTemplate) => (
                <TableRow key={t._id || t.code} className="group hover:bg-indigo-50/30 transition-colors border-gray-100">
                  <TableCell className="font-semibold text-gray-700">{t.code}</TableCell>
                  <TableCell>
                      <span className="font-medium text-gray-900">{t.name}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-sm font-medium border border-gray-200">
                            <Clock className="w-3.5 h-3.5" />
                            {t.startTime} - {t.endTime}
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <Badge 
                        variant="secondary" 
                        className={`rounded-lg px-2.5 py-0.5 font-medium border ${
                            t.isActive 
                                ? "bg-green-50 text-green-700 border-green-100" 
                                : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                     >
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${t.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {t.isActive ? 'Hoạt động' : 'Đã ẩn'}
                     </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900 rounded-lg">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-lg">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem 
                            onClick={() => openEdit(t)}
                            className="cursor-pointer text-gray-700 focus:bg-indigo-50 focus:text-[#6C63FF] rounded-lg mx-1"
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                            onClick={() => openDelete(t)}
                            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 rounded-lg mx-1 my-1"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa vĩnh viễn
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {templates.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                          Chưa có dữ liệu ca mẫu. Hãy tạo mới!
                      </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Include Modals - Truyền Handlers xuống qua Props */}
      <CreateTemplateModal 
        open={isCreateOpen} 
        onOpenChange={setCreateOpen} 
        onSubmit={handleCreateSubmit}
        isLoading={isCreating}
      />
      
      <UpdateTemplateModal 
        open={isUpdateOpen} 
        onOpenChange={setUpdateOpen} 
        initialData={selectedTemplate}
        onSubmit={handleUpdateSubmit} // Truyền hàm xử lý Update xuống modal
      />
      
      <ConfirmDeleteAlert 
        open={isDeleteAlertOpen} 
        onOpenChange={setDeleteAlertOpen}
        onConfirm={handleConfirmDelete} // Truyền hàm xử lý Delete xuống modal
        title="Xóa Ca Mẫu?"
        description={`Bạn có chắc chắn muốn xóa ca "${selectedTemplate?.name}"? Các lịch làm việc trong quá khứ liên quan đến ca này vẫn sẽ được giữ lại.`}
      />
    </div>
  );
}