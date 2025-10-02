"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStores } from "@/contexts/store-context"
import { useRatings } from "@/contexts/rating-context"
import { useAuth } from "@/contexts/auth-context"
import { Store, Star, MessageSquare, Plus, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { StoreFormDialog } from "@/components/stores/store-form-dialog"

export function StoreOwnerDashboard() {
  const { stores, getStoresByOwner } = useStores()
  const { ratings, getRatingsByStore, getStoreRatingStats } = useRatings()
  const { user } = useAuth()
  const [showAddDialog, setShowAddDialog] = useState(false)

  if (!user) return null

  const myStores = getStoresByOwner(user.id)
  const totalStores = myStores.length

  // Calculate metrics for owner's stores
  const myStoreRatings = myStores.flatMap((store) => getRatingsByStore(store.id))
  const totalReviews = myStoreRatings.length
  const averageRating =
    totalReviews > 0 ? myStoreRatings.reduce((sum, rating) => sum + rating.rating, 0) / totalReviews : 0

  // Recent reviews for owner's stores
  const recentReviews = myStoreRatings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Store analytics
  const storeAnalytics = myStores.map((store) => {
    const stats = getStoreRatingStats(store.id)
    return {
      ...store,
      ...stats,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Store Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your stores and track performance</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Store
        </Button>
      </div>

      {/* Owner Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">My Stores</p>
                <p className="text-2xl font-bold">{totalStores}</p>
              </div>
              <Store className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
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
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {totalStores === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No stores yet</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first store</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Store
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Store Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {storeAnalytics.map((store) => (
                  <div key={store.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{store.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={store.averageRating >= 4 ? "default" : "secondary"}>
                          {store.averageRating.toFixed(1)} ⭐
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{store.totalRatings} reviews</div>

                    {/* Rating distribution */}
                    <div className="space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center space-x-2">
                          <span className="text-xs w-3">{star}</span>
                          <Progress
                            value={
                              store.totalRatings > 0
                                ? (store.ratingDistribution[star as keyof typeof store.ratingDistribution] /
                                    store.totalRatings) *
                                  100
                                : 0
                            }
                            className="flex-1 h-2"
                          />
                          <span className="text-xs text-muted-foreground w-6">
                            {store.ratingDistribution[star as keyof typeof store.ratingDistribution]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No reviews yet</p>
                ) : (
                  recentReviews.map((review) => (
                    <div key={review.id} className="border-l-2 border-primary pl-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{review.storeName}</p>
                        <Badge
                          variant={review.rating >= 4 ? "default" : review.rating >= 3 ? "secondary" : "destructive"}
                        >
                          {review.rating} ⭐
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{review.review}</p>
                      <p className="text-xs text-muted-foreground">
                        by {review.userName} • {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <StoreFormDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={() => setShowAddDialog(false)} />
    </div>
  )
}
