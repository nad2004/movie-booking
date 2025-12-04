// app/(admin)/shift-manager/components/shift-assignments-tab.tsx
'use client'

import { useState, useMemo, useCallback } from 'react'
import { format } from 'date-fns'

// Components
import AssignmentFilters from './assignment-filters'
import AssignmentStats from './assignment-stats'
import ShiftsList from './shifts-list'
import AssignStaffModal from '../components/modals/assign-staff-modal'
import UpdateAssignmentModal from '../components/modals/update-assignment-modal'
import ConfirmDeleteAlert from '../components/modals/confirm-delete-alert'

// API & Types
import { useDailyRoster, useAssignmentMutations } from '@/lib/api/shift-assignments'
import { AssignedEmployee, ShiftWithEmployees } from '@/types/shift'
import { useTheaters } from '@/lib/api/theaters'

import { useShiftTemplates } from '@/lib/api/shift-templates'

export default function ShiftAssignmentsTab() {
  // --- States ---
  const [selectedTheaterId, setSelectedTheaterId] = useState<string>('69198f14b80a32bf8ea5d91c')
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [selectedShiftCode, setSelectedShiftCode] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Modal States
  const [isAssignOpen, setAssignOpen] = useState(false)
  const [isUpdateOpen, setUpdateOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)

  const [selectedSchedule, setSelectedSchedule] = useState<ShiftWithEmployees | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<AssignedEmployee | null>(null)

  // --- API Hooks ---
  const { data: rostersData, isLoading } = useDailyRoster({
    theaterId: selectedTheaterId,
    date: selectedDate,
    shiftCode: selectedShiftCode === 'all' ? undefined : selectedShiftCode,
  })

  const { data: theatersData } = useTheaters({})
  const { remove } = useAssignmentMutations()

  const theaters = useMemo(() => theatersData?.theaters || [], [theatersData])
  const { data: template } = useShiftTemplates()
  // --- Computed Data ---
  const { summary, shifts } = useMemo(() => {
    if (!rostersData) {
      return { summary: null, shifts: [] }
    }
    const summary = rostersData.summary
    const shifts = rostersData.shifts
    return { summary, shifts }
  }, [rostersData])
  const { availableShiftCodes } = useMemo(() => {
    if (!template) {
      return { availableShiftCodes: undefined }
    }
    const codes = new Set(template.map(s => s.code))
    const availableShiftCodes = Array.from(codes)
    return { availableShiftCodes }
  }, [template])
  // --- Handlers ---
  const handleTheaterChange = useCallback((value: string) => {
    setSelectedTheaterId(value)
  }, [])

  const handleDateChange = useCallback((value: string) => {
    setSelectedDate(value)
  }, [])

  const handleShiftCodeChange = useCallback((value: string) => {
    setSelectedShiftCode(value)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
  }, [])

  const handleAssignNew = useCallback((shift: ShiftWithEmployees) => {
    setSelectedSchedule(shift)
    setAssignOpen(true)
  }, [])

  const handleEdit = useCallback((employee: AssignedEmployee) => {
    setSelectedEmployee(employee)
    setUpdateOpen(true)
  }, [])

  const handleDelete = useCallback((employee: AssignedEmployee) => {
    setSelectedEmployee(employee)
    setDeleteOpen(true)
  }, [])

  const handleConfirmRemove = useCallback(async () => {
    if (selectedEmployee?.assignmentId) {
      await remove.mutateAsync(selectedEmployee.assignmentId)
      setDeleteOpen(false)
      setSelectedEmployee(null)
    }
  }, [selectedEmployee, remove])

  // --- Render ---
  return (
    <div className="space-y-6">
      {/* Filters */}
      <AssignmentFilters
        theaters={theaters}
        selectedTheaterId={selectedTheaterId}
        selectedDate={selectedDate}
        selectedShiftCode={selectedShiftCode}
        searchQuery={searchQuery}
        availableShiftCodes={availableShiftCodes}
        onTheaterChange={handleTheaterChange}
        onDateChange={handleDateChange}
        onShiftCodeChange={handleShiftCodeChange}
        onSearchChange={handleSearchChange}
      />

      {/* Stats Cards */}
      {summary && <AssignmentStats summary={summary} />}

      {/* Shifts List */}
      <ShiftsList
        shifts={shifts}
        isLoading={isLoading}
        onAssignNew={handleAssignNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modals */}
      <AssignStaffModal
        open={isAssignOpen}
        onOpenChange={setAssignOpen}
        selectedSchedule={selectedSchedule}
      />

      <UpdateAssignmentModal
        open={isUpdateOpen}
        onOpenChange={setUpdateOpen}
        employee={selectedEmployee}
      />

      <ConfirmDeleteAlert
        open={isDeleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmRemove}
        title="Hủy Phân Công?"
        description={`Bạn muốn xóa ${selectedEmployee?.fullName} khỏi ca làm việc này?`}
      />
    </div>
  )
}
