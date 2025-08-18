"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
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
}

const RatingContext = createContext<RatingContextType | undefined>(undefined)

export function useRatings() {
  const context = useContext(RatingContext)
  if (context === undefined) {
    throw new Error("useRatings must be used within a RatingProvider")
  }
  return context
}

// Mock rating data
const mockRatings: Rating[] = [
  {
    id: "1",
    userId: "3",
    userName: "Customer User",
    storeId: "1",
    storeName: "Cozy Corner Cafe",
    rating: 5,
    review:
      "Amazing coffee and cozy atmosphere! The baristas are very friendly and the pastries are fresh. Highly recommend!",
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    userId: "1",
    userName: "Admin User",
    storeId: "1",
    storeName: "Cozy Corner Cafe",
    rating: 4,
    review: "Great place for meetings. Good wifi and comfortable seating. Coffee is excellent.",
    createdAt: "2024-01-18T14:15:00Z",
    updatedAt: "2024-01-18T14:15:00Z",
  },
  {
    id: "3",
    userId: "3",
    userName: "Customer User",
    storeId: "2",
    storeName: "Tech Haven Electronics",
    rating: 4,
    review: "Good selection of electronics and competitive prices. Staff is knowledgeable and helpful.",
    createdAt: "2024-01-16T16:45:00Z",
    updatedAt: "2024-01-16T16:45:00Z",
  },
  {
    id: "4",
    userId: "1",
    userName: "Admin User",
    storeId: "3",
    storeName: "Bella Vista Restaurant",
    rating: 5,
    review:
      "Exceptional dining experience! The pasta is authentic and the service is impeccable. Perfect for special occasions.",
    createdAt: "2024-01-15T19:30:00Z",
    updatedAt: "2024-01-15T19:30:00Z",
  },
]

export function RatingProvider({ children }: { children: React.ReactNode }) {
  const [ratings, setRatings] = useState<Rating[]>(mockRatings)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const addRating = async (storeId: string, storeName: string, ratingData: RatingFormData): Promise<boolean> => {
    if (!user) return false

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newRating: Rating = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      storeId,
      storeName,
      ...ratingData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setRatings((prev) => [...prev, newRating])
    setLoading(false)
    return true
  }

  const updateRating = async (id: string, ratingData: RatingFormData): Promise<boolean> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setRatings((prev) =>
      prev.map((rating) =>
        rating.id === id ? { ...rating, ...ratingData, updatedAt: new Date().toISOString() } : rating,
      ),
    )

    setLoading(false)
    return true
  }

  const deleteRating = async (id: string): Promise<boolean> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setRatings((prev) => prev.filter((rating) => rating.id !== id))
    setLoading(false)
    return true
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
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      }
    }

    const sum = storeRatings.reduce((acc, rating) => acc + rating.rating, 0)
    const averageRating = sum / totalRatings

    const ratingDistribution = storeRatings.reduce(
      (acc, rating) => {
        acc[rating.rating as keyof typeof acc]++
        return acc
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    )

    return {
      averageRating,
      totalRatings,
      ratingDistribution,
    }
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
      }}
    >
      {children}
    </RatingContext.Provider>
  )
}
