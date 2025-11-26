import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Theater, Room } from "@/types/theater";
import { useRoomMutations } from "../hooks/useRoomMutations";
import { generateSeatMap } from "@/lib/api/rooms";
// Mở rộng type Room để có theaterId khi edit (do ta làm phẳng dữ liệu ở Page)
export interface FlatRoom extends Room {
  theater: Theater; 
  _id: string; // Giả sử Room có _id (thường mongo subdoc sẽ có)
}

interface RoomFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomToEdit?: FlatRoom | null;
  theaters: Theater[];
}

export function RoomFormDialog({ open, onOpenChange, roomToEdit, theaters }: RoomFormDialogProps) {
  const { createMutation, updateMutation } = useRoomMutations();
  const isEditMode = !!roomToEdit;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      roomName: "",
      theaterId: "",
      roomType: "2D",
      screenType: "Standard",
      rows: 10,
      seatsPerRow: 12,
      totalSeats: 120,
      isActive: "true"
    }
  });

  // Auto calculate total seats
  const rows = watch("rows");
  const cols = watch("seatsPerRow");
  useEffect(() => {
    setValue("totalSeats", rows * cols);
  }, [rows, cols, setValue]);

  useEffect(() => {
    if (roomToEdit) {
      setValue("roomName", roomToEdit.roomName);
      setValue("theaterId", roomToEdit.theater._id);
      setValue("roomType", roomToEdit.roomType);
      setValue("screenType", roomToEdit.screenType);
      setValue("rows", roomToEdit.rows);
      setValue("seatsPerRow", roomToEdit.seatsPerRow);
      setValue("totalSeats", roomToEdit.totalSeats);
      setValue("isActive", String(roomToEdit.isActive));
    } else {
      reset({
         roomName: "", theaterId: "", roomType: "2D", screenType: "Standard",
         rows: 10, seatsPerRow: 12, totalSeats: 120, isActive: "true"
      });
    }
  }, [roomToEdit, open, reset, setValue]);

  const onSubmit = (data: any) => {
    const seatMap = generateSeatMap(Number(data.rows), Number(data.seatsPerRow));

    const payload: any = {
      roomName: data.roomName,
      roomType: data.roomType,
      rows: Number(data.rows),
      seatsPerRow: Number(data.seatsPerRow),
      totalSeats: Number(data.totalSeats),
      screenType: data.screenType,
      isActive: data.isActive === "true",
      seatMap: seatMap, // Gửi seatMap lên
    };

    if (isEditMode && roomToEdit) {
      // Khi update cần gửi cả theaterId cũ (để tìm path)
      updateMutation.mutate(
        { theaterId: roomToEdit.theater._id, roomId: roomToEdit._id, data: payload },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createMutation.mutate(
        { theaterId: data.theaterId, data: payload },
        { onSuccess: () => onOpenChange(false) }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Cập Nhật Phòng Chiếu" : "Thêm Phòng Mới"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          
          <div className="space-y-2">
            <Label>Tên Phòng</Label>
            <Input {...register("roomName", { required: true })} placeholder="Phòng 1" />
          </div>

          <div className="space-y-2">
            <Label>Rạp Chiếu</Label>
            <Select 
                onValueChange={(val) => setValue("theaterId", val)} 
                defaultValue={watch("theaterId")}
                disabled={isEditMode} // Thường không cho đổi rạp khi sửa phòng
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn rạp..." />
              </SelectTrigger>
              <SelectContent>
                {theaters.map(t => (
                    <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>Loại Phòng</Label>
                <Select onValueChange={(val) => setValue("roomType", val)} defaultValue={watch("roomType")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2D">2D</SelectItem>
                        <SelectItem value="3D">3D</SelectItem>
                        <SelectItem value="IMAX">IMAX</SelectItem>
                        <SelectItem value="4DX">4DX</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label>Công Nghệ Màn Hình</Label>
                <Select onValueChange={(val) => setValue("screenType", val)} defaultValue={watch("screenType")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="IMAX">IMAX</SelectItem>
                        <SelectItem value="Dolby Atmos">Dolby Atmos</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="space-y-2">
                <Label>Số Hàng</Label>
                <Input type="number" {...register("rows")} />
             </div>
             <div className="space-y-2">
                <Label>Số Cột (Ghế/Hàng)</Label>
                <Input type="number" {...register("seatsPerRow")} />
             </div>
             <div className="space-y-2">
                <Label>Tổng Ghế</Label>
                <Input type="number" {...register("totalSeats")} readOnly className="bg-gray-100" />
             </div>
          </div>

          <div className="space-y-2">
             <Label>Trạng Thái</Label>
             <Select onValueChange={(val) => setValue("isActive", val)} defaultValue={watch("isActive")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="true">Hoạt động</SelectItem>
                    <SelectItem value="false">Bảo trì</SelectItem>
                </SelectContent>
             </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
               {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Lưu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}