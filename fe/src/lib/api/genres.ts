import { Genre, GenreListResponse } from '@/types/genre';
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

// --- 1. DTO Types (Data Transfer Objects) ---
export interface GenreCreateDTO {
  name: string;
  slug?: string; // Có thể auto-generate ở BE
  description?: string;
  icon?: string;
  color?: string;
}

export interface GenreUpdateDTO extends Partial<GenreCreateDTO> {
  isActive?: boolean;
}

export interface GetGenresParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

// --- 2. API Functions ---

export async function getGenres(params: GetGenresParams = {}) {
  try {
    const res = await api.get<GenreListResponse>("/genres", {
        params, 
    });
    return res.data.data;
  } catch (error) {
    console.error("Fetch genres failed", error);
    return [] as Genre[];
  }
}

export async function createGenre(data: GenreCreateDTO) {
  const res = await api.post("/admin/genres", data);
  return res.data;
}

export async function updateGenre(id: string, data: GenreUpdateDTO) {
  const res = await api.put(`/admin/genres/${id}`, data);
  return res.data;
}

export async function deleteGenre(id: string) {
  const res = await api.delete(`/admin/genres/${id}`);
  return res.data;
}

// --- 3. Hooks ---

export function useGenres(params: GetGenresParams) {
  return useQuery({
    queryKey: ["genres", params],
    queryFn: () => getGenres(params),
    staleTime: 1000 * 60 * 5, // 5 phút
    placeholderData: (previousData) => previousData,
  });
}