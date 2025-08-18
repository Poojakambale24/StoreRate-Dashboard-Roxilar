"use client"

import { useRatings } from "@/contexts/rating-context"
import { useAuth } from "@/contexts/auth-context"
import { RatingCard } from "@/components/ratings/rating-card"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ReviewsList() {
  const { ratings, getRatingsByUser } = useRatings()
  const { user } = useAuth()

  const userReviews = user ? getRatingsByUser(user.id) : []
  const allReviews = ratings

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Reviews</h1>

      <Tabs defaultValue={user?.role === "admin" ? "all" : "my"} className="w-full">
        <TabsList>
          {user?.role !== "admin" && <TabsTrigger value="my">My Reviews ({userReviews.length})</TabsTrigger>}
          {user?.role === "admin" && <TabsTrigger value="all">All Reviews ({allReviews.length})</TabsTrigger>}
        </TabsList>

        {user?.role !== "admin" && (
          <TabsContent value="my" className="space-y-4">
            {userReviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">You haven't written any reviews yet.</p>
                </CardContent>
              </Card>
            ) : (
              userReviews.map((rating) => <RatingCard key={rating.id} rating={rating} showActions />)
            )}
          </TabsContent>
        )}

        {user?.role === "admin" && (
          <TabsContent value="all" className="space-y-4">
            {allReviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No reviews found.</p>
                </CardContent>
              </Card>
            ) : (
              allReviews.map((rating) => <RatingCard key={rating.id} rating={rating} showActions />)
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
