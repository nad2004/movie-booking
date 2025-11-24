import { ScheduleListResponse } from "@/types/schedule";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export interface GetScheduleParams {
  movieId?: string;      // movieId
  theaterId?: string;    // theaterId
  date?: string;         // Lọc theo ngày (YYYY-MM-DD)
}

export async function getSchedules(params: GetScheduleParams = {}) {
  try {
    const res = await api.get<ScheduleListResponse>("/schedules", {
      params, // axios tự build query string
    });

    return res.data.data;

  } catch (error) {
    console.error("Failed to fetch schedules", error);

    return {
      schedules: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 0,
      },
    };
  }
}
export function useSchedules(params: GetScheduleParams = {}) {
  return useQuery({
    queryKey: ["schedules", params],
    queryFn: () => getSchedules(params),
    staleTime: 1000 * 60 * 10, // cache 10 phút
    retry: 2,
  });
}
