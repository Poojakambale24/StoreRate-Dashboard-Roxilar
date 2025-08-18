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
}

export function LoginForm({ defaultRole = "customer" }: LoginFormProps) {
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
    <Card className="w-full max-w-md bg-gradient-to-br from-card via-card/95 to-card/90 border-2 border-primary/20 shadow-2xl">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-2">
          {isAdminMode ? (
            <div className="p-2 rounded-full bg-primary/20">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          ) : (
            <div className="p-2 rounded-full bg-accent/20">
              <Users className="h-8 w-8 text-accent" />
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
          <CardTitle className="text-2xl">{isAdminMode ? "Admin Portal" : "Welcome Back"}</CardTitle>
          <CardDescription className="text-base">
            {isAdminMode ? "Access the admin dashboard to manage the platform" : "Sign in to rate and review stores"}
          </CardDescription>
        </div>
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            isAdminMode
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-accent/20 text-accent border border-accent/30"
          }`}
        >
          {isAdminMode ? "Administrator Access" : "User Access"}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
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
                Signing in...
              </>
            ) : (
              <>
                {isAdminMode ? <Shield className="mr-2 h-4 w-4" /> : <Users className="mr-2 h-4 w-4" />}
                Sign In as {isAdminMode ? "Admin" : "User"}
              </>
            )}
          </Button>
        </form>

        <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
          <p className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Star className="mr-2 h-4 w-4 text-primary" />
            Demo Accounts
          </p>
          <div className="grid gap-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-background/30 rounded border border-border/30">
              <span className="font-medium text-primary">Admin:</span>
              <span className="text-muted-foreground">admin@storerate.com</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-background/30 rounded border border-border/30">
              <span className="font-medium text-accent">Store Owner:</span>
              <span className="text-muted-foreground">owner@storerate.com</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-background/30 rounded border border-border/30">
              <span className="font-medium text-foreground">Customer:</span>
              <span className="text-muted-foreground">customer@storerate.com</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-primary/10 rounded border border-primary/30 mt-1">
              <span className="font-medium text-primary">Password:</span>
              <span className="text-primary font-mono">password123</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
