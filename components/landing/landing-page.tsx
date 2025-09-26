'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Users, Store, TrendingUp, ArrowRight, Play } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950"></div>
      
      {/* Navigation Header */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-10 mx-2 sm:mx-4 lg:mx-6 py-4 flex justify-between items-center border-b border-slate-800/50">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
            <Star className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <span className="text-lg sm:text-2xl font-bold text-white">StoreRate</span>
        </div>
        
        <div className="hidden lg:flex items-center space-x-8">
          <a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
          <a href="#stats" className="text-slate-400 hover:text-white transition-colors">Analytics</a>
          <a href="#stores" className="text-slate-400 hover:text-white transition-colors">Stores</a>
          <a href="#reviews" className="text-slate-400 hover:text-white transition-colors">Reviews</a>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button 
            variant="ghost" 
            className="hidden sm:flex text-slate-400 hover:text-white hover:bg-slate-800 text-sm sm:text-base"
            onClick={() => router.push('/auth')}
          >
            Sign In
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-6 text-sm sm:text-base"
            onClick={() => router.push('/auth')}
          >
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Start</span>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-10 mx-2 sm:mx-4 lg:mx-6 pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1.5 sm:px-4 sm:py-2 text-sm">
                  🏪 Smart Store Analytics
                </Badge>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  BOOST SALES
                  <br />
                  <span className="text-slate-400">WITH SMART</span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                    STORE RATINGS
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Transform your business with intelligent store ratings, real-time analytics, 
                  and data-driven insights that drive customer engagement.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                  onClick={() => router.push('/auth')}
                >
                  Start Rating Stores
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                  onClick={() => router.push('/stores')}
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  View Demo
                </Button>
              </div>
              
              {/* Quick Stats */} 
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white">1.2M+</div>
                  <div className="text-xs sm:text-sm text-slate-400">Store Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white">48%</div>
                  <div className="text-xs sm:text-sm text-slate-400">Rating Increase</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white">15K+</div>
                  <div className="text-xs sm:text-sm text-slate-400">Active Stores</div>
                </div>
              </div>
            </div>
            
            {/* Right Image/Visual */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-700">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/5 rounded-xl sm:rounded-2xl"></div>
                <div className="relative space-y-4 sm:space-y-6">
                  {/* Mock Interface */}
                  <div className="bg-slate-900 rounded-lg p-3 sm:p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-slate-300 font-medium text-sm sm:text-base">Store Performance</span>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">+12.4%</Badge>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
                      {[5,5,5,4,3].map((rating, i) => (
                        <div key={i} className="flex flex-shrink-0">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`h-3 w-3 sm:h-4 sm:w-4 ${j < rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-slate-900 rounded-lg p-3 sm:p-4 border border-slate-700">
                      <div className="text-slate-400 text-xs sm:text-sm">Reviews</div>
                      <div className="text-lg sm:text-2xl font-bold text-white">2.4K</div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3 sm:p-4 border border-slate-700">
                      <div className="text-slate-400 text-xs sm:text-sm">Rating</div>
                      <div className="text-lg sm:text-2xl font-bold text-white">4.8★</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Product Recommendations Section */}
      <section id="features" className="relative z-10 px-4 sm:px-6 lg:px-10 mx-2 sm:mx-4 lg:mx-6 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              SMARTER STORE
              <br />
              <span className="text-slate-400">RECOMMENDATIONS</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              Discover the best stores based on real customer reviews and intelligent matching algorithms.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 lg:mb-20">
            {/* Left Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <Card className="bg-slate-900 border-slate-700 p-3 sm:p-4 lg:p-6">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-400" />
                    </div>
                    <span className="text-green-400 text-xs sm:text-sm">↗ +48%</span>
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">48%</div>
                  <div className="text-slate-400 text-xs sm:text-sm">Rating Quality Improvement</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900 border-slate-700 p-3 sm:p-4 lg:p-6">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-violet-500/10 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-violet-400" />
                    </div>
                    <span className="text-green-400 text-xs sm:text-sm">↗ +23%</span>
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">1.5M+</div>
                  <div className="text-slate-400 text-xs sm:text-sm">Active Store Visitors</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900 border-slate-700 p-3 sm:p-4 lg:p-6">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-400" />
                    </div>
                    <span className="text-green-400 text-xs sm:text-sm">↗ +15%</span>
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">1.8M</div>
                  <div className="text-slate-400 text-xs sm:text-sm">Reviews Generated</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900 border-slate-700 p-3 sm:p-4 lg:p-6">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Store className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-400" />
                    </div>
                    <span className="text-green-400 text-xs sm:text-sm">↗ +31%</span>
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">25K+</div>
                  <div className="text-slate-400 text-xs sm:text-sm">Verified Stores</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Content */}
            <div className="space-y-6 sm:space-y-8 mt-8 lg:mt-0">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs sm:text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Smart Rating Analysis</h3>
                    <p className="text-slate-400 text-sm sm:text-base">Advanced algorithms analyze customer reviews and ratings to provide accurate store recommendations.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-violet-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs sm:text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Real-time Performance Tracking</h3>
                    <p className="text-slate-400 text-sm sm:text-base">Monitor store performance metrics and customer satisfaction in real-time with detailed analytics.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs sm:text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Personalized Recommendations</h3>
                    <p className="text-slate-400">Get personalized store suggestions based on your preferences and shopping history.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Analytics Dashboard Section */}
      <section id="analytics" className="relative z-10 px-10 mx-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  ADVANCED
                  <br />
                  <span className="text-slate-400">STORE ANALYTICS</span>
                </h2>
                <p className="text-slate-400 text-lg mb-8">
                  Get deep insights into store performance with comprehensive analytics and real-time data visualization.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-white">Real-time performance monitoring</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                  <span className="text-white">Customer sentiment analysis</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-white">Predictive analytics insights</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-white">Competitive benchmarking</span>
                </div>
              </div>
              
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                View Analytics Demo
              </Button>
            </div>
            
            {/* Right Dashboard Mockup */}
            <div className="relative">
              <Card className="bg-slate-900 border-slate-700 p-6">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Store Performance</h3>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Live</Badge>
                    </div>
                    <div className="h-32 bg-slate-800 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-purple-500/40 to-transparent"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">4.8</div>
                      <div className="text-slate-400 text-sm">Avg Rating</div>
                      <div className="flex mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">2.1K</div>
                      <div className="text-slate-400 text-sm">Reviews</div>
                      <div className="text-green-400 text-sm mt-1">↗ +12%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-10 mx-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg border-purple-500/30">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Transform Your
                <br />
                <span className="text-purple-400">Store Management?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of businesses using StoreRate to optimize their performance and increase customer satisfaction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 px-8 py-3">
                  Schedule Demo
                </Button>
              </div>
              <p className="text-slate-500 text-sm mt-6">
                No credit card required • Free 14-day trial • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-10 mx-6 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-bold text-xl">StoreRate</span>
              </div>
              <p className="text-slate-400">
                Empowering businesses with intelligent store analytics and customer insights.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Stores</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-400">&copy; 2025 StoreRate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}