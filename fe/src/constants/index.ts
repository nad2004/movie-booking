import { MovieListData, Movie } from '@/types/movie'
import { PaginatedTheaterResponse } from '@/types/theater'
import { Genre } from '@/types/genre'
export const CITIES = [
  { id: 'hanoi', name: 'Hà Nội' },
  { id: 'hochiminh', name: 'Hồ Chí Minh' },
]
export const DEFAULT_MOVIE_LIST: MovieListData = {
  movies: [],
  pagination: { currentPage: 0, totalPages: 0, totalItems: 0, itemsPerPage: 0 },
}
export const DEFAULT_MOVIE_DETAIL: Movie = {
  _id: '',
  title: 'Không có dữ liệu',
  slug: '',
  rating: 'P',
  duration: 0,
  genres: [],
  viewCount: 0,
  averageRating: 0,
  totalReviews: 0,
  totalRevenue: 0,
  status: 'Sắp chiếu',
  releaseDate: '',
}
export const DEFAULT_THEATER_LIST: PaginatedTheaterResponse = {
  theaters: [],
  pagination: { currentPage: 0, totalPages: 0, totalItems: 0, itemsPerPage: 0 },
}
export const DEFAULT_GENRE_LIST: Genre[] = []
export const MAXSTARS = 5;