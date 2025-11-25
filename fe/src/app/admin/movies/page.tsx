'use client'

import { useState } from "react";
import { useMovies, GetMoviesParams } from "@/lib/api/movies";
import { MovieTable } from "./components/MovieTable";
import { MovieToolbar } from "./components/MovieToolbar";
import { MovieFormDialog } from "./components/MovieFormDialog";
import { Movie } from "@/types/movie";
import { useMovieMutations } from "./hooks/useMovieMutations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MovieManagementPage() {
  // State quản lý params API
  const [params, setParams] = useState<GetMoviesParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    order: 'desc'
  });

  // State quản lý UI
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch Data
  const { data: listMovies, isLoading } = useMovies(params);
  const { deleteMutation } = useMovieMutations();

  // Handlers
  const handleAdd = () => {
    setMovieToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (movie: Movie) => {
    setMovieToEdit(movie);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null)
      });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Phim</h1>
            <p className="text-gray-500 text-sm mt-1">Danh sách tất cả phim trong hệ thống</p>
        </div>
      </div>

      <MovieToolbar 
        params={params} 
        setParams={setParams} 
        onOpenAdd={handleAdd} 
      />

      <MovieTable 
        movies={listMovies?.movies || []} 
        isLoading={isLoading} 
        onEdit={handleEdit} 
        onDelete={(id) => setDeleteId(id)} 
      />

      {/* Add/Edit Dialog */}
      <MovieFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        movieToEdit={movieToEdit} 
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Phim sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}