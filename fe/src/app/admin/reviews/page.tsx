'use client'

import { useRouter, useSearchParams } from 'next/navigation' // [Import mới]
import { useState, useEffect, useMemo } from 'react'
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
// [Import mới] Component phân trang
import { CustomPagination, PaginationInfo } from '@/app/components/shared/custom-pagination'
import { LoadingOverlay, TableSkeleton } from '@/app/components/shared/skeleton'

export default function ReviewManagementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // [Logic mới] Lấy page từ URL
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10)
  const itemsPerPage = 9 // Giữ nguyên limit 9 như code cũ của bạn

  // State
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  
  const [params, setParams] = useState<GetReviewsParams>({
    page: pageFromUrl,
    limit: itemsPerPage,
    status: undefined,
    rating: undefined,
  })

  // Dialog State
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // [Logic mới] Đồng bộ State khi URL thay đổi (VD: User bấm Back/Forward browser)
  useEffect(() => {
    setParams(prev => ({ ...prev, page: pageFromUrl }))
  }, [pageFromUrl])

  // Fetch Data
  const { data: reviewData = DEFAULT_REVIEWS_LIST, isLoading, isFetching } = useReviews({
    ...params,
    search: debouncedSearch,
  })

  // Lấy thông tin phân trang từ API response
  const totalPages = reviewData?.pagination?.totalPages || 1
  const totalReviews = reviewData?.pagination?.totalItems || 0

  const { approveMutation, deleteMutation } = useReviewMutations()

  // [Logic mới] Hàm cập nhật URL
  const updateUrlParams = (newPage: number, otherParams?: Partial<GetReviewsParams>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    
    // Set page
    newSearchParams.set('page', newPage.toString())
    
    // Nếu có thay đổi params khác (status, rating...) thì update vào URL nếu cần thiết
    // (Ở đây mình tập trung vào page, các filter khác nếu muốn lưu lên URL thì handle thêm)
    
    router.push(`?${newSearchParams.toString()}`, { scroll: false })
  }

  // [Logic mới] Xử lý khi chuyển trang
  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }))
    updateUrlParams(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // [Logic mới] Xử lý khi thay đổi filter (Reset về trang 1)
  const handleFilterChange = (newParams: Partial<GetReviewsParams>) => {
    if (newParams.search !== undefined) {
      setSearch(newParams.search)
    }
    
    setParams(prev => {
      const updated = { ...prev, ...newParams, search: undefined }
      // Nếu thay đổi filter (status, rating), reset về page 1
      if (newParams.status !== prev.status || newParams.rating !== prev.rating) {
        updated.page = 1
        updateUrlParams(1)
      }
      return updated
    })
  }

  // Handlers actions
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
    const isTransitioning = useMemo(()=> {return !isLoading && isFetching}, [isLoading, isFetching])
  
  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-gray-900 text-3xl font-bold">Quản Lý Đánh Giá</h1>

        <ReviewToolbar
          params={{ ...params, search }}
          setParams={handleFilterChange}
        />
        {isLoading ? (
                    // Initial loading - show full skeleton
                    <TableSkeleton />
                  ) : (
                    <>
                      {/* Show content */}
                      <ReviewTable
          reviews={reviewData.reviews}
          isLoading={isLoading}
          onApprove={handleApprove}
          onRejectClick={setRejectId}
          onDeleteClick={setDeleteId}
        />
                      
                      {/* Show overlay during transitions (page change, tab change) */}
                      {isTransitioning && <LoadingOverlay />}
                    </>
                  )}
        

        {/* [UI Mới] Phần phân trang */}
        <PaginationInfo
            currentPage={params.page || 1}
            totalPages={totalPages}
            totalItems={totalReviews}
            itemsPerPage={itemsPerPage}
        />

        <CustomPagination
            currentPage={params.page || 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showPageNumbers={5}
        />
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