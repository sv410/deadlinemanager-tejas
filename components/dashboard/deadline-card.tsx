"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { Clock, MoreVertical, CheckCircle2, Trash2, Calendar } from "lucide-react"
import type { Deadline, Priority } from "@/lib/types"
import { formatDistanceToNow, format } from "date-fns"

interface DeadlineCardProps {
  deadline: Deadline
  onUpdate: (deadline: Deadline) => void
  onDelete: (id: string) => void
}

const priorityColors: Record<Priority, string> = {
  low: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  urgent: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
}

export function DeadlineCard({ deadline, onUpdate, onDelete }: DeadlineCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const deadlineDate = new Date(deadline.deadline_date)
  const isOverdue = deadlineDate < new Date() && deadline.status !== "completed"
  const isCompleted = deadline.status === "completed"

  const handleToggleComplete = async () => {
    setIsLoading(true)
    try {
      const newStatus = isCompleted ? "pending" : "completed"
      const { data, error } = await supabase
        .from("deadlines")
        .update({
          status: newStatus,
          completed_at: newStatus === "completed" ? new Date().toISOString() : null,
        })
        .eq("id", deadline.id)
        .select()
        .single()

      if (error) throw error
      onUpdate(data)
    } catch (error) {
      console.error("[v0] Failed to update deadline:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this deadline?")) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from("deadlines").delete().eq("id", deadline.id)

      if (error) throw error
      onDelete(deadline.id)
    } catch (error) {
      console.error("[v0] Failed to delete deadline:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card
      className={`transition-all hover:shadow-md ${isOverdue ? "border-destructive" : ""} ${isCompleted ? "opacity-60" : ""}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleComplete}
            disabled={isLoading}
            className={`shrink-0 ${isCompleted ? "text-primary" : "text-muted-foreground"}`}
          >
            <CheckCircle2 className={`h-6 w-6 ${isCompleted ? "fill-primary" : ""}`} />
          </Button>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className={`font-semibold text-lg mb-1 ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                {deadline.title}
              </h3>
              {deadline.description && <p className="text-sm text-muted-foreground">{deadline.description}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={priorityColors[deadline.priority]}>
                {deadline.priority.charAt(0).toUpperCase() + deadline.priority.slice(1)}
              </Badge>
              <Badge variant="outline">{deadline.category}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{format(deadlineDate, "MMM d, yyyy h:mm a")}</span>
              </div>
              {!isCompleted && (
                <div
                  className={`flex items-center gap-1 text-sm ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {isOverdue ? "Overdue by " : ""}
                    {formatDistanceToNow(deadlineDate, { addSuffix: !isOverdue })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isLoading}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
