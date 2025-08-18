"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { type Store, type StoreFormData, STORE_CATEGORIES } from "@/types/store"
import { useStores } from "@/contexts/store-context"
import { Loader2 } from "lucide-react"

interface StoreFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store?: Store
  onSuccess: () => void
}

export function StoreFormDialog({ open, onOpenChange, store, onSuccess }: StoreFormDialogProps) {
  const { addStore, updateStore, loading } = useStores()
  const [formData, setFormData] = useState<StoreFormData>({
    name: "",
    description: "",
    location: "",
    category: "",
    imageUrl: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        description: store.description,
        location: store.location,
        category: store.category,
        imageUrl: store.imageUrl,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        location: "",
        category: "",
        imageUrl: "",
      })
    }
    setError("")
  }, [store, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.description || !formData.location || !formData.category) {
      setError("Please fill in all required fields")
      return
    }

    const success = store ? await updateStore(store.id, formData) : await addStore(formData)

    if (success) {
      onSuccess()
    } else {
      setError("Failed to save store")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{store ? "Edit Store" : "Add New Store"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Store Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter store name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your store"
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Store location"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {STORE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : store ? (
                "Update Store"
              ) : (
                "Add Store"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
