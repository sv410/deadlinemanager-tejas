"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Zap, AlertCircle } from "lucide-react"
import type { Deadline } from "@/lib/types"

interface TimelineViewProps {
  userId: string
}

export function TimelineView({ userId }: TimelineViewProps) {
  const [timeline, setTimeline] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTimeline = async () => {
      const res = await fetch(`/api/deadlines/timeline?userId=${userId}`)
      const data = await res.json()
      setTimeline(data.timeline)
      setLoading(false)
    }
    fetchTimeline()
  }, [userId])

  if (loading) {
    return <div className="text-gray-400">Loading timeline...</div>
  }

  const sections = [
    { key: "overdue", title: "Overdue", icon: AlertCircle, color: "text-red-500", bgColor: "bg-red-500/10" },
    { key: "today", title: "Due Today", icon: Zap, color: "text-orange-500", bgColor: "bg-orange-500/10" },
    { key: "thisWeek", title: "This Week", icon: Calendar, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { key: "upcoming", title: "Upcoming", icon: Clock, color: "text-gray-400", bgColor: "bg-gray-500/10" },
  ]

  return (
    <div className="space-y-6">
      {sections.map(
        (section) =>
          timeline[section.key]?.length > 0 && (
            <Card key={section.key} className="border-orange-500/20 bg-zinc-900/50 rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${section.bgColor}`}>
                    <section.icon className={`h-5 w-5 ${section.color}`} />
                  </div>
                  <span className="text-white">{section.title}</span>
                  <Badge variant="secondary" className="ml-auto rounded-full">
                    {timeline[section.key].length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeline[section.key].map((deadline: Deadline) => (
                    <div
                      key={deadline.id}
                      className="p-4 bg-zinc-800/50 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{deadline.title}</h4>
                          <p className="text-sm text-gray-400">{deadline.description}</p>
                        </div>
                        <Badge
                          variant={deadline.priority === "high" ? "destructive" : "secondary"}
                          className="rounded-full"
                        >
                          {deadline.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ),
      )}
    </div>
  )
}
