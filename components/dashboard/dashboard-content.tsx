"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "./dashboard-header"
import { DeadlineList } from "./deadline-list"
import { DeadlineStats } from "./deadline-stats"
import { AddDeadlineDialog } from "./add-deadline-dialog"
import { CalendarView } from "./calendar-view"
import type { Deadline, Profile } from "@/lib/types"
import type { User } from "@supabase/supabase-js"
import { LayoutDashboard, Calendar, BarChart3 } from "lucide-react"

type ViewMode = "list" | "calendar" | "analytics"

interface DashboardContentProps {
  user: User
  profile: Profile | null
  initialDeadlines: Deadline[]
}

export function DashboardContent({ user, profile, initialDeadlines }: DashboardContentProps) {
  const [deadlines, setDeadlines] = useState<Deadline[]>(initialDeadlines)
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  const handleDeadlineAdded = (newDeadline: Deadline) => {
    setDeadlines([...deadlines, newDeadline])
  }

  const handleDeadlineUpdated = (updatedDeadline: Deadline) => {
    setDeadlines(deadlines.map((d) => (d.id === updatedDeadline.id ? updatedDeadline : d)))
  }

  const handleDeadlineDeleted = (deletedId: string) => {
    setDeadlines(deadlines.filter((d) => d.id !== deletedId))
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* View Mode Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                List
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
              <Button
                variant={viewMode === "analytics" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("analytics")}
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
            </div>
            <AddDeadlineDialog userId={user.id} onDeadlineAdded={handleDeadlineAdded} />
          </div>

          {/* Content Based on View Mode */}
          {viewMode === "list" && (
            <DeadlineList
              deadlines={deadlines}
              onDeadlineUpdated={handleDeadlineUpdated}
              onDeadlineDeleted={handleDeadlineDeleted}
            />
          )}

          {viewMode === "calendar" && <CalendarView deadlines={deadlines} />}

          {viewMode === "analytics" && <DeadlineStats deadlines={deadlines} />}
        </div>
      </div>
    </div>
  )
}
