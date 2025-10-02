"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
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
  refreshStores: () => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function useStores() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStores must be used within a StoreProvider")
  }
  return context
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Fetch stores from database
  const refreshStores = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stores')
      if (response.ok) {
        const data = await response.json()
        setStores(data.stores || [])
      } else {
        console.error('Failed to fetch stores:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching stores:', error)
    }
    setLoading(false)
  }

  // Load stores on mount
  useEffect(() => {
    refreshStores()
  }, [])

  const addStore = async (storeData: StoreFormData): Promise<boolean> => {
    if (!user) return false

    setLoading(true)
    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: storeData.name,
          description: storeData.description,
          address: storeData.location, // Map location to address
          category: storeData.category,
          imageUrl: storeData.imageUrl,
          ownerId: user.id,
        }),
      })

      if (response.ok) {
        await refreshStores()
        setLoading(false)
        return true
      } else {
        const errorData = await response.json()
        console.error('Failed to add store:', errorData)
        setLoading(false)
        return false
      }
    } catch (error) {
      console.error('Error adding store:', error)
      setLoading(false)
      return false
    }
  }

  const updateStore = async (id: string, storeData: StoreFormData): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await fetch(`/api/stores/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: storeData.name,
          description: storeData.description,
          address: storeData.location, // Map location to address
          category: storeData.category,
          imageUrl: storeData.imageUrl,
        }),
      })

      if (response.ok) {
        await refreshStores()
        setLoading(false)
        return true
      } else {
        const errorData = await response.json()
        console.error('Failed to update store:', errorData)
        setLoading(false)
        return false
      }
    } catch (error) {
      console.error('Error updating store:', error)
      setLoading(false)
      return false
    }
  }

  const deleteStore = async (id: string): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await fetch(`/api/stores/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await refreshStores()
        setLoading(false)
        return true
      } else {
        console.error('Failed to delete store:', response.statusText)
        setLoading(false)
        return false
      }
    } catch (error) {
      console.error('Error deleting store:', error)
      setLoading(false)
      return false
    }
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
        refreshStores,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
