"use client"

import type { Rating } from "@/types/rating"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarRating } from "./star-rating"
import { useAuth } from "@/contexts/auth-context"
import { useRatings } from "@/contexts/rating-context"
import { useState } from "react"
import { RatingForm } from "./rating-form"
import { Edit, Trash2, User } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface RatingCardProps {
  rating: Rating
  showActions?: boolean
}

export function RatingCard({ rating, showActions = false }: RatingCardProps) {
  const { user } = useAuth()
  const { deleteRating } = useRatings()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const canEdit = user && (user.id === rating.userId || user.role === "admin")
  const canDelete = user && (user.id === rating.userId || user.role === "admin")

  const handleDelete = async () => {
    await deleteRating(rating.id)
    setShowDeleteDialog(false)
  }

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-6">
          <RatingForm
            storeId={rating.storeId}
            storeName={rating.storeName}
            existingRating={rating}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{rating.userName}</span>
                  <StarRating rating={rating.rating} size="sm" />
                </div>

                <p className="text-muted-foreground">{rating.review}</p>

                <div className="text-xs text-muted-foreground">
                  {new Date(rating.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {rating.updatedAt !== rating.createdAt && " (edited)"}
                </div>
              </div>
            </div>

            {showActions && (canEdit || canDelete) && (
              <div className="flex space-x-2">
                {canEdit && (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
