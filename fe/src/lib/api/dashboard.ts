import { api } from '@/lib/api/axios'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios' // Import axios để check isCancel

// --- 1. Types ---
export interface DashboardCard {
  title: string
  value: number
  subLabel: string
  description: string
  icon?: string
}

export interface DashboardSummary {
  cards: DashboardCard[]
}

export interface DashboardSummaryResponse {
  success: boolean
  data: DashboardSummary
  message?: string
}

// Top Movies Response
export interface TopMovieItem {
  name: string
  value: number
}

export interface TopMoviesData {
  title: string
  subtitle: string
  year: number
  items: TopMovieItem[]
}

export interface TopMoviesResponse {
  success: boolean
  message: string
  data: TopMoviesData
}

// Top Cinemas Response
export interface TopCinemaItem {
  name: string
  value: number
}

export interface TopCinemasData {
  title: string
  subtitle: string
  year: number
  items: TopCinemaItem[]
}

export interface TopCinemasResponse {
  success: boolean
  message: string
  data: TopCinemasData
}

// Chart data type for component
export interface ChartDataItem {
  name: string
  value: number
  color: string
  unit?: string
}

// --- 2. API Functions ---

// Thêm tham số signal
export async function getDashboardSummary(signal?: AbortSignal) {
  try {
    const res = await api.get<DashboardSummaryResponse>('/admin/dashboard/sumary-overview', {
      signal, // 🟢 Truyền signal vào axios config
    })
    return res.data.data
  } catch (error) {
    // 🟢 Check cancel
    if (axios.isCancel(error)) {
      throw error
    }
    console.error('Fetch dashboard summary failed', error)
    return null
  }
}

export async function getTopMovies(year?: number, signal?: AbortSignal) {
  try {
    const res = await api.get<TopMoviesResponse>('/admin/dashboard/top-movies', {
      params: year ? { year } : undefined,
      signal, // 🟢 Truyền signal
    })
    return res.data.data
  } catch (error) {
    // 🟢 Check cancel
    if (axios.isCancel(error)) {
      throw error
    }
    console.error('Fetch top movies failed', error)
    return null
  }
}

export async function getTopCinemas(year?: number, signal?: AbortSignal) {
  try {
    const res = await api.get<TopCinemasResponse>('/admin/dashboard/top-cinemas', {
      params: year ? { year } : undefined,
      signal, // 🟢 Truyền signal
    })
    return res.data.data
  } catch (error) {
    // 🟢 Check cancel
    if (axios.isCancel(error)) {
      throw error
    }
    console.error('Fetch top cinemas failed', error)
    return null
  }
}

// --- 3. TanStack Query Hooks ---

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard-summary'],
    // 🟢 Lấy signal từ context
    queryFn: ({ signal }) => getDashboardSummary(signal),
    staleTime: 1000 * 60 * 2, // 2 phút
    refetchInterval: 1000 * 60 * 5, // Tự động refetch mỗi 5 phút
  })
}

export function useTopMovies(year?: number) {
  return useQuery({
    queryKey: ['top-movies', year],
    // 🟢 Lấy signal từ context
    queryFn: ({ signal }) => getTopMovies(year, signal),
    staleTime: 1000 * 60 * 5, // 5 phút
    enabled: !!year, // Chỉ fetch khi có year
  })
}

export function useTopCinemas(year?: number) {
  return useQuery({
    queryKey: ['top-cinemas', year],
    // 🟢 Lấy signal từ context
    queryFn: ({ signal }) => getTopCinemas(year, signal),
    staleTime: 1000 * 60 * 5, // 5 phút
    enabled: !!year, // Chỉ fetch khi có year
  })
}

// --- 4. Helper function to transform API data to chart format ---

const COLORS = [
  'bg-blue-500',
  'bg-green-500', 
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500'
]

export function transformToChartData(
  items: TopMovieItem[] | TopCinemaItem[], 
  unit?: string
): ChartDataItem[] {
  return items.map((item, index) => ({
    name: item.name,
    value: item.value,
    color: COLORS[index % COLORS.length],
    unit
  }))
}