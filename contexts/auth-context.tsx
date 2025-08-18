"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { UserFormData } from "@/types/user"

export type UserRole = "admin" | "store_owner" | "customer"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

interface AuthContextType {
  user: User | null
  users: User[] // Added users array to expose all users
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  addUser: (userData: UserFormData) => Promise<boolean>
  updateUser: (userId: string, userData: UserFormData) => Promise<boolean>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Mock users for demo purposes
const initialMockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@storerate.com",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Store Owner",
    email: "owner@storerate.com",
    role: "store_owner",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Customer User",
    email: "customer@storerate.com",
    role: "customer",
    createdAt: "2024-01-01T00:00:00Z",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(initialMockUsers) // Added users state
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock authentication - in real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = users.find((u) => u.email === email) // Use users state instead of mockUsers
    if (foundUser && password === "password123") {
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true)

    // Mock signup - in real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    }

    setUsers((prev) => [...prev, newUser])
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const addUser = async (userData: UserFormData): Promise<boolean> => {
    setLoading(true)

    try {
      // Mock API call - in real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if email already exists
      const existingUser = users.find((u) => u.email === userData.email) // Use users state
      if (existingUser) {
        setLoading(false)
        return false
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: new Date().toISOString(),
      }

      setUsers((prev) => [...prev, newUser])
      setLoading(false)
      return true
    } catch (error) {
      setLoading(false)
      return false
    }
  }

  const updateUser = async (userId: string, userData: UserFormData): Promise<boolean> => {
    setLoading(true)

    try {
      // Mock API call - in real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userIndex = users.findIndex((u) => u.id === userId) // Use users state
      if (userIndex === -1) {
        setLoading(false)
        return false
      }

      const updatedUsers = [...users]
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        name: userData.name,
        email: userData.email,
        role: userData.role,
      }
      setUsers(updatedUsers)

      // If updating current user, update the session
      if (user?.id === userId) {
        const updatedUser = updatedUsers[userIndex]
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }

      setLoading(false)
      return true
    } catch (error) {
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        users, // Expose users array
        login,
        signup,
        logout,
        isLoading,
        addUser,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
