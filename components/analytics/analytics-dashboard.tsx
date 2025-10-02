"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useStores } from "@/contexts/store-context"
import { useRatings } from "@/contexts/rating-context"
import { RatingsChart } from "@/components/ratings-chart"
import { BarChart3, TrendingUp, TrendingDown, Activity } from "lucide-react"

export function AnalyticsDashboard() {
  const { user } = useAuth()
  const { stores } = useStores()
  const { ratings } = useRatings()

  // Only admins can access analytics
  if (user?.role !== "admin") {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  // Calculate analytics metrics
  const totalStores = stores.length
  const totalRatings = ratings.length
  const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0

  // Category distribution
  const categoryStats = stores.reduce(
    (acc, store) => {
      acc[store.category] = (acc[store.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Rating trends (mock data for demo)
  const ratingTrends = {
    thisMonth: 4.2,
    lastMonth: 4.1,
    growth: 2.4,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <div className="text-sm text-muted-foreground">Platform insights and trends</div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Platform Rating</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />+{ratingTrends.growth}% from last month
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Stores</p>
                <p className="text-2xl font-bold">{totalStores}</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% this month
                </div>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{totalRatings}</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% this week
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold">73%</p>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2% from last week
                </div>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Grid - Equal Heights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Section - Ratings Chart */}
        <div className="lg:col-span-8">
          <RatingsChart />
        </div>

        {/* Right Section - Category Distribution */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Store Categories</CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col">
              <div className="space-y-4 flex-1">
                {Object.entries(categoryStats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="font-medium">{category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(count / totalStores) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
        {/* Performance Metrics */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-full flex flex-col">
            <div className="space-y-6 flex-1">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Monthly Growth</p>
                  <p className="text-sm text-muted-foreground">Store registrations</p>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  <span className="text-lg font-bold">+12%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Review Volume</p>
                  <p className="text-sm text-muted-foreground">This week vs last week</p>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  <span className="text-lg font-bold">+8%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Engagement Rate</p>
                  <p className="text-sm text-muted-foreground">User activity decline</p>
                </div>
                <div className="flex items-center text-red-600">
                  <TrendingDown className="h-5 w-5 mr-2" />
                  <span className="text-lg font-bold">-2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Stores */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Top Performing Stores</CardTitle>
          </CardHeader>
          <CardContent className="h-full flex flex-col">
            <div className="space-y-4 flex-1">
              {stores
                .map((store) => {
                  const storeRatings = ratings.filter((r) => r.storeId === store.id)
                  const avgRating = storeRatings.length > 0 ? 
                    storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length : 0
                  return { ...store, avgRating, reviewCount: storeRatings.length }
                })
                .sort((a, b) => b.avgRating - a.avgRating)
                .slice(0, 5)
                .map((store) => (
                  <div key={store.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{store.name}</p>
                      <p className="text-sm text-muted-foreground">{store.reviewCount} reviews</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-yellow-600">
                        <span className="text-lg font-bold">{store.avgRating.toFixed(1)}</span>
                        <span className="ml-1">⭐</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
