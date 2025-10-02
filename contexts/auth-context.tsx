"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { UserFormData } from "@/types/user"

export type UserRole = "admin" | "store_owner" | "customer"

export interface User {
  id: string
  name: string
  email: string
  address?: string
  role: UserRole
  createdAt: string
}

interface AuthContextType {
  user: User | null
  users: User[] // Added users array to expose all users
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, role: UserRole, address?: string) => Promise<boolean>
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([]) // Remove initial mock users
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(false)

  // Function to fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    
    // Fetch users list
    fetchUsers()
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        setIsLoading(false)
        return true
      } else {
        console.error('Login failed:', data.error)
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const signup = async (name: string, email: string, password: string, role: UserRole, address?: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role, address }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        setIsLoading(false)
        return true
      } else {
        console.error('Signup failed:', data.error)
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Signup error:', error)
      setIsLoading(false)
      return false
    }
  }

  const addUser = async (userData: UserFormData): Promise<boolean> => {
    setLoading(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh users list
        await fetchUsers()
        setLoading(false)
        return true
      } else {
        console.error('Add user failed:', data.error)
        setLoading(false)
        return false
      }
    } catch (error) {
      console.error('Add user error:', error)
      setLoading(false)
      return false
    }
  }

  const updateUser = async (userId: string, userData: UserFormData): Promise<boolean> => {
    setLoading(true)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh users list
        await fetchUsers()
        
        // If updating current user, update the session
        if (user?.id === userId) {
          const updatedUser = data.user
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }

        setLoading(false)
        return true
      } else {
        console.error('Update user failed:', data.error)
        setLoading(false)
        return false
      }
    } catch (error) {
      console.error('Update user error:', error)
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
