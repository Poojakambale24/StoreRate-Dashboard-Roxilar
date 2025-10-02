"use client"

import { useRatings } from "@/contexts/rating-context"
import { useAuth } from "@/contexts/auth-context"
import { RatingCard } from "./rating-card"
import { RatingForm } from "./rating-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRating } from "./star-rating"
import { useState } from "react"
import { Plus } from "lucide-react"

interface RatingListProps {
  storeId: string
  storeName: string
}

export function RatingList({ storeId, storeName }: RatingListProps) {
  const { getRatingsByStore, getUserRatingForStore, getStoreRatingStats } = useRatings()
  const { user } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)

  const storeRatings = getRatingsByStore(storeId)
  const userRating = user ? getUserRatingForStore(user.id, storeId) : undefined
  const stats = getStoreRatingStats(storeId)

  const canAddRating = user && !userRating && user.role !== "store_owner"

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</div>
              <StarRating rating={stats.averageRating} size="sm" />
              <div className="text-sm text-muted-foreground mt-1">{stats.totalRatings} reviews</div>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center space-x-2">
                  <span className="text-sm w-3">{star}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width:
                          stats.totalRatings > 0
                            ? `${(stats.ratingDistribution[star as keyof typeof stats.ratingDistribution] / stats.totalRatings) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {stats.ratingDistribution[star as keyof typeof stats.ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Rating Form */}
      {canAddRating && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Write a Review</CardTitle>
              {!showAddForm && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Review
                </Button>
              )}
            </div>
          </CardHeader>
          {showAddForm && (
            <CardContent>
              <RatingForm
                storeId={storeId}
                storeName={storeName}
                onSuccess={() => setShowAddForm(false)}
                onCancel={() => setShowAddForm(false)}
              />
            </CardContent>
          )}
        </Card>
      )}

      {/* User's Existing Rating */}
      {userRating && (
        <Card>
          <CardHeader>
            <CardTitle>Your Review</CardTitle>
          </CardHeader>
          <CardContent>
            <RatingCard rating={userRating} showActions />
          </CardContent>
        </Card>
      )}

      {/* All Ratings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Reviews ({storeRatings.length})</h3>
        {storeRatings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this store!</p>
            </CardContent>
          </Card>
        ) : (
          storeRatings
            .filter((rating) => rating.id !== userRating?.id)
            .map((rating) => <RatingCard key={rating.id} rating={rating} />)
        )}
      </div>
    </div>
  )
}
