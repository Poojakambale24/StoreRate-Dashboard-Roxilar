"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { StarRating } from "./star-rating"
import { useRatings } from "@/contexts/rating-context"
import { useAuth } from "@/contexts/auth-context"
import type { Rating, RatingFormData } from "@/types/rating"
import { Loader2 } from "lucide-react"

interface RatingFormProps {
  storeId: string
  storeName: string
  existingRating?: Rating
  onSuccess?: () => void
  onCancel?: () => void
}

export function RatingForm({ storeId, storeName, existingRating, onSuccess, onCancel }: RatingFormProps) {
  const { addRating, updateRating, loading } = useRatings()
  const { user } = useAuth()
  const [formData, setFormData] = useState<RatingFormData>({
    rating: existingRating?.rating || 0,
    review: existingRating?.review || "",
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.rating === 0) {
      setError("Please select a rating")
      return
    }

    if (!formData.review.trim()) {
      setError("Please write a review")
      return
    }

    const success = existingRating
      ? await updateRating(existingRating.id, formData)
      : await addRating(storeId, storeName, formData)

    if (success) {
      onSuccess?.()
    } else {
      setError("Failed to save rating")
    }
  }

  if (!user) {
    return (
      <Alert>
        <AlertDescription>Please log in to rate this store.</AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Your Rating</Label>
        <StarRating
          rating={formData.rating}
          interactive
          size="lg"
          onRatingChange={(rating) => setFormData((prev) => ({ ...prev, rating }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="review">Your Review</Label>
        <Textarea
          id="review"
          value={formData.review}
          onChange={(e) => setFormData((prev) => ({ ...prev, review: e.target.value }))}
          placeholder="Share your experience with this store..."
          rows={4}
          disabled={loading}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : existingRating ? (
            "Update Review"
          ) : (
            "Submit Review"
          )}
        </Button>
      </div>
    </form>
  )
}
