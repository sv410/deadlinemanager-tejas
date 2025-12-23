import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// AI-powered deadline suggestions and productivity insights
export async function GET(request: Request) {
  const supabase = await createServerClient()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  const { data: deadlines, error } = await supabase.from("deadlines").select("*").eq("user_id", userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Calculate productivity metrics
  const completed = deadlines.filter((d) => d.status === "completed")
  const completionRate = deadlines.length > 0 ? (completed.length / deadlines.length) * 100 : 0

  // AI suggestions based on user patterns
  const suggestions = []

  // Check for clustering of deadlines
  const upcomingWeek = deadlines.filter((d) => {
    const due = new Date(d.due_date)
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return due >= now && due <= weekFromNow
  })

  if (upcomingWeek.length > 5) {
    suggestions.push({
      type: "warning",
      title: "Heavy Workload Ahead",
      message: `You have ${upcomingWeek.length} deadlines in the next 7 days. Consider prioritizing or delegating tasks.`,
    })
  }

  // Check for overdue tasks
  const overdue = deadlines.filter((d) => new Date(d.due_date) < new Date() && d.status !== "completed")
  if (overdue.length > 0) {
    suggestions.push({
      type: "urgent",
      title: "Overdue Tasks",
      message: `You have ${overdue.length} overdue task(s). Address these immediately to stay on track.`,
    })
  }

  // Productivity insights
  if (completionRate >= 80) {
    suggestions.push({
      type: "success",
      title: "Great Performance!",
      message: `You're completing ${completionRate.toFixed(0)}% of your deadlines. Keep up the excellent work!`,
    })
  }

  return NextResponse.json({
    suggestions,
    metrics: {
      completionRate: completionRate.toFixed(1),
      totalDeadlines: deadlines.length,
      completed: completed.length,
      overdue: overdue.length,
      upcoming: upcomingWeek.length,
    },
  })
}
