"use client"
import { Movie, MovieListResponse, MovieDetailResponse, MovieCreateDTO, MovieUpdateDTO} from '@/types/movie'
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

// Cập nhật interface dựa trên hình ảnh Swagger
export interface GetMoviesParams {
  page?: number
  limit?: number
  status?: string         // Trạng thái phim (Movie.status)
  genres?: string         // Danh sách ID thể loại, cách nhau dấu phẩy
  country?: string        // Quốc gia sản xuất
  rating?: string         // Rating
  language?: string       // Ngôn ngữ gốc
  subtitle?: string       // Trạng thái chiếu (showing, coming_soon)    
  year?: number           // Năm phát hành
  minAge?: number         // Giới hạn tuổi tối thiểu
  maxAge?: number         // Giới hạn tuổi tối đa
  minAverageRating?: number // Điểm đánh giá trung bình tối thiểu (0-5)
  maxAverageRating?: number // Điểm đánh giá trung bình tối đa (0-5)
  minViewCount?: number   // Lượt xem tối thiểu
  maxViewCount?: number   // Lượt xem tối đa
  search?: string         // Từ khóa tìm kiếm
  sortBy?: string         // Trường sắp xếp (vd: releaseDate)
  order?: 'asc' | 'desc',  // Thứ tự sắp xếp (tăng dần / giảm dần)
}

export async function getMovies(params: GetMoviesParams = {}) {
  try {
    // Axios sẽ tự động serialize object params thành query string
    // Ví dụ: { page: 1, genres: "abc,xyz" } -> /movies?page=1&genres=abc,xyz
    const res = await api.get<MovieListResponse>("/movies", {
      headers: { "Cache-Control": "no-store" },
      params: params, 
    });
    return res.data.data
  } catch (error) {
    console.error("Failed to fetch movies", error)
    // Trả về cấu trúc mặc định để tránh crash UI
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
    queryKey: ["movies", params], // queryKey sẽ tự động thay đổi khi params thay đổi -> trigger refetch
    queryFn: () => getMovies(params),
    staleTime: 1000 * 60 * 10, // 10 phút
    retry: 2,
    placeholderData: (previousData) => previousData, // Giữ dữ liệu cũ khi đang fetch trang mới (giúp UI không bị nháy)
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

export async function createMovie(data: MovieCreateDTO) {
  // Lưu ý: Endpoint admin thường có prefix /admin hoặc dùng chung /movies nhưng check quyền
  // Dựa vào ảnh Swagger: POST /admin/movies
  const res = await api.post("/admin/movies", data);
  return res.data;
}

export async function updateMovie(id: string, data: MovieUpdateDTO) {
  // Dựa vào ảnh Swagger: PUT /admin/movies/{id}
  const res = await api.put(`/admin/movies/${id}`, data);
  return res.data;
}

export async function deleteMovie(id: string) {
  // Dựa vào ảnh Swagger: DELETE /admin/movies/{id}
  const res = await api.delete(`/admin/movies/${id}`);
  return res.data;
}