'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { useProducts, GetProductsParams } from '@/lib/api/products'
import { ProductTable } from './components/ProductTable'
import { ProductToolbar } from './components/ProductToolbar'
import { ProductFormDialog } from './components/ProductFormDialog'
import { Product } from '@/types/product'
import { useProductMutations } from './hooks/useProductMutations'
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
import { LoadingOverlay, TableSkeleton } from '@/app/components/shared/skeleton'
import { CustomPagination, PaginationInfo } from '@/app/components/shared/custom-pagination'

export default function ProductManagementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Lấy page từ URL
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10)
  const itemsPerPage = 10

  // State quản lý params API
  const [params, setParams] = useState<GetProductsParams>({
    page: pageFromUrl,
    limit: itemsPerPage,
    sortBy: 'createdAt',
    order: 'desc',
  })

  // State quản lý UI
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Đồng bộ state khi URL thay đổi
  useEffect(() => {
    setParams(prev => ({ ...prev, page: pageFromUrl }))
  }, [pageFromUrl])

  // Fetch Data
  const { data: listProducts, isLoading, isFetching } = useProducts(params)

  // Lấy thông tin phân trang từ API response
  const products = listProducts ?? []
  const totalPages = listProducts?  Math.ceil(listProducts.length / itemsPerPage) : 1
  const totalItems = listProducts ? listProducts.length : 0

  const { deleteMutation } = useProductMutations()

  // Helper update URL
  const updateUrlParams = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('page', newPage.toString())
    router.push(`?${newSearchParams.toString()}`, { scroll: false })
  }

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }))
    updateUrlParams(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Xử lý logic lọc (Search/Sort) -> Reset về trang 1
  const handleFilterChange = (newParams: Partial<GetProductsParams>) => {
    // Tính toán điều kiện reset page
    const shouldResetPage =
      (newParams.search !== undefined && newParams.search !== params.search) ||
      (newParams.category !== undefined && newParams.category !== params.category) ||
      (newParams.sortBy !== undefined && newParams.sortBy !== params.sortBy) ||
      (newParams.order !== undefined && newParams.order !== params.order)

    // Cập nhật State
    setParams(prev => ({
      ...prev,
      ...newParams,
      page: shouldResetPage ? 1 : prev.page,
    }))

    // Update URL (nếu cần reset)
    if (shouldResetPage) {
      updateUrlParams(1)
    }
  }

  // Handlers
  const handleAdd = () => {
    setProductToEdit(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (product: Product) => {
    setProductToEdit(product)
    setIsDialogOpen(true)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      })
    }
  }

  const isTransitioning = useMemo(() => {
    return !isLoading && isFetching
  }, [isLoading, isFetching])

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
          <p className="text-gray-500 text-sm mt-1">Danh sách tất cả sản phẩm trong hệ thống</p>
        </div>
      </div>

      {/* Toolbar */}
      <ProductToolbar params={params} setParams={handleFilterChange} onOpenAdd={handleAdd} />

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          <ProductTable
            products={products}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={id => setDeleteId(id)}
          />

          {isTransitioning && <LoadingOverlay />}
        </>
      )}

      {/* Pagination UI */}
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
      <ProductFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        productToEdit={productToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-gray-50 text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-300! hover:text-gray-800!">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}