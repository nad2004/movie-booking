import { api } from "@/lib/api/axios";
import { useQuery } from '@tanstack/react-query';
import type { ReviewListResponse } from '@/types/review';

export async function getReviews(movieId: string) {
  try {
    const res = await api.get<ReviewListResponse>(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
      params: { movieId },
    });
    return res.data.data;
  } catch (err) {
    console.error('Failed to fetch reviews', err);
    return {
      reviews: [],
      pagination: { currentPage: 0, totalPages: 0, totalItems: 0, itemsPerPage: 0 },
    };
  }
}

export default function useReviews(movieId: string) {
  return useQuery({
    queryKey: ['reviews', movieId],
    queryFn: () => getReviews(movieId),
    staleTime: 1000 * 60 * 10, // 10 phút cache
    retry: 2,
  });
}
