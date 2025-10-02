import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <div className="dark min-h-screen bg-background">
      <AuthGuard>
        <DashboardLayout>
          <AnalyticsDashboard />
        </DashboardLayout>
      </AuthGuard>
    </div>
  )
}
