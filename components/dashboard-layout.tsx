"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart3, Store, Users, Star, Menu, X, Home, MessageSquare, LogOut, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const getNavigation = () => {
    const baseNavigation = [
      { name: "Dashboard", icon: Home, href: "/dashboard", roles: ["admin", "store_owner", "customer"] },
      { name: "Stores", icon: Store, href: "/stores", roles: ["admin", "store_owner", "customer"] },
      { name: "Reviews", icon: MessageSquare, href: "/reviews", roles: ["admin", "store_owner", "customer"] },
    ]

    const adminNavigation = [
      { name: "Users", icon: Users, href: "/users", roles: ["admin"] },
      { name: "Analytics", icon: BarChart3, href: "/analytics", roles: ["admin"] },
      { name: "Admin Panel", icon: Shield, href: "/admin", roles: ["admin"] },
    ]

    const allNavigation = [...baseNavigation, ...adminNavigation]

    return allNavigation.filter((item) => item.roles.includes(user?.role || "customer"))
  }

  const navigation = getNavigation()

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <Link href="/" className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-sidebar-primary" />
              <span className="text-xl font-bold text-sidebar-foreground">StoreRate</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left",
                      isActive
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-sidebar-foreground hover:bg-blue-50 hover:text-blue-600",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center">
                  <span className="text-sm font-medium text-sidebar-primary-foreground">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role.replace("_", " ")}</p>
                </div>
              </div>
              {/* Logout button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-sidebar-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 sm:h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden text-foreground p-1 sm:p-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            {/* Mobile page title */}
            <h1 className="lg:hidden text-lg sm:text-xl font-semibold text-foreground">
              {pathname === '/dashboard' ? 'Dashboard' : 
               pathname === '/stores' ? 'Stores' : 
               pathname === '/reviews' ? 'Reviews' : 
               pathname === '/users' ? 'Users' : 
               pathname === '/analytics' ? 'Analytics' : 
               pathname === '/admin' ? 'Admin Panel' : 'StoreRate'}
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex text-xs sm:text-sm px-2 sm:px-3"
              onClick={() => {
                // Mock export functionality
                const data = {
                  exportedAt: new Date().toISOString(),
                  userRole: user?.role,
                  message: "Data export functionality would be implemented here",
                }
                console.log("[v0] Export data:", data)
                alert("Export functionality would download data here")
              }}
            >
              <span className="hidden sm:inline">Export Data</span>
              <span className="sm:hidden">Export</span>
            </Button>
            {(user?.role === "admin" || user?.role === "store_owner") && (
              <Link href="/stores">
                <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                  <span className="hidden sm:inline">Add Store</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
