"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth, type UserRole } from "@/contexts/auth-context"
import { Loader2, Star, Shield, Users, UserPlus } from "lucide-react"

interface SignupFormProps {
  defaultRole?: "admin" | "customer"
  onSwitchToLogin?: () => void
}

export function SignupForm({ defaultRole = "customer", onSwitchToLogin }: SignupFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [address, setAddress] = useState("")
  const [role, setRole] = useState<UserRole>(defaultRole === "admin" ? "admin" : "customer")
  const [error, setError] = useState("")
  const { signup, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password) {
      setError("Please fill in all fields")
      return
    }

    // Validate name length (20-60 characters)
    if (name.length < 20 || name.length > 60) {
      setError("Name must be between 20 and 60 characters")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    // Validate password (8-16 chars, uppercase, special char)
    if (password.length < 8 || password.length > 16) {
      setError("Password must be between 8 and 16 characters")
      return
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter")
      return
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError("Password must contain at least one special character")
      return
    }

    // Validate address length (max 400 characters)
    if (address && address.length > 400) {
      setError("Address must not exceed 400 characters")
      return
    }

    const success = await signup(name, email, password, role, address)
    if (success) {
      console.log("[v0] Signup successful, redirecting to dashboard")
      router.push("/dashboard")
    } else {
      setError("Failed to create account")
    }
  }

  const isAdminMode = defaultRole === "admin"

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header section */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-2">
          {isAdminMode ? (
            <div className="p-1.5 sm:p-2 rounded-full bg-purple-500/20">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
            </div>
          ) : (
            <div className="p-1.5 sm:p-2 rounded-full bg-purple-500/20">
              <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              StoreRate
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white">{isAdminMode ? "Admin Registration" : "Create Account"}</h2>
          <p className="text-sm sm:text-base text-slate-300">
            {isAdminMode
              ? "Register for admin access to manage stores and users"
              : "Join StoreRate to start rating and reviewing stores"}
          </p>
        </div>
        <div
          className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
            isAdminMode
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
              : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
          }`}
        >
          {isAdminMode ? "Administrator Registration" : "User Registration"}
        </div>
      </div>

      {/* Form section */}
      <div className="space-y-4 sm:space-y-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-200">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20 h-11 sm:h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-200">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20 h-11 sm:h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-slate-200">
              Address
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter your address (optional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20 h-11 sm:h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-slate-200">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password (8-16 chars, uppercase, special char)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20 h-11 sm:h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-slate-200">
              Account Type
            </Label>
            <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-white focus:border-purple-500/50 focus:ring-purple-500/20 h-11 sm:h-12">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600/50">
                <SelectItem value="customer" className="focus:bg-purple-500/20 text-white">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span>Customer</span>
                  </div>
                </SelectItem>
                <SelectItem value="store_owner" className="focus:bg-purple-500/20 text-white">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-purple-400" />
                    <span>Store Owner</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin" className="focus:bg-purple-500/20 text-white">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-purple-400" />
                    <span>Administrator</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive" className="border-red-500/50 bg-red-900/20 text-red-300">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className={`w-full h-11 sm:h-12 font-semibold text-sm sm:text-base ${
              isAdminMode
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Creating account...</span>
                <span className="sm:hidden">Creating...</span>
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Create {isAdminMode ? "Admin" : "User"} Account</span>
                <span className="sm:hidden">{isAdminMode ? "Create Admin" : "Create Account"}</span>
              </>
            )}
          </Button>
        </form>

        {onSwitchToLogin && (
          <div className="text-center mt-3 sm:mt-4">
            <button 
              onClick={onSwitchToLogin}
              className="text-xs sm:text-sm text-slate-400 hover:text-purple-400 transition-colors"
            >
              <span className="hidden sm:inline">Already have an account? Sign in here</span>
              <span className="sm:hidden">Sign in</span>
            </button>
          </div>
        )}

        <div className="p-3 sm:p-4 bg-slate-800/30 rounded-lg border border-slate-600/50">
          <p className="text-sm font-medium text-slate-200 mb-2 flex items-center">
            <Star className="mr-2 h-4 w-4 text-purple-400" />
            Account Information
          </p>
          <div className="text-xs text-slate-400 space-y-1">
            <p>
              <strong className="text-slate-300">Customer:</strong> Rate and review stores, browse recommendations
            </p>
            <p>
              <strong className="text-slate-300">Store Owner:</strong> Manage your stores, view analytics
            </p>
            <p>
              <strong className="text-slate-300">Administrator:</strong> Full platform management access
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
