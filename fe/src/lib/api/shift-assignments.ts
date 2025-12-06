// lib/api/shift-assignments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/axios'
import {
  DailyRosterResponse,
  GetDailyRosterParams,
  CreateAssignmentDTO,
  UpdateAssignmentDTO,
  BulkAssignmentDTO,
  AssignedEmployee,
} from '@/types/shift'
import { useNotification } from '@/providers/NotificationProvider'

// ========================================
// 1. RAW API FUNCTIONS
// ========================================

/**
 * GET /work-schedules/daily-roster
 * Lấy danh sách phân công nhân sự theo ngày
 */
export async function getDailyRoster(params: GetDailyRosterParams) {
  try {
    const res = await api.get<DailyRosterResponse>('/work-schedules/daily-roster', {
      params: {
        theaterId: params.theaterId,
        date: params.date,
        shiftCode: params.shiftCode,
      },
    })
    return res.data.data
  } catch (error) {
    console.error('Failed to fetch daily roster', error)
    return null
  }
}

/**
 * POST /assignments/bulk
 * Phân công nhân sự hàng loạt
 */
export async function bulkAssignStaff(data: BulkAssignmentDTO) {
  const res = await api.post('/assignments/bulk', data)
  return res.data
}

/**
 * POST /assignments (Single assignment)
 * Phân công 1 nhân viên vào 1 ca
 */
export async function createAssignment(data: CreateAssignmentDTO) {
  const res = await api.post('/assignments', data)
  return res.data
}

/**
 * PUT /assignments/:id
 * Cập nhật thông tin phân công
 */
export async function updateAssignment(id: string, data: UpdateAssignmentDTO) {
  const res = await api.put(`/assignments/${id}`, data)
  return res.data
}

/**
 * DELETE /assignments/:id
 * Xóa phân công
 */
export async function deleteAssignment(id: string) {
  const res = await api.delete(`/assignments/${id}`)
  return res.data
}

/**
 * POST /assignments/check-in
 * Nhân viên check-in vào ca
 * Body: { workScheduleId: string }
 */
export async function checkInAssignment(workScheduleId: string) {
  const res = await api.post('/assignments/check-in', { workScheduleId })
  return res.data
}

/**
 * POST /assignments/check-out
 * Nhân viên check-out khỏi ca
 * Body: { workScheduleId: string }
 */
export async function checkOutAssignment(workScheduleId: string) {
  const res = await api.post('/assignments/check-out', { workScheduleId })
  return res.data
}

/**
 * GET /assignments/of-user/{userId}
 * Lấy danh sách ca làm của một nhân viên
 * Hỗ trợ lọc theo ngày hoặc khoảng thời gian
 */
export async function getUserAssignments(userId: string, params?: { 
  from?: string
  to?: string
  date?: string
  page?: number
  limit?: number
}) {
  try {
    const res = await api.get(`/assignments/of-user/${userId}`, { params })
    return res.data.data
  } catch (error) {
    console.error('Failed to fetch user assignments', error)
    return { assignments: [], pagination: null }
  }
}

// ========================================
// 2. REACT QUERY HOOKS
// ========================================

/**
 * Hook lấy daily roster (GET)
 */
export function useDailyRoster(params: GetDailyRosterParams) {
  return useQuery({
    queryKey: ['daily-roster', params],
    queryFn: () => getDailyRoster(params),
    staleTime: 1000 * 60 * 2,
    retry: 2,
    enabled: !!params.theaterId && !!params.date,
  })
}

export function useAssignmentMutations() {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useNotification()

  // Single Create
  const createMutation = useMutation({
    mutationFn: (data: CreateAssignmentDTO) => createAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-roster'] })
      queryClient.invalidateQueries({ queryKey: ['user-assignments'] })
      showSuccess('Phân công thành công')
    },
    onError: (error: any) => {
      showError('Lỗi phân công!', error.response?.data?.message || 'Vui lòng thử lại')
    },
  })

  // Bulk Create
  const bulkCreateMutation = useMutation({
    mutationFn: (data: BulkAssignmentDTO) => bulkAssignStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-roster'] })
      queryClient.invalidateQueries({ queryKey: ['user-assignments'] })
      showSuccess('Phân công thành công')
    },
    onError: (error: any) => {
      showError('Lỗi phân công!', error.response?.data?.message || 'Vui lòng thử lại')
    },
  })

  // Update
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssignmentDTO }) =>
      updateAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-roster'] })
      queryClient.invalidateQueries({ queryKey: ['user-assignments'] })
      showSuccess('Cập nhật thành công')
    },
    onError: (error: any) => {
      showError('Lỗi cập nhật!', error.response?.data?.message || 'Vui lòng thử lại')
    },
  })

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-roster'] })
      queryClient.invalidateQueries({ queryKey: ['user-assignments'] })
      showSuccess('Xóa phân công thành công')
    },
    onError: (error: any) => {
      showError('Lỗi xóa!', error.response?.data?.message || 'Vui lòng thử lại')
    },
  })

  // Check-in - now requires workScheduleId
  const checkInMutation = useMutation({
    mutationFn: (workScheduleId: string) => checkInAssignment(workScheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-roster'] })
      queryClient.invalidateQueries({ queryKey: ['user-assignments'] })
      showSuccess('Check-in thành công')
    },
    onError: (error: any) => {
      showError('Lỗi check-in!', error.response?.data?.message || 'Vui lòng thử lại')
    },
  })

  // Check-out - now requires workScheduleId
  const checkOutMutation = useMutation({
    mutationFn: (workScheduleId: string) => checkOutAssignment(workScheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-roster'] })
      queryClient.invalidateQueries({ queryKey: ['user-assignments'] })
      showSuccess('Check-out thành công')
    },
    onError: (error: any) => {
      showError('Lỗi check-out!', error.response?.data?.message || 'Vui lòng thử lại')
    },
  })

  return {
    create: createMutation,
    bulkCreate: bulkCreateMutation,
    update: updateMutation,
    remove: deleteMutation,
    checkIn: checkInMutation,
    checkOut: checkOutMutation,
  }
}

// ========================================
// 3. HOOKS FOR SPECIFIC USE CASES
// ========================================

/**
 * Hook lấy assignments của 1 user cụ thể
 * GET /assignments/of-user/{userId}
 */
export function useUserAssignments(
  userId: string, 
  params?: { 
    from?: string
    to?: string
    date?: string
    page?: number
    limit?: number
  }
) {
  return useQuery({
    queryKey: ['user-assignments', userId, params],
    queryFn: () => getUserAssignments(userId, params),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  })
}

/**
 * Hook lấy assignments của 1 schedule cụ thể
 * GET /assignments?workScheduleId=xxx
 */
export function useScheduleAssignments(scheduleId: string) {
  return useQuery({
    queryKey: ['schedule-assignments', scheduleId],
    queryFn: async () => {
      try {
        const res = await api.get('/assignments', {
          params: {
            workScheduleId: scheduleId,
          },
        })
        return res.data.data
      } catch (error) {
        console.error('Failed to fetch schedule assignments', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 3,
    enabled: !!scheduleId,
  })
}