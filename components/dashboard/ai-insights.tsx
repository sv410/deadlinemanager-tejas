"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, AlertTriangle, CheckCircle } from "lucide-react"

interface AiInsightsProps {
  userId: string
}

export function AiInsights({ userId }: AiInsightsProps) {
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      const res = await fetch(`/api/deadlines/ai-suggestions?userId=${userId}`)
      const data = await res.json()
      setInsights(data)
      setLoading(false)
    }
    fetchInsights()
  }, [userId])

  if (loading) {
    return <div className="text-gray-400">Analyzing your productivity...</div>
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return AlertTriangle
      case "urgent":
        return AlertTriangle
      case "success":
        return CheckCircle
      default:
        return Brain
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case "warning":
        return "text-yellow-500"
      case "urgent":
        return "text-red-500"
      case "success":
        return "text-green-500"
      default:
        return "text-blue-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-orange-500/20 bg-zinc-900/50 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Completion Rate</div>
            <div className="text-2xl font-bold text-white mt-1">{insights.metrics.completionRate}%</div>
          </CardContent>
        </Card>
        <Card className="border-orange-500/20 bg-zinc-900/50 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Total Deadlines</div>
            <div className="text-2xl font-bold text-white mt-1">{insights.metrics.totalDeadlines}</div>
          </CardContent>
        </Card>
        <Card className="border-orange-500/20 bg-zinc-900/50 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Completed</div>
            <div className="text-2xl font-bold text-green-500 mt-1">{insights.metrics.completed}</div>
          </CardContent>
        </Card>
        <Card className="border-orange-500/20 bg-zinc-900/50 rounded-2xl">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Upcoming</div>
            <div className="text-2xl font-bold text-orange-500 mt-1">{insights.metrics.upcoming}</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions */}
      <Card className="border-orange-500/20 bg-zinc-900/50 rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-orange-500" />
            <span className="text-white">AI Insights & Suggestions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.suggestions.map((suggestion: any, index: number) => {
            const Icon = getIcon(suggestion.type)
            return (
              <div
                key={index}
                className="p-4 bg-zinc-800/50 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${getColor(suggestion.type)}`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{suggestion.title}</h4>
                    <p className="text-sm text-gray-400">{suggestion.message}</p>
                  </div>
                  <Badge variant="outline" className={`${getColor(suggestion.type)} rounded-full`}>
                    {suggestion.type}
                  </Badge>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
