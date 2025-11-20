import { GenreListResponse } from "@/types/genre";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export async function getGenres() {
  try {
    const res = await api.get<GenreListResponse>("/genres", {
    });
    return res.data.data;

  } catch (error) {
    console.error("Failed to fetch genres", error);
    return [];
  }
}
export  function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenres(),
    staleTime: 1000 * 60 * 10, // 10 phút
    retry: 2,
  });
}
