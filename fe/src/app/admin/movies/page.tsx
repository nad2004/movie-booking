'use client'

import { useRouter, useSearchParams } from "next/navigation"; // [Mới]
import { useState, useEffect } from "react";
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
// [Mới] Import component phân trang
import { CustomPagination, PaginationInfo } from '@/app/components/shared/custom-pagination'

export default function MovieManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // [Mới] Lấy page từ URL
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 10;

  // State quản lý params API
  const [params, setParams] = useState<GetMoviesParams>({
    page: pageFromUrl,
    limit: itemsPerPage,
    sortBy: 'createdAt',
    order: 'desc'
  });

  // State quản lý UI
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // [Mới] Đồng bộ state khi URL thay đổi (VD: User bấm Back browser)
  useEffect(() => {
    setParams(prev => ({ ...prev, page: pageFromUrl }));
  }, [pageFromUrl]);

  // Fetch Data
  const { data: listMovies, isLoading } = useMovies(params);

  // [Mới] Lấy thông tin phân trang từ API response
  const movies = listMovies?.movies || [];
  const totalPages = listMovies?.pagination?.totalPages || 1;
  const totalItems = listMovies?.pagination?.totalItems || 0;

  const { deleteMutation } = useMovieMutations();

  // [Mới] Helper update URL
  const updateUrlParams = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', newPage.toString());
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  // [Mới] Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
    updateUrlParams(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // [Mới] Xử lý logic lọc (Search/Sort) -> Reset về trang 1
  const handleFilterChange = (newParams: Partial<GetMoviesParams>) => {
    // 1. Tính toán điều kiện reset page (nếu search hoặc sort thay đổi)
    const shouldResetPage =
      (newParams.search !== undefined && newParams.search !== params.search) ||
      (newParams.status !== undefined && newParams.status !== params.status) ||
      (newParams.sortBy !== undefined && newParams.sortBy !== params.sortBy) ||
      (newParams.order !== undefined && newParams.order !== params.order);

    // 2. Cập nhật State
    setParams(prev => ({
      ...prev,
      ...newParams,
      page: shouldResetPage ? 1 : prev.page
    }));

    // 3. Update URL (nếu cần reset)
    if (shouldResetPage) {
      updateUrlParams(1);
    }
  };

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

      {/* Truyền handleFilterChange vào setParams của Toolbar để xử lý logic reset page */}
      <MovieToolbar 
        params={params} 
        setParams={handleFilterChange} 
        onOpenAdd={handleAdd} 
      />

      <MovieTable 
        movies={movies} 
        isLoading={isLoading} 
        onEdit={handleEdit} 
        onDelete={(id) => setDeleteId(id)} 
      />

      {/* [Mới] UI Phân trang */}
      <div className="flex flex-col gap-4 mt-4">
        <PaginationInfo
            currentPage={params.page || 1}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
        />

        <CustomPagination
            currentPage={params.page || 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showPageNumbers={5}
        />
      </div>

      {/* Add/Edit Dialog */}
      <MovieFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        movieToEdit={movieToEdit} 
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-gray-50 text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Phim sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-300! hover:text-gray-800!">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}