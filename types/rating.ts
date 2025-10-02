export interface Rating {
  id: string
  userId: string
  userName: string
  storeId: string
  storeName: string
  rating: number
  review: string
  createdAt: string
  updatedAt: string
}

export interface RatingFormData {
  rating: number
  review: string
}

export interface RatingStats {
  averageRating: number
  totalRatings: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}
