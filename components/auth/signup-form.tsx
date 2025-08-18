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
}

export function SignupForm({ defaultRole = "customer" }: SignupFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    const success = await signup(name, email, password, role)
    if (success) {
      console.log("[v0] Signup successful, redirecting to dashboard")
      router.push("/dashboard")
    } else {
      setError("Failed to create account")
    }
  }

  const isAdminMode = defaultRole === "admin"

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-card via-card/95 to-card/90 border-2 border-primary/20 shadow-2xl">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-2">
          {isAdminMode ? (
            <div className="p-2 rounded-full bg-primary/20">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          ) : (
            <div className="p-2 rounded-full bg-accent/20">
              <UserPlus className="h-8 w-8 text-accent" />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Star className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              StoreRate
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl">{isAdminMode ? "Admin Registration" : "Create Account"}</CardTitle>
          <CardDescription className="text-base">
            {isAdminMode
              ? "Register for admin access to manage the platform"
              : "Join StoreRate to start rating and reviewing stores"}
          </CardDescription>
        </div>
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            isAdminMode
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-accent/20 text-accent border border-accent/30"
          }`}
        >
          {isAdminMode ? "Administrator Registration" : "User Registration"}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Account Type
            </Label>
            <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                <SelectItem value="customer" className="focus:bg-accent/20">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-accent" />
                    <span>Customer</span>
                  </div>
                </SelectItem>
                <SelectItem value="store_owner" className="focus:bg-primary/20">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span>Store Owner</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin" className="focus:bg-primary/20">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Administrator</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className={`w-full h-11 font-semibold ${
              isAdminMode
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "bg-accent hover:bg-accent/90 text-accent-foreground"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create {isAdminMode ? "Admin" : "User"} Account
              </>
            )}
          </Button>
        </form>

        <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
          <p className="text-sm font-medium text-foreground mb-2 flex items-center">
            <Star className="mr-2 h-4 w-4 text-primary" />
            Account Information
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <strong>Customer:</strong> Rate and review stores, browse recommendations
            </p>
            <p>
              <strong>Store Owner:</strong> Manage your stores, view analytics
            </p>
            <p>
              <strong>Administrator:</strong> Full platform management access
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
