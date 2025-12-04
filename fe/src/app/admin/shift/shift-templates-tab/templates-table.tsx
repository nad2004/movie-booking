'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { ShiftTemplate } from '@/types/shift';

interface TemplatesTableProps {
  data: ShiftTemplate[];
  isLoading: boolean;
  onEdit: (template: ShiftTemplate) => void;
  onDelete: (template: ShiftTemplate) => void;
}

export default function TemplatesTable({ data, isLoading, onEdit, onDelete }: TemplatesTableProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
  }

  return (
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
            {data.map((t) => (
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
                        onClick={() => onEdit(t)}
                        className="cursor-pointer text-gray-700 focus:bg-indigo-50 focus:text-[#6C63FF] rounded-lg mx-1"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onDelete(t)}
                        className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 rounded-lg mx-1 my-1"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Xóa vĩnh viễn
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
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
  );
}