import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Movie, MovieCreateDTO } from "@/types/movie";
import { useMovieMutations } from "../hooks/useMovieMutations";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

interface MovieFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movieToEdit?: Movie | null;
}

export function MovieFormDialog({ open, onOpenChange, movieToEdit }: MovieFormDialogProps) {
  const { createMutation, updateMutation, uploadPosterMutation } = useMovieMutations();
  const isEditMode = !!movieToEdit;

  const { register, handleSubmit, reset, setValue, watch } = useForm<MovieCreateDTO>({
    defaultValues: {
      title: "",
      duration: 0,
      status: "Sắp chiếu",
      rating: "P",
    }
  });

  // State cho upload ảnh
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const posterUrl = watch("posterUrl");

  // Reset form khi mở dialog hoặc đổi movieToEdit
  useEffect(() => {
    if (movieToEdit) {
      setValue("title", movieToEdit.title);
      setValue("duration", movieToEdit.duration);
      setValue("status", movieToEdit.status);
      setValue("releaseDate", new Date(movieToEdit.releaseDate).toISOString().split('T')[0]);
      setValue("description", movieToEdit.description || "");
      setValue("trailerUrl", movieToEdit.trailerUrl || "");
      setValue("posterUrl", movieToEdit.posterUrl || "");
      setPreviewUrl(movieToEdit.posterUrl || "");
      setSelectedFile(null);
    } else {
      reset({
        title: "",
        duration: 0,
        status: "Sắp chiếu",
        rating: "P",
      });
      setPreviewUrl("");
      setSelectedFile(null);
    }
  }, [movieToEdit, open, reset, setValue]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB!');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear selected file
  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(posterUrl || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload poster after creating/updating movie
  const uploadPosterIfNeeded = async (movieId: string) => {
    if (selectedFile) {
      try {
        const result = await uploadPosterMutation.mutateAsync({ 
          movieId, 
          file: selectedFile 
        });
        // Update posterUrl with the uploaded URL
        if (result?.data?.url) {
          setValue("posterUrl", result.data.url);
        }
      } catch (error) {
        console.error("Upload poster error:", error);
      }
    }
  };

  const onSubmit = async (data: MovieCreateDTO) => {
    try {
      if (isEditMode && movieToEdit) {
        // Update movie first
        await updateMutation.mutateAsync({ id: movieToEdit._id, data });
        // Then upload poster if file is selected
        await uploadPosterIfNeeded(movieToEdit._id);
        onOpenChange(false);
      } else {
        // Create movie first
        const result = await createMutation.mutateAsync(data);
        // Then upload poster if file is selected
        if (result?.data?._id) {
          await uploadPosterIfNeeded(result.data._id);
        }
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || uploadPosterMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-50 text-gray-900">
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

            {/* ✨ NEW: Upload Poster Section */}
            <div className="space-y-2">
              <Label>Poster phim</Label>
              
              {/* Preview */}
              {previewUrl && (
                <div className="relative w-40 h-56 rounded-lg overflow-hidden border-2 border-gray-300">
                  <ImageWithFallback 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={clearFile}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}

              {/* Upload Button */}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload size={16} />
                  {selectedFile ? "Chọn ảnh khác" : "Chọn ảnh từ máy"}
                </Button>
                {selectedFile && (
                  <span className="text-sm text-gray-600 self-center">
                    {selectedFile.name}
                  </span>
                )}
              </div>

              {/* Manual URL Input (fallback) */}
              <div className="pt-2">
                <Label className="text-sm text-gray-500">Hoặc nhập URL poster</Label>
                <Input 
                  {...register("posterUrl")} 
                  placeholder="https://example.com/poster.jpg" 
                  onChange={(e) => {
                    setValue("posterUrl", e.target.value);
                    if (e.target.value && !selectedFile) {
                      setPreviewUrl(e.target.value);
                    }
                  }}
                />
              </div>
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
            <Button type="button" variant="default" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading} variant='default'>
              {isLoading ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}