import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StoreList } from "@/components/stores/store-list"

export default function StoresPage() {
  return (
    <div className="dark min-h-screen bg-background">
      <AuthGuard>
        <DashboardLayout>
          <StoreList />
        </DashboardLayout>
      </AuthGuard>
    </div>
  )
}
