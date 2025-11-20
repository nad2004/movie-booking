import { TheaterListResponse } from "@/types/theater";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export async function getTheaters() {
  try {
    const res = await api.get<TheaterListResponse>("/theaters");

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
export function useTheaters() {
  return useQuery({
    queryKey: ["theaters"],
    queryFn: getTheaters,
    staleTime: 1000 * 60 * 10, // cache 10 phút
    retry: 2,
  });
}