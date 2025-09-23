"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Rating, RatingFormData, RatingStats } from "@/types/rating"
import { useAuth } from "./auth-context"

interface RatingContextType {
  ratings: Rating[]
  loading: boolean
  addRating: (storeId: string, storeName: string, ratingData: RatingFormData) => Promise<boolean>
  updateRating: (id: string, ratingData: RatingFormData) => Promise<boolean>
  deleteRating: (id: string) => Promise<boolean>
  getRatingsByStore: (storeId: string) => Rating[]
  getRatingsByUser: (userId: string) => Rating[]
  getUserRatingForStore: (userId: string, storeId: string) => Rating | undefined
  getStoreRatingStats: (storeId: string) => RatingStats
  refreshRatings: () => Promise<void>
}

const RatingContext = createContext<RatingContextType | undefined>(undefined)

export function useRatings() {
  const context = useContext(RatingContext)
  if (context === undefined) {
    throw new Error("useRatings must be used within a RatingProvider")
  }
  return context
}

export function RatingProvider({ children }: { children: React.ReactNode }) {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const refreshRatings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ratings")
      if (response.ok) {
        const data = await response.json()
        setRatings(data.ratings || [])
      }
    } catch (error) {
      console.error("Error fetching ratings:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    refreshRatings()
  }, [])

  const addRating = async (storeId: string, storeName: string, ratingData: RatingFormData): Promise<boolean> => {
    if (!user) return false
    setLoading(true)
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, storeName, userId: user.id, userName: user.name, ...ratingData }),
      })
      if (response.ok) {
        await refreshRatings()
        setLoading(false)
        return true
      }
    } catch (error) {
      console.error("Error adding rating:", error)
    }
    setLoading(false)
    return false
  }

  const updateRating = async (id: string, ratingData: RatingFormData): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await fetch(`/api/ratings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ratingData),
      })
      if (response.ok) {
        await refreshRatings()
        setLoading(false)
        return true
      }
    } catch (error) {
      console.error("Error updating rating:", error)
    }
    setLoading(false)
    return false
  }

  const deleteRating = async (id: string): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await fetch(`/api/ratings/${id}`, { method: "DELETE" })
      if (response.ok) {
        await refreshRatings()
        setLoading(false)
        return true
      }
    } catch (error) {
      console.error("Error deleting rating:", error)
    }
    setLoading(false)
    return false
  }

  const getRatingsByStore = (storeId: string): Rating[] => {
    return ratings.filter((rating) => rating.storeId === storeId)
  }

  const getRatingsByUser = (userId: string): Rating[] => {
    return ratings.filter((rating) => rating.userId === userId)
  }

  const getUserRatingForStore = (userId: string, storeId: string): Rating | undefined => {
    return ratings.find((rating) => rating.userId === userId && rating.storeId === storeId)
  }

  const getStoreRatingStats = (storeId: string): RatingStats => {
    const storeRatings = getRatingsByStore(storeId)
    const totalRatings = storeRatings.length
    if (totalRatings === 0) {
      return { averageRating: 0, totalRatings: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
    }
    const sum = storeRatings.reduce((acc, rating) => acc + rating.rating, 0)
    const averageRating = sum / totalRatings
    const ratingDistribution = storeRatings.reduce(
      (acc, rating) => {
        acc[rating.rating as keyof typeof acc]++
        return acc
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    )
    return { averageRating, totalRatings, ratingDistribution }
  }

  return (
    <RatingContext.Provider
      value={{
        ratings,
        loading,
        addRating,
        updateRating,
        deleteRating,
        getRatingsByStore,
        getRatingsByUser,
        getUserRatingForStore,
        getStoreRatingStats,
        refreshRatings,
      }}
    >
      {children}
    </RatingContext.Provider>
  )
}
