"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { RatingList } from "@/components/ratings/rating-list"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, ArrowLeft } from "lucide-react"
import { useStores } from "@/contexts/store-context"
import { useRatings } from "@/contexts/rating-context"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function StoreDetailPage({ params }: { params: { id: string } }) {
  const { getStoreById } = useStores()
  const { getStoreRatingStats } = useRatings()
  const [store, setStore] = useState(getStoreById(params.id))
  const [ratingStats, setRatingStats] = useState(getStoreRatingStats(params.id))

  useEffect(() => {
    const foundStore = getStoreById(params.id)
    const stats = getStoreRatingStats(params.id)
    setStore(foundStore)
    setRatingStats(stats)
  }, [params.id, getStoreById, getStoreRatingStats])

  if (!store) {
    return (
      <div className="dark min-h-screen bg-background">
        <AuthGuard>
          <DashboardLayout>
            <div className="flex flex-col items-center justify-center py-12">
              <h1 className="text-2xl font-bold mb-4">Store Not Found</h1>
              <p className="text-muted-foreground mb-6">The store you're looking for doesn't exist.</p>
              <Link href="/stores">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Stores
                </Button>
              </Link>
            </div>
          </DashboardLayout>
        </AuthGuard>
      </div>
    )
  }

  return (
    <div className="dark min-h-screen bg-background">
      <AuthGuard>
        <DashboardLayout>
          <div className="space-y-6">
            {/* Back Button */}
            <Link href="/stores">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Stores
              </Button>
            </Link>

            {/* Store Header */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <img
                      src={store.imageUrl || "/placeholder.svg?height=256&width=384&query=store"}
                      alt={store.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold">{store.name}</h1>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{ratingStats.averageRating.toFixed(1)}</span>
                          </div>
                          <span className="text-muted-foreground">({ratingStats.totalRatings} reviews)</span>
                        </div>
                      </div>
                      <Badge>{store.category}</Badge>
                    </div>

                    <p className="text-muted-foreground">{store.description}</p>

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{store.location}</span>
                    </div>

                    <div className="text-sm text-muted-foreground">Owned by {store.ownerName}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <RatingList storeId={params.id} storeName={store.name} />
          </div>
        </DashboardLayout>
      </AuthGuard>
    </div>
  )
}
