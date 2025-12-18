"use client"

import { DeadlineCard } from "./deadline-card"
import type { Deadline } from "@/lib/types"
import { CalendarX } from "lucide-react"

interface DeadlineListProps {
  deadlines: Deadline[]
  onDeadlineUpdated: (deadline: Deadline) => void
  onDeadlineDeleted: (id: string) => void
}

export function DeadlineList({ deadlines, onDeadlineUpdated, onDeadlineDeleted }: DeadlineListProps) {
  const now = new Date()

  const upcomingDeadlines = deadlines.filter((d) => {
    const deadlineDate = new Date(d.deadline_date)
    return deadlineDate > now && d.status !== "completed"
  })

  const overdueDeadlines = deadlines.filter((d) => {
    const deadlineDate = new Date(d.deadline_date)
    return deadlineDate <= now && d.status !== "completed"
  })

  const completedDeadlines = deadlines.filter((d) => d.status === "completed")

  return (
    <div className="space-y-8">
      {/* Overdue Section */}
      {overdueDeadlines.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-destructive">Overdue ({overdueDeadlines.length})</h2>
          <div className="grid gap-4">
            {overdueDeadlines.map((deadline) => (
              <DeadlineCard
                key={deadline.id}
                deadline={deadline}
                onUpdate={onDeadlineUpdated}
                onDelete={onDeadlineDeleted}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Section */}
      {upcomingDeadlines.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Upcoming ({upcomingDeadlines.length})</h2>
          <div className="grid gap-4">
            {upcomingDeadlines.map((deadline) => (
              <DeadlineCard
                key={deadline.id}
                deadline={deadline}
                onUpdate={onDeadlineUpdated}
                onDelete={onDeadlineDeleted}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Section */}
      {completedDeadlines.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Completed ({completedDeadlines.length})</h2>
          <div className="grid gap-4">
            {completedDeadlines.map((deadline) => (
              <DeadlineCard
                key={deadline.id}
                deadline={deadline}
                onUpdate={onDeadlineUpdated}
                onDelete={onDeadlineDeleted}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {deadlines.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <CalendarX className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No deadlines yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Get started by adding your first deadline. Click the "Add Deadline" button above.
          </p>
        </div>
      )}
    </div>
  )
}
