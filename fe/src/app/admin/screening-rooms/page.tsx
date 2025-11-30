'use client'

import { useState, useMemo, useRef } from 'react';
import { useTheaters } from '@/lib/api/theaters';
import { useRoomMutations } from './hooks/useRoomMutations';
import { RoomTable } from './components/RoomTable';
import { RoomToolbar } from './components/RoomToolbar';
import { RoomFormDialog, FlatRoom } from './components/RoomFormDialog';
import { AdminSeatMap } from './components/AdminSeatMap'; // Import mới
import { Seat } from '@/types/theater';
import { toast } from "sonner"; // Giả sử bạn dùng sonner hoặc thư viện toast nào đó trong package.json
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ScreeningRoomPage() {
  // State
  const [search, setSearch] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<FlatRoom | null>(null);
  const [deleteInfo, setDeleteInfo] = useState<{ tid: string, rid: string } | null>(null);

  // State mới cho việc xem SeatMap
  const [viewingRoom, setViewingRoom] = useState<FlatRoom | null>(null);
  const seatMapRef = useRef<HTMLDivElement>(null); // Ref để scroll tới map

  // Fetch Data
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

  const { deleteMutation, updateMutation, updateSeatMutation } = useRoomMutations();

  // Handlers
  const handleAdd = () => {
    setRoomToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (room: FlatRoom) => {
    setRoomToEdit(room);
    setIsDialogOpen(true);
  };

  // Handler mới: Mở seat map
  const handleViewSeatMap = (room: FlatRoom) => {
    setViewingRoom(room);
    // Tự động scroll xuống phần map sau 100ms
    setTimeout(() => {
        seatMapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handler mới: Lưu seat map đã chỉnh sửa
  const handleSaveSeatMap = (updatedSeats: Seat[]) => {
    if (!viewingRoom) return;

    updateSeatMutation.mutate(
        { 
          theaterId: viewingRoom.theater._id, 
          roomId: viewingRoom._id, 
          data: {
            seats: updatedSeats
          } 
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

        <RoomTable 
            rooms={filteredRooms}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={(tid, rid) => setDeleteInfo({ tid, rid })}
            onView={handleViewSeatMap} // Pass handler xuống
        />

        {/* SECTION: ADMIN SEAT MAP */}
        {viewingRoom && (
            <div ref={seatMapRef} className="pt-4 border-t border-gray-200">
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