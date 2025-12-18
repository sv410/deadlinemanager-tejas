"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Deadline } from "@/lib/types"
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react"

interface DeadlineStatsProps {
  deadlines: Deadline[]
}

export function DeadlineStats({ deadlines }: DeadlineStatsProps) {
  const now = new Date()

  const completed = deadlines.filter((d) => d.status === "completed").length
  const overdue = deadlines.filter((d) => {
    const deadlineDate = new Date(d.deadline_date)
    return deadlineDate < now && d.status !== "completed"
  }).length
  const upcoming = deadlines.filter((d) => {
    const deadlineDate = new Date(d.deadline_date)
    return deadlineDate > now && d.status !== "completed"
  }).length
  const total = deadlines.length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const categoryCounts = deadlines.reduce(
    (acc, d) => {
      acc[d.category] = (acc[d.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const priorityCounts = deadlines.reduce(
    (acc, d) => {
      if (d.status !== "completed") {
        acc[d.priority] = (acc[d.priority] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completed}</div>
            <p className="text-xs text-muted-foreground mt-1">{completionRate}% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcoming}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdue}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Deadlines by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(categoryCounts).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{category}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(count / total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Active by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(priorityCounts).length > 0 ? (
              <div className="space-y-4">
                {(["urgent", "high", "medium", "low"] as const).map((priority) => {
                  const count = priorityCounts[priority] || 0
                  if (count === 0) return null
                  return (
                    <div key={priority} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{priority}</span>
                      <span className="text-2xl font-bold">{count}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active deadlines</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
