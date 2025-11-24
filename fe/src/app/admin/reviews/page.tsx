"use client";
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Calendar } from 'lucide-react';

export default function ReviewManagementPage() {
  const reviews = [
    {
      id: 1,
      user: {
        name: 'Nguyen Van A',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
      },
      movie: 'Avengers: Endgame',
      rating: 5,
      comment: 'Phim rất hay và hấp dẫn! Diễn xuất tuyệt vời, cảnh quay đẹp mắt. Tôi rất thích và sẽ giới thiệu cho bạn bè xem.',
      date: '2024-11-01'
    },
    {
      id: 2,
      user: {
        name: 'Tran Thi B',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka'
      },
      movie: 'Spider-Man: No Way Home',
      rating: 4,
      comment: 'Phim hay nhưng có một số chi tiết chưa hợp lý lắm.',
      date: '2024-11-02'
    },
    {
      id: 3,
      user: {
        name: 'Le Minh C',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver'
      },
      movie: 'The Dark Knight',
      rating: 5,
      comment: 'Kiệt tác điện ảnh! Joker của Heath Ledger quá xuất sắc.',
      date: '2024-11-03'
    },
    {
      id: 4,
      user: {
        name: 'Pham Van D',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max'
      },
      movie: 'Inception',
      rating: 3,
      comment: 'Phim khá hay nhưng hơi khó hiểu ở một số đoạn.',
      date: '2024-11-04'
    },
    {
      id: 5,
      user: {
        name: 'Vo Thi E',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie'
      },
      movie: 'Interstellar',
      rating: 5,
      comment: 'Phim khoa học viễn tưởng tuyệt vời! Cảm động và sâu sắc.',
      date: '2024-11-05'
    },
    {
      id: 6,
      user: {
        name: 'Hoang Thi F',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy'
      },
      movie: 'The Batman',
      rating: 4,
      comment: 'Chất lượng hình ảnh tuyệt vời, âm thanh sống động!',
      date: '2024-11-06'
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-gray-900 text-3xl mb-8">Danh Sách Đánh Giá</h1>

        {/* Filters */}
        <Card className="bg-white border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Movie Filter */}
            <div>
              <Select>
                <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                  <SelectValue placeholder="Filter theo tên phim" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phim</SelectItem>
                  <SelectItem value="avengers">Avengers: Endgame</SelectItem>
                  <SelectItem value="spiderman">Spider-Man: No Way Home</SelectItem>
                  <SelectItem value="batman">The Dark Knight</SelectItem>
                  <SelectItem value="inception">Inception</SelectItem>
                  <SelectItem value="interstellar">Interstellar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div>
              <Select>
                <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                  <SelectValue placeholder="Filter theo mức sao" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả đánh giá</SelectItem>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ (5 sao)</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ (4 sao)</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ (3 sao)</SelectItem>
                  <SelectItem value="2">⭐⭐ (2 sao)</SelectItem>
                  <SelectItem value="1">⭐ (1 sao)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div>
              <Input
                type="date"
                className="bg-gray-50 border-gray-300 text-gray-900"
                placeholder="Filter theo ngày"
              />
            </div>
          </div>
        </Card>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-white border-gray-200 p-6 hover:shadow-lg transition-shadow">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={review.user.avatar} alt={review.user.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">{review.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-gray-900">{review.user.name}</h4>
                  <p className="text-gray-500 text-sm">{review.movie}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-4 line-clamp-3">{review.comment}</p>

              {/* Date */}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{review.date}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
