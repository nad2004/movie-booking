import { TheaterListResponse } from "@/types/theater";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
export interface GetMoviesParams {
  page?: number
  limit?: number
  city?: string
}
export async function getTheaters(params: GetMoviesParams = {}) {
  try {
    const res = await api.get<TheaterListResponse>("/theaters?", {
      params: { ...params },
    });

    return res.data.data;

  } catch (error) {
    console.error("Failed to fetch theaters", error);

    return {
      theaters: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 0,
      },
    };
  }
}
export function useTheaters(params: GetMoviesParams) {
  return useQuery({
    queryKey: ["theaters", params],
    queryFn:() => getTheaters(params),
    staleTime: 1000 * 60 * 10, // cache 10 phút
    retry: 2,
  });
}