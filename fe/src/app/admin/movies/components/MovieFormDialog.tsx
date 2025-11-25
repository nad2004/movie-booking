import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Movie, MovieCreateDTO } from "@/types/movie";
import { useMovieMutations } from "../hooks/useMovieMutations";

interface MovieFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movieToEdit?: Movie | null; // Nếu có movie -> Mode Edit, ngược lại Mode Add
}

export function MovieFormDialog({ open, onOpenChange, movieToEdit }: MovieFormDialogProps) {
  const { createMutation, updateMutation } = useMovieMutations();
  const isEditMode = !!movieToEdit;

  const { register, handleSubmit, reset, setValue, watch } = useForm<MovieCreateDTO>({
    defaultValues: {
      title: "",
      duration: 0,
      status: "Sắp chiếu",
      rating: "P",
      // ... khởi tạo thêm field
    }
  });

  // Reset form khi mở dialog hoặc đổi movieToEdit
  useEffect(() => {
    if (movieToEdit) {
      // Map data từ movieToEdit sang form
      setValue("title", movieToEdit.title);
      setValue("duration", movieToEdit.duration);
      setValue("status", movieToEdit.status);
      setValue("releaseDate", new Date(movieToEdit.releaseDate).toISOString().split('T')[0]); // Format date input
      setValue("description", movieToEdit.description || "");
      setValue("trailerUrl", movieToEdit.trailerUrl || "");
      setValue("posterUrl", movieToEdit.posterUrl || "");
      // ... map tiếp các field khác
    } else {
      reset({
        title: "",
        duration: 0,
        status: "Sắp chiếu",
        rating: "P",
      });
    }
  }, [movieToEdit, open, reset, setValue]);

  const onSubmit = (data: MovieCreateDTO) => {
    if (isEditMode && movieToEdit) {
      updateMutation.mutate({ id: movieToEdit._id, data }, {
        onSuccess: () => onOpenChange(false)
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onOpenChange(false)
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Cập nhật phim" : "Thêm phim mới"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Tên phim</Label>
              <Input {...register("title", { required: true })} placeholder="Nhập tên phim..." />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label>Thời lượng (phút)</Label>
                 <Input type="number" {...register("duration", { valueAsNumber: true })} />
               </div>
               <div>
                 <Label>Ngày phát hành</Label>
                 <Input type="date" {...register("releaseDate")} />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label>Trạng thái</Label>
                 <Select 
                    onValueChange={(val: any) => setValue("status", val)} 
                    defaultValue={movieToEdit?.status || "Sắp chiếu"}
                 >
                   <SelectTrigger>
                     <SelectValue placeholder="Chọn trạng thái" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="Sắp chiếu">Sắp chiếu</SelectItem>
                     <SelectItem value="Đang chiếu">Đang chiếu</SelectItem>
                     <SelectItem value="Ngừng chiếu">Ngừng chiếu</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
                <div>
                 <Label>Rating</Label>
                 <Select 
                    onValueChange={(val: any) => setValue("rating", val)} 
                    defaultValue={movieToEdit?.rating || "P"}
                 >
                   <SelectTrigger>
                     <SelectValue placeholder="Chọn Rating" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="P">P - Mọi lứa tuổi</SelectItem>
                     <SelectItem value="C13">C13 - 13+</SelectItem>
                     <SelectItem value="C16">C16 - 16+</SelectItem>
                     <SelectItem value="C18">C18 - 18+</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
            </div>
            
            <div>
               <Label>Poster URL</Label>
               <Input {...register("posterUrl")} placeholder="Link ảnh poster..." />
            </div>

             <div>
               <Label>Trailer URL</Label>
               <Input {...register("trailerUrl")} placeholder="Link trailer..." />
            </div>

            <div>
               <Label>Mô tả</Label>
               <Textarea {...register("description")} placeholder="Nhập mô tả phim..." className="h-24" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}