import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, Store, User } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "review",
      user: "Sarah Johnson",
      store: "Pizza Palace",
      rating: 5,
      time: "2 minutes ago",
      icon: MessageSquare,
    },
    {
      id: 2,
      type: "store",
      user: "Mike Chen",
      store: "Tech Repair Shop",
      action: "registered",
      time: "15 minutes ago",
      icon: Store,
    },
    {
      id: 3,
      type: "review",
      user: "Emma Davis",
      store: "Coffee Corner",
      rating: 4,
      time: "1 hour ago",
      icon: MessageSquare,
    },
    {
      id: 4,
      type: "user",
      user: "Alex Rodriguez",
      action: "joined",
      time: "2 hours ago",
      icon: User,
    },
    {
      id: 5,
      type: "review",
      user: "Lisa Wang",
      store: "Book Haven",
      rating: 5,
      time: "3 hours ago",
      icon: MessageSquare,
    },
  ]

  return (
    <Card className="bg-card border-border w-full h-full">
      <CardHeader>
        <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="w-full flex-1 overflow-auto">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="flex-shrink-0">
                <activity.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-card-foreground">{activity.user}</span>
                  {activity.type === "review" && activity.rating && (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-muted-foreground">rated</span>
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {activity.rating}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.type === "review" && `Reviewed ${activity.store}`}
                  {activity.type === "store" && `${activity.action} ${activity.store}`}
                  {activity.type === "user" && `${activity.action} the platform`}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
