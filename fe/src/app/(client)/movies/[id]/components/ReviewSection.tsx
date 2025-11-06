'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const reviews = [
  { id: 1, name: 'Nguyễn Văn A', rating: 5, comment: 'Phim hay, đáng xem!', time: '2 ngày trước' },
  {
    id: 2,
    name: 'Trần Thị B',
    rating: 4,
    comment: 'Kịch bản tốt, âm nhạc hay.',
    time: '5 ngày trước',
  },
  { id: 3, name: 'Lê Minh C', rating: 5, comment: 'Tuyệt vời, cảm động!', time: '1 tuần trước' },
]

export function ReviewSection() {
  const [rating, setRating] = useState(0)

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Đánh giá từ người xem</h2>

      {/* Form */}
      <div className="border border-border rounded-lg p-4 mb-6">
        <p className="text-sm text-text-secondary mb-2">Chia sẻ đánh giá của bạn</p>
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              onClick={() => setRating(star)}
              className={`w-5 h-5 cursor-pointer ${
                rating >= star ? 'fill-accent text-accent' : 'text-border'
              }`}
            />
          ))}
        </div>
        <Textarea placeholder="Viết cảm nhận của bạn..." className="mb-3" />
        <Button className="bg-primary text-white rounded-lg">Gửi đánh giá</Button>
      </div>

      {/* Danh sách đánh giá */}
      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="border-b border-border pb-3 px-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">{r.name}</span>
              <span className="text-xs text-text-secondary">{r.time}</span>
            </div>
            <div className="flex gap-1 mt-1">
              {[...Array(r.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-text-secondary mt-1">{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
