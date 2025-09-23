export interface Store {
  id: string
  name: string
  description: string
  location: string
  category: string
  imageUrl: string
  ownerId: string
  ownerName: string
  averageRating: number
  totalRatings: number
  createdAt: string
  updatedAt: string
}

export interface StoreFormData {
  name: string
  description: string
  location: string
  category: string
  imageUrl: string
}

export const STORE_CATEGORIES = [
  "Restaurant",
  "Retail",
  "Electronics",
  "Grocery",
  "Fashion",
  "Beauty",
  "Health",
  "Services",
  "Entertainment",
  "Other",
] as const

export type StoreCategory = (typeof STORE_CATEGORIES)[number]
