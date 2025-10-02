"use client"

import { useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "user"
  const [mode, setMode] = useState<"login" | "signup">("login")

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left side - Background Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950"
      >
        {/* Tech image covering full area with dark overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/bg-auth-tech.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        
        {/* Dark slate overlay to match dashboard theme */}
        <div className="absolute inset-0 bg-slate-950/80"></div>
        
        {/* Additional gradient overlay for depth with purple accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-purple-950/70"></div>
        
        {/* Content overlay with enhanced styling */}
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="text-center text-white space-y-6 p-8 max-w-md">
            <div className="mb-4">
              <Star className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-pulse" />
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              StoreRate
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              Discover, Rate & Share Amazing Store Experiences
            </p>
            <div className="flex justify-center space-x-2 pt-4">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950 relative min-h-screen">
        {/* Mobile background for small screens - only shows on mobile */}
        <div 
          className="absolute inset-0 lg:hidden bg-slate-950"
        ></div>
        <div 
          className="absolute inset-0 lg:hidden"
          style={{
            backgroundImage: 'url(/bg-auth-tech.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="absolute inset-0 lg:hidden bg-slate-950/85"></div>
        <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-slate-900/90 via-slate-950/85 to-purple-950/70"></div>
        
        <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
            
            {/* Mobile logo for small screens */}
            <div className="lg:hidden mb-4">
              <Star className="h-12 w-12 text-purple-400 mx-auto mb-2" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                StoreRate
              </h2>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold flex items-center justify-center gap-2 text-white">
              <Star className="hidden lg:block h-6 w-6 text-purple-400" />
              {mode === "login" ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              {mode === "login" ? "Sign in to your account" : "Create your account to get started"}
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-4 sm:p-6">
            {mode === "login" ? (
              <LoginForm 
                defaultRole={type === "admin" ? "admin" : "customer"}
                onSwitchToSignup={() => setMode("signup")}
              />
            ) : (
              <SignupForm 
                defaultRole={type === "admin" ? "admin" : "customer"}
                onSwitchToLogin={() => setMode("login")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
