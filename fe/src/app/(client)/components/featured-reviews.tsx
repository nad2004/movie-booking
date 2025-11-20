import { Play, Star, ChevronDown, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const featuredComments = [
  {
    id: 1,
    movie: {
      title: 'The Dark Knight',
      image:
        'https://images.unsplash.com/photo-1666698907755-672d406ea71d?auto=format&fit=crop&w=1080&q=80',
      momoScore: 9.2,
      imdbScore: 9.0,
    },
    reviews: [
      {
        id: 1,
        user: {
          name: 'Nguyễn Văn A',
          avatar: 'https://images.unsplash.com/photo-1724435811349-32d27f4d5806?w=100',
          verified: true,
        },
        date: '2 ngày trước',
        comment:
          'Phim hay tuyệt vời! Diễn xuất của Heath Ledger thật đỉnh cao. Cốt truyện chặt chẽ, hình ảnh ấn tượng. Rất đáng xem!',
      },
      {
        id: 2,
        user: {
          name: 'Trần Thị B',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
          verified: true,
        },
        date: '5 ngày trước',
        comment:
          'Một trong những phim siêu anh hùng hay nhất mọi thời đại. Christopher Nolan là thiên tài!',
      },
    ],
  },
  {
    id: 2,
    movie: {
      title: 'Inception',
      image:
        'https://images.unsplash.com/photo-1700174561966-36ed87c7bbeb?auto=format&fit=crop&w=1080&q=80',
      momoScore: 8.9,
      imdbScore: 8.8,
    },
    reviews: [
      {
        id: 3,
        user: {
          name: 'Lê Minh C',
          avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
          verified: true,
        },
        date: '1 tuần trước',
        comment:
          'Cốt truyện phức tạp nhưng rất hấp dẫn. Hiệu ứng hình ảnh tuyệt đẹp. Phim khoa học viễn tưởng đỉnh cao!',
      },
      {
        id: 4,
        user: {
          name: 'Phạm Thu D',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
          verified: true,
        },
        date: '1 tuần trước',
        comment:
          'Xem xong phải suy ngẫm rất nhiều. Nolan không bao giờ làm tôi thất vọng. Masterpiece!',
      },
    ],
  },
  {
    id: 3,
    movie: {
      title: 'Interstellar',
      image:
        'https://images.unsplash.com/photo-1761948245703-cbf27a3e7502?auto=format&fit=crop&w=1080&q=80',
      momoScore: 9.1,
      imdbScore: 8.7,
    },
    reviews: [
      {
        id: 5,
        user: {
          name: 'Hoàng Văn E',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          verified: true,
        },
        date: '3 ngày trước',
        comment:
          'Phim về vũ trụ hay nhất từng xem. Âm nhạc của Hans Zimmer thật tuyệt vời. Cảm động và hùng vĩ!',
      },
      {
        id: 6,
        user: {
          name: 'Đỗ Thị F',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
          verified: true,
        },
        date: '4 ngày trước',
        comment:
          'Kiệt tác của Nolan. Mỗi lần xem lại đều có cảm xúc mới. Rất đáng xem trên màn hình lớn!',
      },
    ],
  },
]

export function FeaturedReviews() {
  return (
    <section className="py-16 bg-bg-secondary text-text-primary">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-center mb-10 font-semibold text-2xl">💬 Bình luận nổi bật</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredComments.map(item => (
            <Card
              key={item.id}
              className="rounded-2xl border border-border bg-surface shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Movie Thumbnail */}
              <div className="relative aspect-[16/9] group">
                <img
                  src={item.movie.image}
                  alt={item.movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>

                {/* Movie Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white font-medium mb-2">{item.movie.title}</h4>
                  <div className="flex gap-2">
                    <Badge className="bg-accent text-white border-0">
                      MoMo {item.movie.momoScore}
                    </Badge>
                    <Badge className="bg-primary text-white border-0">
                      IMDb {item.movie.imdbScore}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="p-5 space-y-4">
                {item.reviews.map(review => (
                  <div key={review.id} className="border-b border-border/60 pb-3 last:border-none">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.user.avatar} />
                        <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="text-sm font-medium truncate">{review.user.name}</h5>
                          {review.user.verified && (
                            <Star className="w-4 h-4 fill-accent text-accent" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="secondary"
                            className="bg-accent/10 text-accent border-0 text-xs"
                          >
                            Đã mua qua MoMo
                          </Badge>
                          <span className="text-xs text-text-secondary">{review.date}</span>
                        </div>
                        <p className="text-sm text-text-secondary line-clamp-2">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  asChild
                  className="text-sm hover:text-[hsl(var(--primary))] transition"
                >
                  <Link href="/reviews" className="flex items-center gap-1">
                    Xem thêm <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Gradient Button */}
        <div className="text-center">
          <Button className="bg-gradient-to-r from-primary to-accent text-white rounded-full px-10 py-5 shadow-md hover:opacity-90">
            <ChevronDown className="w-5 h-5 mr-2" />
            Xem tiếp nhé !
          </Button>
        </div>
      </div>
    </section>
  )
}
