"use client"

import { useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "user"
  const [mode, setMode] = useState<"login" | "signup">("login")

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">
            {type === "admin" ? "Admin" : "User"} {mode === "login" ? "Login" : "Sign Up"}
          </h1>
          <p className="text-muted-foreground">
            {type === "admin"
              ? "Access the admin dashboard to manage stores and users"
              : "Join our community to rate and review stores"}
          </p>
        </div>

        {mode === "login" ? (
          <LoginForm defaultRole={type === "admin" ? "admin" : "customer"} />
        ) : (
          <SignupForm defaultRole={type === "admin" ? "admin" : "customer"} />
        )}

        <div className="text-center">
          <Button variant="link" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-sm">
            {mode === "login" ? `Don't have an account? Sign up` : `Already have an account? Login`}
          </Button>
        </div>
      </div>
    </div>
  )
}
