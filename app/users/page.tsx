import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UsersList } from "@/components/users/users-list"

export default function UsersPage() {
  return (
    <div className="dark min-h-screen bg-background">
      <AuthGuard>
        <DashboardLayout>
          <UsersList />
        </DashboardLayout>
      </AuthGuard>
    </div>
  )
}
