import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

// Generate AI insights based on user patterns
function generateInsights(deadlines: any[], analytics: any) {
  const insights = []

  // Check for overdue deadlines
  const overdue = deadlines.filter((d: any) => new Date(d.due_date) < new Date() && !d.completed)
  if (overdue.length > 0) {
    insights.push({
      insight_type: "warning",
      title: "You have overdue deadlines",
      description: `${overdue.length} deadline(s) are past their due date. Complete them ASAP!`,
      priority: "high",
      recommendation_action: "complete-overdue",
    })
  }

  // Check for too many upcoming deadlines
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  const upcoming = deadlines.filter(
    (d: any) =>
      new Date(d.due_date) > new Date() &&
      new Date(d.due_date) <= nextWeek &&
      !d.completed
  )
  if (upcoming.length > 5) {
    insights.push({
      insight_type: "warning",
      title: "Heavy workload next week",
      description: `You have ${upcoming.length} deadlines coming up. Consider delegating or extending some.`,
      priority: "medium",
      recommendation_action: "redistribute-load",
    })
  }

  // Celebrate streaks
  if (analytics?.current_streak > 7) {
    insights.push({
      insight_type: "celebration",
      title: `🎉 ${analytics.current_streak}-day streak!`,
      description: "Keep up the amazing productivity!",
      priority: "low",
      recommendation_action: "continue-streak",
    })
  }

  // Productivity pattern recognition
  if (analytics?.peak_productivity_hour) {
    insights.push({
      insight_type: "suggestion",
      title: "Schedule important deadlines at your peak time",
      description: `Based on your patterns, you're most productive around ${analytics.peak_productivity_hour}:00. Schedule critical work then!`,
      priority: "medium",
      recommendation_action: "optimize-schedule",
    })
  }

  // Low completion rate
  if (analytics?.completion_rate < 70) {
    insights.push({
      insight_type: "recommendation",
      title: "Improve deadline completion rate",
      description: `Your completion rate is ${analytics.completion_rate}%. Try breaking large tasks into smaller steps.`,
      priority: "high",
      recommendation_action: "break-down-tasks",
    })
  }

  // Consistency recommendation
  if (!analytics?.last_activity_date) {
    insights.push({
      insight_type: "recommendation",
      title: "Start your productivity journey",
      description: "Create your first deadline to begin earning points and achievements!",
      priority: "medium",
      recommendation_action: "create-first-deadline",
    })
  }

  return insights
}

// GET - Fetch AI insights for user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user's deadlines
    const { data: deadlines } = await supabase
      .from("deadlines")
      .select("*")
      .eq("user_id", userId)

    // Get user's analytics
    const { data: analytics } = await supabase
      .from("user_gamification")
      .select("*")
      .eq("user_id", userId)
      .single()

    // Get existing insights
    const { data: existingInsights } = await supabase
      .from("ai_insights")
      .select("*")
      .eq("user_id", userId)
      .is("expires_at", null)
      .limit(5)

    // Generate new insights
    const newInsights = generateInsights(deadlines || [], analytics)

    // Store new insights
    for (const insight of newInsights) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // Expire after 7 days

      await supabase.from("ai_insights").insert({
        user_id: userId,
        ...insight,
        expires_at: expiresAt.toISOString(),
      })
    }

    return NextResponse.json({
      insights: existingInsights || [],
      generated: newInsights,
    })
  } catch (error) {
    console.error("AI insights error:", error)
    return NextResponse.json({ error: "Failed to fetch AI insights" }, { status: 500 })
  }
}

// POST - Generate timeline view with urgency grouping
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get all user deadlines
    const { data: deadlines } = await supabase
      .from("deadlines")
      .select("*")
      .eq("user_id", userId)
      .order("due_date", { ascending: true })

    if (!deadlines) {
      return NextResponse.json({ timeline: {} })
    }

    // Group by urgency
    const now = new Date()
    const timeline = {
      critical: [] as any[],
      urgent: [] as any[],
      upcoming: [] as any[],
      later: [] as any[],
      completed: [] as any[],
    }

    deadlines.forEach((deadline: any) => {
      const dueDate = new Date(deadline.due_date)
      const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      let category = "later"
      if (deadline.completed) {
        category = "completed"
      } else if (daysUntil <= 0) {
        category = "critical"
      } else if (daysUntil <= 3) {
        category = "urgent"
      } else if (daysUntil <= 7) {
        category = "upcoming"
      }

      timeline[category as keyof typeof timeline].push({
        ...deadline,
        daysUntil,
        urgencyScore: Math.max(0, Math.min(100, 100 - daysUntil * 5)),
      })
    })

    // Update timeline metadata for each deadline
    for (const deadline of deadlines) {
      const dueDate = new Date(deadline.due_date)
      const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const urgencyScore = Math.max(0, Math.min(100, 100 - daysUntil * 5))

      await supabase.from("deadline_timeline_metadata").upsert({
        deadline_id: deadline.id,
        urgency_score: urgencyScore,
        ai_risk_level: urgencyScore > 70 ? "high" : urgencyScore > 40 ? "medium" : "low",
        ai_suggestion: generateDeadlineInsight(deadline, urgencyScore),
      })
    }

    return NextResponse.json({
      timeline,
      summary: {
        total: deadlines.length,
        completed: timeline.completed.length,
        pending: deadlines.length - timeline.completed.length,
        overdue: timeline.critical.length,
      },
    })
  } catch (error) {
    console.error("Timeline generation error:", error)
    return NextResponse.json({ error: "Failed to generate timeline" }, { status: 500 })
  }
}

function generateDeadlineInsight(deadline: any, urgencyScore: number) {
  const daysLeft = Math.ceil(
    (new Date(deadline.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysLeft <= 0) {
    return "⚠️ OVERDUE: Complete immediately to maintain your streak!"
  } else if (daysLeft === 1) {
    return "⏰ Due tomorrow! Start working on this now."
  } else if (daysLeft <= 3) {
    return "🔥 High urgency! Break this down into smaller tasks."
  } else if (daysLeft <= 7) {
    return "📌 Schedule time this week to complete this."
  } else {
    return "✅ Plenty of time! Consider breaking it into smaller milestones."
  }
}
