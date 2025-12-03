'use client'

import { useRouter, useSearchParams } from 'next/navigation' // [Mới] Import router
import { useState, useMemo, useRef, useEffect } from 'react';
import { useTheaters } from '@/lib/api/theaters';
import { useRoomMutations } from './hooks/useRoomMutations';
import { RoomTable } from './components/RoomTable';
import { RoomToolbar } from './components/RoomToolbar';
import { RoomFormDialog, FlatRoom } from './components/RoomFormDialog';
import { AdminSeatMap } from './components/AdminSeatMap';
import { Seat } from '@/types/theater';
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// [Mới] Import components phân trang
import { CustomPagination, PaginationInfo } from '@/app/components/shared/custom-pagination'

export default function ScreeningRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // [Mới] Lấy page từ URL
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 10;

  // State
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [search, setSearch] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<FlatRoom | null>(null);
  const [deleteInfo, setDeleteInfo] = useState<{ tid: string, rid: string } | null>(null);

  // State cho SeatMap
  const [viewingRoom, setViewingRoom] = useState<FlatRoom | null>(null);
  const seatMapRef = useRef<HTMLDivElement>(null);

  // Fetch Data
  // Lưu ý: Vẫn lấy limit lớn để có đủ dữ liệu flatten, phân trang sẽ xử lý ở client
  const { data: theaterList, isLoading } = useTheaters({ limit: 100 });
  const theaters = theaterList?.theaters || [];

  // Flatten Data
  const allRooms: FlatRoom[] = useMemo(() => {
    if (!theaters) return [];
    const rooms: FlatRoom[] = [];
    theaters.forEach(theater => {
        if (theater.rooms) {
            theater.rooms.forEach((room: any) => {
                rooms.push({
                    ...room,
                    _id: room._id || Math.random().toString(),
                    theater: theater,
                    theaterName: theater.name
                });
            });
        }
    });
    return rooms;
  }, [theaters]);

  // Filter
  const filteredRooms = useMemo(() => {
    return allRooms.filter(room => {
        const matchSearch = room.roomName.toLowerCase().includes(search.toLowerCase());
        const matchTheater = selectedTheater === "all" || room.theater._id === selectedTheater;
        return matchSearch && matchTheater;
    });
  }, [allRooms, search, selectedTheater]);

  // [Mới] Logic Phân trang Client-side
  const totalItems = filteredRooms.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRooms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRooms, currentPage, itemsPerPage]);

  const { deleteMutation, updateMutation, updateSeatMutation } = useRoomMutations();

  // [Mới] Đồng bộ URL khi page thay đổi
  const updateUrlParams = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // [Mới] Đồng bộ state từ URL (nếu user back/forward browser)
  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  // [Mới] Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    if (currentPage !== 1) {
       // Cập nhật URL về trang 1 mà không cần gọi router.push ngay lập tức nếu muốn tối ưu,
       // nhưng ở đây ta gọi để đồng bộ
       updateUrlParams(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedTheater]);


  // Handlers
  const handleAdd = () => {
    setRoomToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (room: FlatRoom) => {
    setRoomToEdit(room);
    setIsDialogOpen(true);
  };

  const handleViewSeatMap = (room: FlatRoom) => {
    setViewingRoom(room);
    setTimeout(() => {
        seatMapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSaveSeatMap = (updatedSeats: Seat[]) => {
    if (!viewingRoom) return;
    updateSeatMutation.mutate(
        { 
          theaterId: viewingRoom.theater._id, 
          roomId: viewingRoom._id, 
          data: { seats: updatedSeats } 
        },
        { 
          onSuccess: () => {
             toast.success("Cập nhật sơ đồ ghế thành công!");
             setViewingRoom({ ...viewingRoom, seatMap: updatedSeats });
          },
          onError: () => {
             toast.error("Có lỗi xảy ra khi lưu sơ đồ.");
          }
        }
    );
  };

  const handleDelete = () => {
    if (deleteInfo) {
      deleteMutation.mutate(
        { theaterId: deleteInfo.tid, roomId: deleteInfo.rid }, 
        { onSuccess: () => setDeleteInfo(null) }
      );
    }
  };

  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <h1 className="text-gray-900 text-3xl font-bold">Quản Lý Phòng Chiếu</h1>

        <RoomToolbar 
            search={search}
            onSearchChange={setSearch}
            selectedTheater={selectedTheater}
            onTheaterChange={setSelectedTheater}
            theaters={theaters}
            onOpenAdd={handleAdd}
        />

        {/* Truyền dữ liệu đã phân trang vào Table */}
        <RoomTable 
            rooms={paginatedRooms}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={(tid, rid) => setDeleteInfo({ tid, rid })}
            onView={handleViewSeatMap}
        />

        {/* [Mới] UI Phân trang */}
        <div className="flex flex-col gap-4 mt-4">
            <PaginationInfo
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
            />

            <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showPageNumbers={5}
            />
        </div>

        {/* SECTION: ADMIN SEAT MAP */}
        {viewingRoom && (
            <div ref={seatMapRef} className="pt-4 border-t border-gray-200 mt-6">
                <AdminSeatMap 
                    room={viewingRoom} 
                    onClose={() => setViewingRoom(null)}
                    onSave={handleSaveSeatMap}
                    isSaving={updateMutation.isPending}
                />
            </div>
        )}
      </div>

      <RoomFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        roomToEdit={roomToEdit}
        theaters={theaters}
      />

      <AlertDialog open={!!deleteInfo} onOpenChange={() => setDeleteInfo(null)}>
        <AlertDialogContent className="bg-gray-50 text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa phòng?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-300! hover:text-gray-800!">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}  className="bg-red-600 hover:bg-red-700">Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}