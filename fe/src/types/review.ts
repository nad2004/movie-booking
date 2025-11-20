import type { ApiResponse } from './apiTemplate';
import type { Pagination } from './apiTemplate';
import { User } from './user';
export interface Review {
  _id: string;
  customer: User;
  movie: string;
  rating: number;
  comment?: string;
  status: "Chờ duyệt" | "Đã duyệt" | "Bị từ chối";
  likesCount: number;
  dislikesCount: number;
  helpfulScore: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PaginatedReviewResponse {
  reviews: Review[];
  pagination: Pagination;
}

export type ReviewApiResponse = ApiResponse<Review>;
export type PaginatedReviewApiResponse = ApiResponse<PaginatedReviewResponse>;
export type ReviewListResponse = ApiResponse<PaginatedReviewResponse>;
