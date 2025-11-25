import { ReviewListResponse } from '@/types/review';
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

// --- Params ---
export interface GetReviewsParams {
  page?: number;
  limit?: number;
  search?: string; // Tìm theo tên phim hoặc tên user
  rating?: number; // 1-5
  status?: "Chờ duyệt" | "Đã duyệt" | "Bị từ chối";
}

export interface RejectReviewDTO {
  reason: string;
}


// 1. Get List
export async function getReviews(params: GetReviewsParams = {}) {
  try {
    const res = await api.get<ReviewListResponse>("/admin/reviews", { params });
    return res.data.data;
  } catch (error) {
    console.error("Fetch reviews failed", error);
    return { 
        reviews: [], 
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 },
        statistics: { avgRating: 0, totalReviews: 0 }
    };
  }
}

// 2. Approve Review
export async function approveReview(id: string) {
  const res = await api.put(`/admin/reviews/${id}/approve`);
  return res.data;
}

// 3. Reject Review (Có lý do)
export async function rejectReview(id: string, data: RejectReviewDTO) {
  const res = await api.put(`/admin/reviews/${id}/reject`, data);
  return res.data;
}

// 4. Delete Review
export async function deleteReview(id: string) {
  const res = await api.delete(`/admin/reviews/${id}`);
  return res.data;
}

// --- Hooks ---

export function useReviews(params: GetReviewsParams) {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: () => getReviews(params),
    staleTime: 1000 * 60 * 5, // 5 phút
    placeholderData: (previousData) => previousData,
  });
}