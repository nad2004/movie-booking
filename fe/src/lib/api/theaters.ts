import { TheaterListResponse } from "@/types/theater";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
export interface GetTheatersParams {
  page?: number
  limit?: number
  city?: string
  search?: string
}
export async function getTheaters(params: GetTheatersParams = {}) {
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
export function useTheaters(params: GetTheatersParams) {
  return useQuery({
    queryKey: ["theaters", params],
    queryFn:() => getTheaters(params),
    staleTime: 1000 * 60 * 10, // cache 10 phút
    retry: 2,
  });
}


// --- 1. DTO Types (Request Body) ---
export interface TheaterCreateDTO {
  name: string;
  slug?: string;
  address: string;
  city: string;
  district?: string;
  phoneNumber?: string;
  email?: string;
  openingHours?: string;
  // Location GeoJSON (Dựa theo ảnh Swagger)
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  description?: string;
  isActive?: boolean;
}

export interface TheaterUpdateDTO extends Partial<TheaterCreateDTO>{
  isDeleted?: boolean;
}


// CREATE
export async function createTheater(data: TheaterCreateDTO) {
  const res = await api.post("/admin/theaters", data);
  return res.data;
}

// UPDATE
export async function updateTheater(id: string, data: TheaterUpdateDTO) {
  const res = await api.put(`/admin/theaters/${id}`, data);
  return res.data;
}

// DELETE
export async function deleteTheater(id: string) {
  const res = await api.delete(`/admin/theaters/${id}`);
  return res.data;
}
