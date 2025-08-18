"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { Store, StoreFormData } from "@/types/store"
import { useAuth } from "./auth-context"

interface StoreContextType {
  stores: Store[]
  loading: boolean
  addStore: (storeData: StoreFormData) => Promise<boolean>
  updateStore: (id: string, storeData: StoreFormData) => Promise<boolean>
  deleteStore: (id: string) => Promise<boolean>
  getStoreById: (id: string) => Store | undefined
  getStoresByOwner: (ownerId: string) => Store[]
  searchStores: (query: string, category?: string) => Store[]
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function useStores() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStores must be used within a StoreProvider")
  }
  return context
}

// Mock store data
const mockStores: Store[] = [
  {
    id: "1",
    name: "Cozy Corner Cafe",
    description: "A warm and inviting cafe serving artisanal coffee and fresh pastries",
    location: "Downtown District",
    category: "Restaurant",
    imageUrl: "/cozy-corner-cafe.png",
    ownerId: "2",
    ownerName: "Store Owner",
    averageRating: 4.5,
    totalRatings: 127,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Tech Haven Electronics",
    description: "Your one-stop shop for the latest gadgets and electronics",
    location: "Tech Plaza",
    category: "Electronics",
    imageUrl: "/electronics-store-interior.png",
    ownerId: "2",
    ownerName: "Store Owner",
    averageRating: 4.2,
    totalRatings: 89,
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
  },
  {
    id: "3",
    name: "Bella Vista Restaurant",
    description: "Fine dining with authentic Italian cuisine and beautiful ambiance",
    location: "Riverside Avenue",
    category: "Restaurant",
    imageUrl: "/cozy-italian-restaurant.png",
    ownerId: "2",
    ownerName: "Store Owner",
    averageRating: 4.8,
    totalRatings: 203,
    createdAt: "2024-01-05T18:00:00Z",
    updatedAt: "2024-01-05T18:00:00Z",
  },
]

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>(mockStores)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const addStore = async (storeData: StoreFormData): Promise<boolean> => {
    if (!user) return false

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newStore: Store = {
      id: Date.now().toString(),
      ...storeData,
      ownerId: user.id,
      ownerName: user.name,
      averageRating: 0,
      totalRatings: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setStores((prev) => [...prev, newStore])
    setLoading(false)
    return true
  }

  const updateStore = async (id: string, storeData: StoreFormData): Promise<boolean> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setStores((prev) =>
      prev.map((store) =>
        store.id === id
          ? {
              ...store,
              ...storeData,
              updatedAt: new Date().toISOString(),
              averageRating: store.averageRating, // Keep existing rating
              totalRatings: store.totalRatings, // Keep existing count
            }
          : store,
      ),
    )

    setLoading(false)
    return true
  }

  const deleteStore = async (id: string): Promise<boolean> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setStores((prev) => prev.filter((store) => store.id !== id))
    setLoading(false)
    return true
  }

  const getStoreById = (id: string): Store | undefined => {
    return stores.find((store) => store.id === id)
  }

  const getStoresByOwner = (ownerId: string): Store[] => {
    return stores.filter((store) => store.ownerId === ownerId)
  }

  const searchStores = (query: string, category?: string): Store[] => {
    return stores.filter((store) => {
      const matchesQuery =
        store.name.toLowerCase().includes(query.toLowerCase()) ||
        store.description.toLowerCase().includes(query.toLowerCase()) ||
        store.location.toLowerCase().includes(query.toLowerCase())

      const matchesCategory = !category || store.category === category

      return matchesQuery && matchesCategory
    })
  }

  return (
    <StoreContext.Provider
      value={{
        stores,
        loading,
        addStore,
        updateStore,
        deleteStore,
        getStoreById,
        getStoresByOwner,
        searchStores,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
