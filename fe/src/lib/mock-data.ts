import type { Movie, Showtime, Combo, Review } from '@/types'

export const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'Spider-Man: No Way Home',
    originalTitle: 'Spider-Man: No Way Home',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&h=750&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop',
    rating: 8.5,
    duration: 148,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    releaseDate: '2021-12-17',
    description:
      'Peter Parker tìm kiếm sự giúp đỡ của Doctor Strange để khôi phục danh tính bí mật của mình, nhưng phép thuật đã gây ra hậu quả nghiêm trọng.',
    director: 'Jon Watts',
    cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch'],
    language: 'Tiếng Anh',
    ageRating: 'T13',
  },
  {
    id: '2',
    title: 'The Batman',
    originalTitle: 'The Batman',
    poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&h=750&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop',
    rating: 8.2,
    duration: 176,
    genre: ['Action', 'Crime', 'Drama'],
    releaseDate: '2022-03-04',
    description:
      'Batman phơi bày tham nhũng ở Gotham City và truy tìm kẻ giết người hàng loạt The Riddler.',
    director: 'Matt Reeves',
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano'],
    language: 'Tiếng Anh',
    ageRating: 'T16',
  },
  {
    id: '3',
    title: 'Avatar: The Way of Water',
    originalTitle: 'Avatar: The Way of Water',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&h=750&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1579566346927-c68383817a25?w=1920&h=1080&fit=crop',
    rating: 7.9,
    duration: 192,
    genre: ['Action', 'Adventure', 'Fantasy'],
    releaseDate: '2022-12-16',
    description: 'Jake Sully và Neytiri đã thành lập gia đình và đang làm mọi thứ để ở bên nhau.',
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
    language: 'Tiếng Anh',
    ageRating: 'T13',
  },
]

export const mockShowtimes: Showtime[] = [
  {
    id: 'st1',
    movieId: '1',
    cinema: 'CGV Vincom Center',
    cinemaAddress: '72 Lê Thánh Tôn, Q.1, TP.HCM',
    date: '2024-01-15',
    times: ['10:00', '13:30', '16:45', '19:00', '21:30'],
    format: '2D',
    price: 85000,
  },
  {
    id: 'st2',
    movieId: '1',
    cinema: 'Galaxy Nguyễn Du',
    cinemaAddress: '116 Nguyễn Du, Q.1, TP.HCM',
    date: '2024-01-15',
    times: ['11:00', '14:00', '17:15', '20:00'],
    format: '3D',
    price: 120000,
  },
]

export const mockCombos: Combo[] = [
  {
    id: 'c1',
    name: 'Combo Solo',
    description: '1 Bắp (60oz) + 1 Nước (32oz)',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&h=300&fit=crop',
    price: 89000,
    items: ['1 Bắp rang bơ lớn', '1 Nước ngọt'],
  },
  {
    id: 'c2',
    name: 'Combo Couple',
    description: '1 Bắp (90oz) + 2 Nước (32oz)',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400&h=300&fit=crop',
    price: 139000,
    items: ['1 Bắp rang bơ siêu lớn', '2 Nước ngọt'],
  },
  {
    id: 'c3',
    name: 'Combo Family',
    description: '2 Bắp (60oz) + 4 Nước (32oz)',
    image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=300&fit=crop',
    price: 249000,
    items: ['2 Bắp rang bơ lớn', '4 Nước ngọt'],
  },
]

export const mockReviews: Review[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: 'Nguyễn Văn A',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    movieId: '1',
    rating: 9,
    content: 'Phim hay tuyệt vời! Hiệu ứng đặc biệt xuất sắc và cốt truyện hấp dẫn.',
    createdAt: '2024-01-10',
    likes: 24,
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: 'Trần Thị B',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    movieId: '1',
    rating: 8,
    content: 'Rất đáng xem, đặc biệt là những ai yêu thích thể loại siêu anh hùng.',
    createdAt: '2024-01-12',
    likes: 18,
  },
]
