'use client'
import { useState } from 'react'
import { type Review } from '@/types'
export function useMovieReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const addReview = (review: Review) => setReviews(prev => [...prev, review])
  return { reviews, addReview }
}
