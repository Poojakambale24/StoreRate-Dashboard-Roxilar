import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ReviewsList } from "@/components/reviews/reviews-list"

export default function ReviewsPage() {
  return (
    <div className="dark min-h-screen bg-background">
      <AuthGuard>
        <DashboardLayout>
          <ReviewsList />
        </DashboardLayout>
      </AuthGuard>
    </div>
  )
}
