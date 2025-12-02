'use client'
import { useState } from 'react'
import { Star, Loader2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useMovieReviews } from '@/lib/api/reviews'
import { useParams } from 'next/navigation'
import { DEFAULT_REVIEW_LIST } from '@/constants'
import { useCreateReview } from '@/lib/api/reviews'
import { useUserStore } from '@/store/userStore'
import type { Review } from '@/types/review'
export function ReviewSection() {
  const { id } = useParams()
  const movieId = Array.isArray(id) ? id[0] : id

  const { data = DEFAULT_REVIEW_LIST } = useMovieReviews(movieId ?? '')
  const reviews = data.reviews
  
  // Lấy thông tin user hiện tại từ store
  const { user, _hasHydrated } = useUserStore()
  
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const { mutate: submitReview, isPending } = useCreateReview()
  
  const handleSubmitReview = () => {
    submitReview({ movie: movieId, rating: rating, comment: comment })
  }

  // Kiểm tra xem review có phải của user hiện tại không
  const isOwnReview = (customerId: string) => {
    return _hasHydrated && user?._id === customerId
  }
  
  // Kiểm tra xem có nên hiển thị review không
  const shouldShowReview = (review: Review) => {
    if (review.status === 'Đã duyệt') return true
    if (review.status === 'Chờ duyệt') {
      return isOwnReview(review.customer._id)
    }
    
    return false
  }

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
        <Textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Viết cảm nhận của bạn..."
          className="mb-3 resize-none min-h-[100px] focus-visible:ring-primary"
          disabled={isPending}
        />
        <Button
          className="bg-primary text-white rounded-lg"
          onClick={handleSubmitReview}
          disabled={isPending || rating === 0}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang gửi...
            </>
          ) : (
            'Gửi đánh giá'
          )}
        </Button>
      </div>

      {/* Danh sách đánh giá */}
      <div className="space-y-4">
        {reviews
          .filter(shouldShowReview)
          .map(r => {
            const isPending = r.status === 'Chờ duyệt'
            const isOwn = isOwnReview(r.customer._id)
            return (
              <div 
                key={r._id} 
                className={`border-b border-border pb-3 px-3 ${
                  isPending && isOwn ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-medium ${
                    isPending && isOwn ? 'text-gray-400' : ''
                  }`}>
                    {r.customer.fullName}
                  </span>
                  <span className={`text-xs ${
                    isPending && isOwn ? 'text-gray-400' : 'text-text-secondary'
                  }`}>
                    {new Date(r.createdAt).toLocaleString('vi-VN')}
                  </span>
                  
                  {/* Badge chờ duyệt */}
                  {isPending && isOwn && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                      <Clock className="w-3 h-3" />
                      Chờ duyệt
                    </span>
                  )}
                </div>
                
                <div className="flex gap-1 mt-1">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        isPending && isOwn 
                          ? 'fill-gray-300 text-gray-300' 
                          : 'fill-accent text-accent'
                      }`}
                    />
                  ))}
                </div>
                
                <p className={`text-sm mt-1 ${
                  isPending && isOwn ? 'text-gray-400' : 'text-text-secondary'
                }`}>
                  {r.comment}
                </p>
              </div>
            )
          })}
      </div>
    </section>
  )
}