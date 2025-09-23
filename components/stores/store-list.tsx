"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { StoreCard } from "./store-card"
import { StoreFilters } from "./store-filters"
import { useStores } from "@/contexts/store-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StoreFormDialog } from "./store-form-dialog"

export function StoreList() {
  const { stores, searchStores } = useStores()
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [showAddDialog, setShowAddDialog] = useState(false)

  // Initialize search from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    if (urlSearch) {
      setSearchQuery(urlSearch)
    }
  }, [searchParams])

  const filteredStores =
    searchQuery || selectedCategory ? searchStores(searchQuery, selectedCategory || undefined) : stores

  const canAddStore = user?.role === "admin" || user?.role === "store_owner"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Stores</h1>
        {canAddStore && (
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Store
          </Button>
        )}
      </div>

      <StoreFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>

      {filteredStores.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No stores found matching your criteria.</p>
        </div>
      )}

      <StoreFormDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={() => setShowAddDialog(false)} />
    </div>
  )
}
