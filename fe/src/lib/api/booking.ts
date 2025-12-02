import { BookingListResponse, BookingStatus, Booking } from "@/types/booking";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { ApiResponse } from "@/types/apiTemplate";
import { CreateBookingRequest, CreateBookingResponse, CreateStaffBookingRequest } from '@/types/booking';
export interface GetBookingParams {
  page?: string;      // movieId
  status?: string;    // theaterId
  
}

export async function getBookings(params: GetBookingParams = {}) {
  try {
    const res = await api.get<BookingListResponse>("/bookings/my-bookings", {
      params, // axios tự build query string
    });

    return res.data.data;

  } catch (error) {
    console.error("Failed to fetch bookings", error);

    return {
      bookings: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 0,
      },
    };
  }
}
export function useBookings(params: GetBookingParams = {}) {
  return useQuery({
    queryKey: ["bookings", params],
    queryFn: () => getBookings(params),
    staleTime: 1000 * 60 * 10, // cache 10 phút
    retry: 2,
  });
}

export interface GetMyBookingParams {
  page?: number;
  limit?: number;
  status?: string; // "Chờ thanh toán" | "Hoàn tất" | ...
}

export async function getMyBookings(params: GetMyBookingParams = {}) {
  try {
    const res = await api.get<BookingListResponse>("/bookings/my-bookings", {
      params, 
    });
    return res.data.data; // Trả về { bookings: [], pagination: {} }
  } catch (error) {
    console.error("Failed to fetch bookings", error);
    // Trả về data rỗng để không crash UI
    return {
      bookings: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
      },
    };
  }
}

// Hook React Query
export function useMyBookings(params: GetMyBookingParams = {}) {
  return useQuery({
    queryKey: ["my-bookings", params], // Key bao gồm params để auto refetch khi filter đổi
    queryFn: () => getMyBookings(params),
    staleTime: 1000 * 60 * 5, // Cache 5 phút
    retry: 1,
  });
}


export const createBookingApi = async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
  const response = await api.post<CreateBookingResponse>('/bookings', data);
  return response.data;
};
export const createStaffBookingApi = async (data: CreateStaffBookingRequest): Promise<CreateBookingResponse> => {
  const response = await api.post<CreateBookingResponse>('/staff/bookings', data);
  return response.data;
};
export interface GetAdminBookingsParams {
  page?: number;
  limit?: number;
  search?: string; // Mã vé, Tên KH
  status?: string; // Trạng thái
  showDate?: string; // Lọc theo ngày chiếu
}

// --- API Functions ---

// 1. Get List (Admin)
export async function getAdminBookings(params: GetAdminBookingsParams = {}) {
  try {
    const res = await api.get<BookingListResponse>("/admin/bookings", { params });
    return res.data.data;
  } catch (error) {
    console.error("Fetch bookings failed", error);
    return { 
        bookings: [], 
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 } 
    };
  }
}

// 2. Update Status (Duyệt/Hủy/Hoàn tất)
export async function updateBookingStatus(id: string, status: BookingStatus) {
  const res = await api.put(`/admin/bookings/${id}/status`, { status });
  return res.data;
}

// 3. Delete Booking (Xóa vé rác/test)
export async function deleteBooking(id: string) {
  const res = await api.delete(`/admin/bookings/${id}`);
  return res.data;
}

// --- Hooks ---

export function useAdminBookings(params: GetAdminBookingsParams) {
  return useQuery({
    queryKey: ["admin-bookings", params],
    queryFn: () => getAdminBookings(params),
    staleTime: 1000 * 60 * 2, // 2 phút
    placeholderData: (previousData) => previousData,
  });
}
export async function getBookingDetail(id: string) {
  try {
    const res = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch booking detail", error);
    return null;
  }
}

export function useBookingDetail(id: string) {
  return useQuery({
    queryKey: ["booking-detail", id],
    queryFn: () => getBookingDetail(id),
    enabled: !!id, // Chỉ gọi khi có ID
  });
}