'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useReviews } from '@/lib/api/reviews'
import { useParams } from 'next/navigation'
import { DEFAULT_REVIEW_LIST } from '@/constants'

export function ReviewSection() {
  const { id } = useParams()
  const movieId = Array.isArray(id) ? id[0] : id

  const { data = DEFAULT_REVIEW_LIST } = useReviews(movieId ?? '')
  const reviews = data.reviews
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
          <div key={r._id} className="border-b border-border pb-3 px-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">{r.customer.fullName}</span>
              <span className="text-xs text-text-secondary">
                {r.createdAt.toLocaleString('vi-VN')}
              </span>
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
