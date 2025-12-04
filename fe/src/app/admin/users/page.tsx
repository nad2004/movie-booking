'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useUsers } from '@/lib/api/user'
import { useUserMutations } from './hooks/useUserMutations'
import { UserTable } from './components/UserTable'
import { UserToolbar } from './components/UserToolbar'
import { UserDetailSheet } from './components/UserDetailSheet'
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
import { CustomPagination, PaginationInfo } from '@/app/components/shared/custom-pagination'

export default function UserManagementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Lấy giá trị từ URL params
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10)
  const typeUserFromUrl = searchParams.get('type-user') || 'customer'

  const [currentPage, setCurrentPage] = useState(pageFromUrl)
  const itemsPerPage = 10

  // State
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [typeUser, setTypeUser] = useState(typeUserFromUrl) // 'customer' | 'staff'

  // Dialog State
  const [viewUserId, setViewUserId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(pageFromUrl)
      setTypeUser(typeUserFromUrl)
    }, 0)
    return () => clearTimeout(timer)
  }, [pageFromUrl, typeUserFromUrl])
  // Fetch API
  // API backend của bạn cần hỗ trợ param 'role' để lọc
  const { data: userData, isLoading } = useUsers({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    role: typeUser,
  })
  const users = userData?.users
  const totalPages = userData?.pagination?.totalPages || 1
  const totalBookings = userData?.pagination.totalItems || 0
  const { deleteMutation } = useUserMutations()
  const updateUrlParams = (newPage: number, newTypeUser: string) => {
    const params = new URLSearchParams()
    params.set('page', newPage.toString())
    if (newTypeUser !== 'customer') {
      params.set('type-user', newTypeUser)
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateUrlParams(page, typeUser)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) })
    }
  }
  const handleTypeUserChange = (newTypeUser: string) => {
    console.log(newTypeUser)
    setTypeUser(newTypeUser)
    setCurrentPage(1)
    updateUrlParams(1, newTypeUser)
  }
  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto space-y-6">
        <h1 className="text-gray-900 text-3xl font-bold">Quản Lý Người Dùng</h1>

        <UserToolbar
          search={search}
          onSearchChange={setSearch}
          typeUser={typeUser}
          onTabChange={handleTypeUserChange}
        />
        {isLoading ? (
          <div className="text-center py-10">Đang tải...</div>
        ) : (
          <UserTable
            users={users || []}
            onViewDetail={user => setViewUserId(user._id)}
            onDelete={id => setDeleteId(id)}
          />
        )}
      </div>
      <PaginationInfo
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalBookings}
        itemsPerPage={itemsPerPage}
      />

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        showPageNumbers={5}
      />
      {/* Components Dialog / Sheet */}
      <UserDetailSheet
        open={!!viewUserId}
        onOpenChange={() => setViewUserId(null)}
        userId={viewUserId}
      />


      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-gray-50 text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-300! hover:text-gray-800!">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700!">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
