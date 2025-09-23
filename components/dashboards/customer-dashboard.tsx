"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStores } from "@/contexts/store-context"
import { useRatings } from "@/contexts/rating-context"
import { useAuth } from "@/contexts/auth-context"
import { Star, MessageSquare, Heart, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ratings/star-rating"
import Link from "next/link"

export function CustomerDashboard() {
  const { stores } = useStores()
  const { ratings, getRatingsByUser } = useRatings()
  const { user } = useAuth()

  if (!user) return null

  const myReviews = getRatingsByUser(user.id)
  const totalReviews = myReviews.length
  const averageRatingGiven =
    totalReviews > 0 ? myReviews.reduce((sum, rating) => sum + rating.rating, 0) / totalReviews : 0

  // Recent reviews by user
  const recentReviews = myReviews
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  // Recommended stores (high-rated stores user hasn't reviewed)
  const reviewedStoreIds = new Set(myReviews.map((r) => r.storeId))
  const recommendedStores = stores
    .filter((store) => !reviewedStoreIds.has(store.id))
    .filter((store) => store.averageRating >= 4.0)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 4)

  // Favorite categories based on user's reviews
  const categoryPreferences = myReviews.reduce(
    (acc, review) => {
      const store = stores.find((s) => s.id === review.storeId)
      if (store) {
        acc[store.category] = (acc[store.category] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const favoriteCategory = Object.entries(categoryPreferences).sort(([, a], [, b]) => b - a)[0]?.[0] || "None"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground">Your reviews and recommendations</p>
        </div>
        <div className="text-sm text-muted-foreground">Welcome back, {user?.name}</div>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">My Reviews</p>
                <p className="text-2xl font-bold">{totalReviews}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Rating Given</p>
                <p className="text-2xl font-bold">{averageRatingGiven.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favorite Category</p>
                <p className="text-2xl font-bold">{favoriteCategory}</p>
              </div>
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {totalReviews === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-4">Start exploring and reviewing stores to see your activity here</p>
            <Link href="/stores">
              <Button>Browse Stores</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Recent Reviews</CardTitle>
                <Link href="/reviews">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border-l-2 border-primary pl-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{review.storeName}</p>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{review.review}</p>
                    <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Stores */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedStores.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No recommendations available</p>
                ) : (
                  recommendedStores.map((store) => (
                    <div key={store.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{store.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{store.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <StarRating rating={store.averageRating} size="sm" />
                          <span className="text-sm text-muted-foreground">({store.totalRatings} reviews)</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge>{store.category}</Badge>
                        <Link href={`/stores/${store.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Preferences */}
      {Object.keys(categoryPreferences).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Category Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryPreferences)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => (
                  <Badge key={category} variant="secondary">
                    {category} ({count})
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
