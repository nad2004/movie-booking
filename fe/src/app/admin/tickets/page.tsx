'use client'

import { useState } from 'react'
import { useAdminBookings } from '@/lib/api/booking'
import { useTicketMutations } from './hooks/useTicketMutations'
import { TicketTable } from './components/TicketTable'
import { TicketToolbar } from './components/TicketToolbar'
import { TicketStatusDialog } from './components/TicketStatusDialog'
import { Booking } from '@/types/booking'
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
import { DEFAULT_BOOKING_LIST } from '@/constants'
import { GetAdminBookingsParams } from "@/lib/api/booking";
export default function TicketManagementPage() {
  // State
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [params, setParams] = useState<GetAdminBookingsParams>({
    page: 1,
    limit: 10,
    status: undefined,
    showDate: undefined,
  })

  // Dialog State
  const [editTicket, setEditTicket] = useState<Booking | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // API
  const { data: bookingData = DEFAULT_BOOKING_LIST, isLoading } = useAdminBookings({
    ...params,
    search: debouncedSearch,
  })
  const { deleteMutation } = useTicketMutations()

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) })
    }
  }

  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-gray-900 text-3xl font-bold">Quản Lý Vé</h1>

        <TicketToolbar
          params={{ ...params, search }}
          setParams={newParams => {
            setSearch(newParams.search || '')
            setParams(prev => ({ ...prev, ...newParams, search: undefined }))
          }}
        />

        <TicketTable
          bookings={bookingData?.bookings || []}
          isLoading={isLoading}
          onEditStatus={setEditTicket}
          onDelete={setDeleteId}
        />
      </div>

      <TicketStatusDialog
        open={!!editTicket}
        onOpenChange={() => setEditTicket(null)}
        ticket={editTicket}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa vé?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
