"use client"

import type { Store } from "@/types/store"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useStores } from "@/contexts/store-context"
import { useState } from "react"
import { StoreFormDialog } from "./store-form-dialog"
import Link from "next/link"
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

interface StoreCardProps {
  store: Store
}

export function StoreCard({ store }: StoreCardProps) {
  const { user } = useAuth()
  const { deleteStore } = useStores()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const canEdit = user?.role === "admin" || (user?.role === "store_owner" && user.id === store.ownerId)
  const canDelete = user?.role === "admin" || (user?.role === "store_owner" && user.id === store.ownerId)

  const handleDelete = async () => {
    await deleteStore(store.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video relative overflow-hidden">
          <img src={store.imageUrl || "/placeholder.svg"} alt={store.name} className="w-full h-full object-cover" />
          <Badge className="absolute top-2 right-2 bg-background/80 text-foreground">{store.category}</Badge>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-1">{store.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{store.description}</p>

            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{store.location}</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{store.averageRating > 0 ? store.averageRating.toFixed(1) : "0.0"}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({store.totalRatings} {store.totalRatings === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between">
          <Link href={`/stores/${store.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>

          {(canEdit || canDelete) && (
            <div className="flex space-x-2">
              {canEdit && (
                <Button variant="ghost" size="sm" onClick={() => setShowEditDialog(true)}>
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
        </CardFooter>
      </Card>

      <StoreFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        store={store}
        onSuccess={() => setShowEditDialog(false)}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Store</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{store.name}"? This action cannot be undone.
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
