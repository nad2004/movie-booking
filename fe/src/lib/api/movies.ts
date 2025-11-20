"use client"
import { Movie, MovieListResponse, MovieDetailResponse } from '@/types/movie'
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export interface GetMoviesParams {
  page?: number
  limit?: number
  status?: string
  search?: string
}

export async function getMovies(params: GetMoviesParams = {}) {


  try {
    const res = await api.get<MovieListResponse>(`/movies?`, {
      headers: { "Cache-Control": "no-store" },
      params: { ...params },
    });
    return res.data.data
  } catch (error) {
    console.error("Failed to fetch movies", error)
    return {
      movies: [],
      pagination: { currentPage: 0, totalPages: 0, totalItems: 0, itemsPerPage: 0 },
    }
  }
}

export async function getMovieDetail(id: string): Promise<Movie> {
  if (!id) throw new Error("Movie ID is required");

  try {
    const res = await api.get<MovieDetailResponse>(`/movies/${id}`, {
      headers: { "Cache-Control": "no-store" }
    });

    return res.data.data

  } catch (error) {
    console.error("Failed to fetch movie detail", error);
    throw new Error("Failed to fetch movie detail");
  }
}

export function useMovies(params: GetMoviesParams) {
  return useQuery({
    queryKey: ["movies", params],
    queryFn: () => getMovies(params),
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
}

export function useMovieDetail(id: string) {
  return useQuery({
    queryKey: ["movieDetail", id],
    queryFn: () => getMovieDetail(id),
    staleTime: 1000 * 60 * 10,
    retry: 2,
    enabled: !!id,
  });
}
