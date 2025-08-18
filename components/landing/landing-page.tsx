"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Users, Shield, BarChart3, MapPin, MessageSquare, Sparkles, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

export function LandingPage() {
  const router = useRouter()

  const handleAdminAccess = () => {
    router.push("/auth?type=admin")
  }

  const handleUserAccess = () => {
    router.push("/auth?type=user")
  }

  const benefits = [
    {
      icon: Star,
      title: "Rate & Review Stores",
      description: "Share your experiences and help others discover great stores in your area.",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a community of reviewers helping each other make informed decisions.",
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      icon: Shield,
      title: "Trusted Reviews",
      description: "Verified reviews from real customers ensure authentic feedback.",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: BarChart3,
      title: "Store Analytics",
      description: "Store owners get detailed insights about customer satisfaction and trends.",
      gradient: "from-blue-600 to-blue-700",
    },
    {
      icon: MapPin,
      title: "Local Discovery",
      description: "Find the best stores near you with location-based recommendations.",
      gradient: "from-indigo-600 to-blue-600",
    },
    {
      icon: MessageSquare,
      title: "Detailed Feedback",
      description: "Read comprehensive reviews with ratings across multiple categories.",
      gradient: "from-blue-700 to-indigo-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-foreground relative overflow-hidden">

     {/* Header with search */}
     <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex gap-1 items-center">       
          <Star className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent gradient-shift">StoreRate</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-slate-300">
            <button onClick={handleAdminAccess} className="hover:text-blue-400 transition font-bold">
              Admin
            </button>
            <button onClick={handleUserAccess} className="hover:text-blue-400 transition font-bold">
              User
            </button>
            <button onClick={handleAdminAccess} className="hover:text-blue-400 transition font-bold">
              Owner
            </button>
          </nav>
          <div className="flex items-center bg-slate-800/60 rounded-lg px-3 py-2 w-64">
            <input
              type="text"
              placeholder="Search stores..."
              className="bg-transparent w-full text-slate-200 placeholder-slate-400 focus:outline-none"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
            </svg>
          </div>
        </div>
      </header>


      <div className="absolute inset-0 overflow-hidden">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

  <section className="relative overflow-hidden gap-20">
  <div className="absolute inset-0 bg-gradient-to-br from-gray-950/30 via-slate-900/50 to-slate-950/70"></div>
  <div className="relative container mx-auto px-4 py-24 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left lg:gap-x-20">
    {/* Text Content */}
    <div className="lg:w-1/2">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-6 py-3 text-sm font-medium text-blue-300 border border-blue-400/30 backdrop-blur-sm">
        <Sparkles className="h-4 w-4 animate-pulse" />
        Production-Ready Store Rating Platform
      </div>
      <h1 className="mb-8 text-5xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        <span className="bg-gradient-to-r from-gray-400 via-red-300 to-purple-400 bg-clip-text text-transparent gradient-shift">
          Your trusted platform for store reviews
        </span>
      </h1>
      <p className="mb-10 text-xl text-slate-300 sm:text-2xl max-w-3xl leading-relaxed">
        The ultimate destination to discover, rate, and review stores. Build trust through authentic community
        feedback and help others make informed decisions.
      </p>
      <div className="flex flex-col gap-6 sm:flex-row sm:justify-start">
        <Button
          onClick={handleAdminAccess}
          size="lg"
          className="bg-gradient-to-r from-gray-600 to-black-700 hover:from-gray-700 hover:to--800 text-white px-10 py-6 text-lg font-semibold rounded-xl shadow-2xl pink-glow border-0 transform hover:scale-105 transition-all duration-300"
        >
          <Shield className="mr-3 h-6 w-6" />
          Admin Access
        </Button>
        <Button
          onClick={handleUserAccess}
          variant="outline"
          size="lg"
          className="border-2 border-blue-400/50 text-blue-300 hover:bg-black-600/20 hover:text-blue-200 hover:border-blue-300 px-10 py-6 text-lg font-semibold rounded-xl bg-slate-800/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
        >
          <Users className="mr-3 h-6 w-6" />
          User Access
        </Button>
      </div>
    </div>

    {/* Image on right */}
    {/* <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center lg:justify-end">
      <img
        src="/main1.png"
        alt="Landing Illustration"
        className="w-full max-w-2xl  rounded-3xl shadow-2xl"
      />
    </div> */}

        {/* Image Stack */}
        <div className="lg:w-1/2 mt-10 lg:mt-0 relative flex justify-center lg:justify-end">
      <div className="relative w-full max-w-lg h-[340px]">
        <img src="/main7.gif" className="absolute top-0 left-10 w-80 rounded-xl shadow-2xl z-20 rotate-[-6deg]" />
        <img src="/main6.gif" className="absolute top-6 left-24 w-70 rounded-xl shadow-2xl z-80 rotate-[4deg]" />
        <img src="/main2.webp" className="absolute top-12 left-36 w-80 rounded-xl shadow-2xl z-60 rotate-[-3deg]" />
        <img src="/main3.webp" className="absolute top-20 left-1 w-80 rounded-xl shadow-2xl z-40 rotate-[-9deg]" />
        <img src="/main4.webp" className="absolute top-25 left-5 w-80 rounded-xl shadow-2xl z-10 rotate-[-8deg]" />
        <img src="/main5.webp" className="absolute top-10 left-28 w-80 rounded-xl shadow-2xl z-30 rotate-[-7deg]" />
        <img src="/main.webp" className="absolute top-32 left-40 w-80 rounded-xl shadow-2xl z-50 rotate-[-4deg]" />
        <img src="/main1.png" className="absolute top-8 left-20 w-100 rounded-xl shadow-2xl z-70 rotate-[-6deg]" />
      </div>
    </div>

  </div>
</section>


      <section className="py-24 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to discover great stores and share your experiences in one powerful platform
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="group border-blue-500/20 bg-gradient-to-br from-slate-800/40 to-slate-900/60 hover:from-slate-700/50 hover:to-slate-800/70 transition-all duration-300 backdrop-blur-sm transform hover:scale-105 card-glow"
              >
                <CardContent className="p-8">
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${benefit.gradient} shadow-lg pulse-glow`}
                  >
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-slate-100">{benefit.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-slate-900/50 via-slate-800/30 to-slate-900/50 py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                For Store Owners & Admins
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: BarChart3,
                    title: "Store Management",
                    desc: "Add, edit, and manage your store listings with comprehensive analytics.",
                  },
                  {
                    icon: Users,
                    title: "User Analytics",
                    desc: "Track user engagement, ratings, and platform growth with detailed insights.",
                  },
                  {
                    icon: MessageSquare,
                    title: "Review Moderation",
                    desc: "Monitor and moderate reviews to maintain quality standards across the platform.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-6 rounded-xl bg-slate-800/40 border border-blue-500/20 hover:bg-slate-700/50 hover:border-blue-400/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 pulse-glow">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg">{item.title}</h3>
                      <p className="text-slate-300">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-300 to-indigo-400 bg-clip-text text-transparent">
                For Customers & Users
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Star,
                    title: "Rate & Review",
                    desc: "Share detailed experiences with comprehensive ratings and authentic feedback.",
                  },
                  {
                    icon: MapPin,
                    title: "Discover Stores",
                    desc: "Browse and search stores by category, location, and community ratings.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Personal Dashboard",
                    desc: "Track your reviews, get personalized recommendations, and manage your profile.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-6 rounded-xl bg-slate-800/40 border border-blue-500/20 hover:bg-slate-700/50 hover:border-blue-400/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 pulse-glow">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg">{item.title}</h3>
                      <p className="text-slate-300">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-t from-slate-950 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="mb-12 text-xl text-slate-300 max-w-2xl mx-auto">
            Choose your access type and join our thriving community of reviewers and store owners today
          </p>
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-center">
            <Button
              onClick={handleAdminAccess}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-6 text-lg font-semibold rounded-xl shadow-2xl blue-glow transform hover:scale-105 transition-all duration-300"
            >
              <Shield className="mr-3 h-6 w-6" />
              Admin Access
            </Button>
            <Button
              onClick={handleUserAccess}
              variant="outline"
              size="lg"
              className="border-2 border-blue-400/50 text-blue-300 hover:bg-blue-600/20 hover:text-blue-200 hover:border-blue-300 px-10 py-6 text-lg font-semibold rounded-xl bg-slate-800/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
            >
              <Users className="mr-3 h-6 w-6" />
              User Access
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-blue-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="mb-4 text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
            StoreRate Platform
          </h3>
          <p className="text-slate-400 text-lg">Building trust through authentic reviews and community feedback</p>
          <p className="text-slate-400 text-lg">@pooja Kambale⭐</p>
        </div>
      </footer>
    </div>
  )
}
