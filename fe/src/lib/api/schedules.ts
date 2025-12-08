import { ScheduleListResponse } from "@/types/schedule";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export interface GetScheduleParams {
  movieId?: string;      // movieId
  theaterId?: string;    // theaterId
  showDate?: string;         // Lọc theo ngày (YYYY-MM-DD)
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


// --- DTO Types (Theo ảnh Swagger) ---
export interface TicketPriceDTO {
  standard: number;
  vip: number;
  couple: number;
}

export interface ScheduleCreateDTO {
  movieId: string;
  theaterId: string;
  roomId: string;
  roomName: string; // Backend yêu cầu gửi cả tên
  roomType: "2D" | "3D" | "IMAX";
  showDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  ticketPrices: TicketPriceDTO;
  language: string;
  subtitles: string[];
  status?: string;
}

export interface ScheduleUpdateDTO extends Partial<ScheduleCreateDTO> {
  isActive?: boolean;
}

export interface GetScheduleParams {
  movieId?: string;
  theaterId?: string;
  date?: string; // YYYY-MM-DD
  page?: number;
  limit?: number;
}


export async function createSchedule(data: ScheduleCreateDTO) {
  const res = await api.post("/admin/schedules", data);
  return res.data;
}

export async function updateSchedule(id: string, data: ScheduleUpdateDTO) {
  const res = await api.put(`/admin/schedules/${id}`, data);
  return res.data;
}

export async function deleteSchedule(id: string) {
  const res = await api.delete(`/admin/schedules/${id}`);
  return res.data;
}
