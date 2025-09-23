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
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface StoreFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store?: Store
  onSuccess: () => void
}

export function StoreFormDialog({ open, onOpenChange, store, onSuccess }: StoreFormDialogProps) {
  const { addStore, updateStore, loading } = useStores()
  const { user } = useAuth()
  const [formData, setFormData] = useState<StoreFormData>({
    name: "",
    description: "",
    location: "",
    category: "",
    imageUrl: "",
  })
  const [error, setError] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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
      setSelectedFile(null)
      setImagePreview(null)
    }
    setError("")
  }, [store, open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file")
        return
      }

      // Check file size (max 2MB to avoid database issues)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB")
        return
      }

      setSelectedFile(file)
      
      // Create a canvas to compress the image
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          // Set max dimensions (800x600 for reasonable size)
          const maxWidth = 800
          const maxHeight = 600
          let { width, height } = img
          
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height)
          
          // Convert to base64 with compression (0.8 quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
          
          setImagePreview(compressedBase64)
          setFormData(prev => ({ ...prev, imageUrl: compressedBase64 }))
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.description || !formData.location || !formData.category) {
      setError("Please fill in all required fields")
      return
    }

    console.log("Submitting store data:", formData)
    console.log("Current user:", user)

    const success = store ? await updateStore(store.id, formData) : await addStore(formData)

    if (success) {
      console.log("Store saved successfully")
      onSuccess()
    } else {
      console.log("Store save failed")
      setError("Failed to save store. Please check your login status and role permissions.")
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
            <Label htmlFor="imageFile">Store Image</Label>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('imageFile')?.click()}
                disabled={loading}
                className="shrink-0"
              >
                Choose File
              </Button>
              <span className="text-sm text-gray-600">
                {selectedFile ? `${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)` : 'No file selected'}
              </span>
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 2MB
            </p>
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
