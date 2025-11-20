import { BookingListResponse } from "@/types/booking";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

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
