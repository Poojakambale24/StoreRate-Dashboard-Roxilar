"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", ratings: 4.1 },
  { month: "Feb", ratings: 4.2 },
  { month: "Mar", ratings: 4.0 },
  { month: "Apr", ratings: 4.3 },
  { month: "May", ratings: 4.2 },
  { month: "Jun", ratings: 4.4 },
  { month: "Jul", ratings: 4.2 },
]

const chartConfig = {
  ratings: {
    label: "Average Rating",
    color: "hsl(var(--chart-1))",
  },
}

export function RatingsChart() {
  return (
    <Card className="bg-card border-border w-full h-full">
      <CardHeader>
        <CardTitle className="text-card-foreground">Average Ratings Trend</CardTitle>
      </CardHeader>
      <CardContent className="w-full overflow-hidden flex-1">
        <ChartContainer config={chartConfig} className="h-[350px] w-full max-w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRatings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                domain={[3.5, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="ratings"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorRatings)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
