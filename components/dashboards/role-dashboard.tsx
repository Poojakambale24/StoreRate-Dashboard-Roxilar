"use client"

import { useAuth } from "@/contexts/auth-context"
import { AdminDashboard } from "./admin-dashboard"
import { StoreOwnerDashboard } from "./store-owner-dashboard"
import { CustomerDashboard } from "./customer-dashboard"

export function RoleDashboard() {
  const { user } = useAuth()

  if (!user) return null

  switch (user.role) {
    case "admin":
      return <AdminDashboard />
    case "store_owner":
      return <StoreOwnerDashboard />
    case "customer":
      return <CustomerDashboard />
    default:
      return <CustomerDashboard />
  }
}
