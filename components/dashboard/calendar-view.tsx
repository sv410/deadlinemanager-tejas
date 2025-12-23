"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Deadline } from "@/lib/types"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns"

interface CalendarViewProps {
  deadlines: Deadline[]
}

export function CalendarView({ deadlines }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const getDeadlinesForDay = (day: Date) => {
    return deadlines.filter((deadline) => isSameDay(new Date(deadline.deadline_date), day))
  }

  // Pad the beginning of the month
  const startDayOfWeek = monthStart.getDay()
  const paddingDays = Array(startDayOfWeek).fill(null)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}

          {/* Padding days */}
          {paddingDays.map((_, i) => (
            <div key={`padding-${i}`} className="p-2" />
          ))}

          {/* Calendar days */}
          {daysInMonth.map((day) => {
            const dayDeadlines = getDeadlinesForDay(day)
            const isCurrentDay = isToday(day)

            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 p-2 border rounded-lg ${
                  isCurrentDay ? "border-primary bg-primary/5" : "border-border"
                } ${!isSameMonth(day, currentMonth) ? "opacity-50" : ""}`}
              >
                <div className={`text-sm font-medium mb-1 ${isCurrentDay ? "text-primary" : ""}`}>
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {dayDeadlines.slice(0, 2).map((deadline) => (
                    <div
                      key={deadline.id}
                      className="text-xs p-1 rounded bg-primary/10 text-primary truncate"
                      title={deadline.title}
                    >
                      {deadline.title}
                    </div>
                  ))}
                  {dayDeadlines.length > 2 && (
                    <div className="text-xs text-muted-foreground">+{dayDeadlines.length - 2} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
