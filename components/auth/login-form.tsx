"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Star, Shield, Users } from "lucide-react"

interface LoginFormProps {
  defaultRole?: "admin" | "customer"
  onSwitchToSignup?: () => void
}

export function LoginForm({ defaultRole = "customer", onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    const success = await login(email, password)
    if (success) {
      console.log("[v0] Login successful, redirecting to dashboard")
      router.push("/dashboard")
    } else {
      setError("Invalid email or password")
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
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
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
          <h2 className="text-xl sm:text-2xl font-bold text-white">{isAdminMode ? "Admin Portal" : "Welcome Back"}</h2>
          <p className="text-sm sm:text-base text-slate-300">
            {isAdminMode ? "Access the admin dashboard to manage stores and users" : "Sign in to rate and review stores"}
          </p>
        </div>
        <div
          className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
            isAdminMode
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
              : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
          }`}
        >
          {isAdminMode ? "Administrator Access" : "User Access"}
        </div>
      </div>

      {/* Form section */}
      <div className="space-y-4 sm:space-y-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
            <Label htmlFor="password" className="text-sm font-medium text-slate-200">
            Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20 h-11 sm:h-12"
            />
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
                <span className="hidden sm:inline">Signing in...</span>
                <span className="sm:hidden">Signing in...</span>
              </>
            ) : (
              <>
                {isAdminMode ? <Shield className="mr-2 h-4 w-4" /> : <Users className="mr-2 h-4 w-4" />}
                <span className="hidden sm:inline">Sign In as {isAdminMode ? "Admin" : "User"}</span>
                <span className="sm:hidden">{isAdminMode ? "Admin Sign In" : "Sign In"}</span>
              </>
            )}
          </Button>
        </form>
        
        {onSwitchToSignup && (
          <div className="text-center mt-3 sm:mt-4">
            <button 
              onClick={onSwitchToSignup}
              className="text-xs sm:text-sm text-slate-400 hover:text-purple-400 transition-colors"
            >
              <span className="hidden sm:inline">Don't have an account? Create one here</span>
              <span className="sm:hidden">Create account</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
