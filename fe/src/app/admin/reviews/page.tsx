'use client'

import { useState } from 'react'
import { useReviews } from '@/lib/api/reviews'
import { useReviewMutations } from './hooks/useReviewMutations'
import { ReviewToolbar } from './components/ReviewToolbar'
import { ReviewTable } from './components/ReviewTable'
import { RejectDialog } from './components/RejectDialog'
import { useDebounce } from '@/hooks/useDebounce'
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
import { GetReviewsParams } from '@/lib/api/reviews'
import { DEFAULT_REVIEWS_LIST } from '@/constants'

export default function ReviewManagementPage() {
  // State
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [params, setParams] = useState<GetReviewsParams>({
    page: 1,
    limit: 9,
    status: undefined,
    rating: undefined,
  })

  // Dialog State
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Fetch Data
  const { data: reviewData = DEFAULT_REVIEWS_LIST, isLoading } = useReviews({
    ...params,
    search: debouncedSearch,
  })
  const { approveMutation, deleteMutation } = useReviewMutations()

  // Handlers
  const handleApprove = (id: string) => {
    approveMutation.mutate(id)
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
        <h1 className="text-gray-900 text-3xl font-bold">Quản Lý Đánh Giá</h1>

        <ReviewToolbar
          params={{ ...params, search }}
          setParams={newParams => {
            setSearch(newParams.search || '')
            setParams(prev => ({ ...prev, ...newParams, search: undefined }))
          }}
        />

        <ReviewTable
          reviews={reviewData.reviews}
          isLoading={isLoading}
          onApprove={handleApprove}
          onRejectClick={setRejectId}
          onDeleteClick={setDeleteId}
        />

        {/* Pagination Controls (Có thể thêm ở đây) */}
      </div>

      {/* Dialogs */}
      <RejectDialog open={!!rejectId} onOpenChange={() => setRejectId(null)} reviewId={rejectId} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-gray-50 text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa đánh giá?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-300! hover:text-gray-800!">Hủy</AlertDialogCancel>
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
