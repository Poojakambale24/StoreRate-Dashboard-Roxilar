import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Users, Star, MessageSquare, TrendingUp, TrendingDown } from "lucide-react"

export function MetricsCards() {
  const metrics = [
    {
      title: "Total Stores",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Store,
      color: "text-chart-1",
    },
    {
      title: "Active Users",
      value: "8,432",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "text-chart-2",
    },
    {
      title: "Average Rating",
      value: "4.2",
      change: "+0.3",
      trend: "up",
      icon: Star,
      color: "text-chart-3",
    },
    {
      title: "Total Reviews",
      value: "15,678",
      change: "-2%",
      trend: "down",
      icon: MessageSquare,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
            <metric.icon className={`h-5 w-5 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{metric.value}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {metric.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-chart-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-chart-4 mr-1" />
              )}
              <span className={metric.trend === "up" ? "text-chart-3" : "text-chart-4"}>{metric.change}</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
