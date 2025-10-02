import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { RoleDashboard } from "@/components/dashboards/role-dashboard"

export default function Dashboard() {
  return (
    <div className="dark min-h-screen bg-background">
      <AuthGuard>
        <DashboardLayout>
          <RoleDashboard />
        </DashboardLayout>
      </AuthGuard>
    </div>
  )
}
