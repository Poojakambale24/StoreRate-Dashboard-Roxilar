import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdminPanel } from "@/components/admin/admin-panel"

export default function AdminPage() {
  return (
    <div className="dark min-h-screen bg-background">
      <AuthGuard>
        <DashboardLayout>
          <AdminPanel />
        </DashboardLayout>
      </AuthGuard>
    </div>
  )
}
