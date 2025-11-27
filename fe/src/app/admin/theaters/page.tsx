'use client'

import { useState } from "react";
import { useTheaters } from "@/lib/api/theaters";
import { useTheaterMutations } from "./hooks/useTheaterMutations";
import { TheaterTable } from "./components/TheaterTable";
import { TheaterFormDialog } from "./components/TheaterFormDialog";
import { Theater } from "@/types/theater";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDebounce } from "@/hooks/useDebounce"; 

export default function TheaterManagementPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [theaterToEdit, setTheaterToEdit] = useState<Theater | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch Data
  const { data: theaterList, isLoading } = useTheaters({ 
    search: debouncedSearch, 
    limit: 100 
  });
  
  const { deleteMutation } = useTheaterMutations();

  const handleAdd = () => {
    setTheaterToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (theater: Theater) => {
    setTheaterToEdit(theater);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
    }
  };

  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-gray-900 text-3xl font-bold">Quản Lý Rạp</h1>

        {/* Toolbar */}
        <Card className="bg-white border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm rạp..."
                className="pl-9 bg-gray-50 border-gray-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="w-4 h-4" /> Thêm Rạp Mới
            </Button>
          </div>
        </Card>

        {/* Table */}
        <TheaterTable 
          theaters={theaterList?.theaters || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteId(id)}
        />
      </div>

      {/* Dialogs */}
      <TheaterFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        theaterToEdit={theaterToEdit} 
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-gray-50 text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-300! hover:text-gray-800!">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}