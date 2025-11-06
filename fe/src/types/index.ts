export interface Movie {
  id: string
  title: string
  originalTitle?: string
  poster: string
  backdrop?: string
  rating: number
  duration: number
  genre: string[]
  releaseDate: string
  description: string
  director?: string
  cast?: string[]
  trailer?: string
  language?: string
  ageRating?: string
}

export interface Showtime {
  id: string
  movieId: string
  cinema: string
  cinemaAddress: string
  date: string
  times: string[]
  format: '2D' | '3D' | 'IMAX'
  price: number
}

export interface Seat {
  id: string
  row: string
  number: number
  type: 'standard' | 'vip' | 'couple'
  status: 'available' | 'selected' | 'occupied'
  price: number
}

export interface Combo {
  id: string
  name: string
  description: string
  image: string
  price: number
  items: string[]
}

export interface Ticket {
  id: string
  bookingId: string
  movie: Movie
  showtime: {
    cinema: string
    date: string
    time: string
    format: string
  }
  seats: { row: string; number: number }[]
  combos?: { name: string; quantity: number }[]
  totalPrice: number
  qrCode: string
  status: 'active' | 'used' | 'expired'
  bookedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  membershipLevel?: 'bronze' | 'silver' | 'gold' | 'platinum'
  points?: number
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  movieId: string
  rating: number
  content: string
  createdAt: string
  likes: number
}
