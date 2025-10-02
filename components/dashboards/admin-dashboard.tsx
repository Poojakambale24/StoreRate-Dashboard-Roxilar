"use client"
import { RatingsChart } from "@/components/ratings-chart"
import { RecentActivity } from "@/components/recent-activity"
import { TopStores } from "@/components/top-stores"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStores } from "@/contexts/store-context"
import { useRatings } from "@/contexts/rating-context"
import { useAuth } from "@/contexts/auth-context"
import { Users, Store, MessageSquare, TrendingUp, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function AdminDashboard() {
  const { stores } = useStores()
  const { ratings } = useRatings()
  const { user, users } = useAuth() // Get users from auth context

  // Calculate admin-specific metrics
  const totalUsers = users.length // Use real user count instead of hardcoded value
  const totalStores = stores.length
  const totalReviews = ratings.length
  const averageRating =
    ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length : 0

  // Recent problematic reviews (low ratings)
  const problematicReviews = ratings.filter((rating) => rating.rating <= 2).slice(0, 5)

  // Store performance metrics
  const storePerformance = stores
    .map((store) => {
      const storeRatings = ratings.filter((r) => r.storeId === store.id)
      const avgRating =
        storeRatings.length > 0 ? storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length : 0
      return {
        ...store,
        reviewCount: storeRatings.length,
        avgRating,
      }
    })
    .sort((a, b) => b.reviewCount - a.reviewCount)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>
        <div className="text-sm text-muted-foreground">Welcome back, {user?.name}</div>
      </div>

      {/* Admin Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Stores</p>
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
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid - Equal Heights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Section - Ratings Chart */}
        <div className="lg:col-span-8">
          <Card className="h-full">
            <RatingsChart />
          </Card>
        </div>

        {/* Right Section - Recent Activity */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <RecentActivity />
          </Card>
        </div>
      </div>

      {/* Bottom Section - Store Performance & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
        {/* Store Performance */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Store Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-full flex flex-col">
            <div className="space-y-4 flex-1">
              {storePerformance.slice(0, 5).map((store) => (
                <div key={store.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-muted-foreground">{store.reviewCount} reviews</p>
                  </div>
                  <Badge
                    variant={store.avgRating >= 4 ? "default" : store.avgRating >= 3 ? "secondary" : "destructive"}
                  >
                    {store.avgRating.toFixed(1)} ⭐
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Problematic Reviews */}
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Reviews Needing Attention</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-full flex flex-col">
            <div className="space-y-4 flex-1">
              {problematicReviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No problematic reviews found</p>
              ) : (
                problematicReviews.map((review) => (
                  <div key={review.id} className="border-l-2 border-destructive pl-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{review.storeName}</p>
                      <Badge variant="destructive">{review.rating} ⭐</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{review.review}</p>
                    <p className="text-xs text-muted-foreground">by {review.userName}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <TopStores />
    </div>
  )
}
