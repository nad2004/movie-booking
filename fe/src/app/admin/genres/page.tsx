'use client'

import { useState } from 'react'
import { useGenres } from '@/lib/api/genres'
import { useGenreMutations } from './hooks/useGenreMutations'
import { GenreTable } from './components/GenreTable'
import { GenreFormDialog } from './components/GenreFormDialog'
import { Genre } from '@/types/genre'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, Plus } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDebounce } from '@/hooks/useDebounce' // Giả sử bạn đã có hook này

export default function GenreManagementPage() {
  // --- State ---
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500) // Tối ưu search

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [genreToEdit, setGenreToEdit] = useState<Genre | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // --- Data Fetching ---
  const { data: genreData, isLoading } = useGenres({
    page: 1,
    limit: 100, // Lấy nhiều hoặc làm pagination sau
    search: debouncedSearch,
  })

  const { deleteMutation } = useGenreMutations()

  // --- Handlers ---
  const handleAdd = () => {
    setGenreToEdit(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (genre: Genre) => {
    setGenreToEdit(genre)
    setIsDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      })
    }
  }

  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-gray-900 text-3xl font-bold">Quản Lý Thể Loại</h1>
        </div>

        {/* Toolbar */}
        <Card className="bg-white border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên thể loại..."
                className="pl-9 bg-gray-50 border-gray-200"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="w-4 h-4" /> Thêm Mới
            </Button>
          </div>
        </Card>

        {/* Table */}
        <GenreTable
          genres={Array.isArray(genreData) ? genreData : (genreData?.genres ?? [])}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={id => setDeleteId(id)}
        />
      </div>

      {/* Dialogs */}
      <GenreFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        genreToEdit={genreToEdit}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-gray-50 text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa thể loại vĩnh viễn. Các phim thuộc thể loại này có thể bị ảnh
              hưởng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-300! hover:text-gray-800!">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
