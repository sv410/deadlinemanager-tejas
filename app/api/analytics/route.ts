import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

// GET - Fetch productivity analytics
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")
    const days = parseInt(request.nextUrl.searchParams.get("days") || "30")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get analytics for the period
    const { data: analytics, error } = await supabase
      .from("productivity_analytics")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDate.toISOString().split("T")[0])
      .lte("date", endDate.toISOString().split("T")[0])
      .order("date", { ascending: true })

    if (error) throw error

    // Calculate summary
    const summary = {
      totalCreated: 0,
      totalCompleted: 0,
      totalMissed: 0,
      avgCompletionRate: 0,
      bestDay: null as any,
      worstDay: null as any,
      peakHour: null as number | null,
      averageFocusScore: 0,
      totalWorkMinutes: 0,
    }

    if (analytics && analytics.length > 0) {
      summary.totalCreated = analytics.reduce((sum, a) => sum + (a.deadlines_created || 0), 0)
      summary.totalCompleted = analytics.reduce((sum, a) => sum + (a.deadlines_completed || 0), 0)
      summary.totalMissed = analytics.reduce((sum, a) => sum + (a.deadlines_missed || 0), 0)
      summary.avgCompletionRate =
        analytics.reduce((sum, a) => sum + (a.completion_rate || 0), 0) / analytics.length
      summary.averageFocusScore =
        analytics.reduce((sum, a) => sum + (a.focus_score || 0), 0) / analytics.length
      summary.totalWorkMinutes = analytics.reduce((sum, a) => sum + (a.total_work_minutes || 0), 0)

      // Find peak hour
      const hourCounts = new Map<number, number>()
      analytics.forEach((a) => {
        if (a.peak_productivity_hour) {
          hourCounts.set(a.peak_productivity_hour, (hourCounts.get(a.peak_productivity_hour) || 0) + 1)
        }
      })
      if (hourCounts.size > 0) {
        summary.peakHour = [...hourCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]
      }

      // Find best and worst days
      summary.bestDay = analytics.reduce((best, current) =>
        (current.completion_rate || 0) > (best?.completion_rate || 0) ? current : best
      )
      summary.worstDay = analytics.reduce((worst, current) =>
        (current.completion_rate || 0) < (worst?.completion_rate || 0) ? current : worst
      )
    }

    return NextResponse.json({
      analytics: analytics || [],
      summary,
      period: { days, startDate: startDate.toISOString().split("T")[0], endDate: endDate.toISOString().split("T")[0] },
    })
  } catch (error) {
    console.error("Analytics GET error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

// POST - Log daily productivity data
export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      deadlinesCreated = 0,
      deadlinesCompleted = 0,
      deadlinesMissed = 0,
      peakHour = null,
      totalWorkMinutes = 0,
      focusScore = 0,
    } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const today = new Date().toISOString().split("T")[0]
    const completionRate =
      deadlinesCreated > 0
        ? Math.round((deadlinesCompleted / (deadlinesCreated + deadlinesMissed)) * 100 * 100) / 100
        : 0

    // Calculate focus score (0-100)
    const calculatedFocusScore = Math.min(
      100,
      Math.max(0, completionRate * 0.7 + (totalWorkMinutes / 480) * 30)
    )

    const { data, error } = await supabase
      .from("productivity_analytics")
      .upsert({
        user_id: userId,
        date: today,
        deadlines_created: deadlinesCreated,
        deadlines_completed: deadlinesCompleted,
        deadlines_missed: deadlinesMissed,
        completion_rate: completionRate,
        peak_productivity_hour: peakHour,
        total_work_minutes: totalWorkMinutes,
        focus_score: focusScore || calculatedFocusScore,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // Award points for good focus score
    if ((focusScore || calculatedFocusScore) >= 70) {
      const points = Math.floor((focusScore || calculatedFocusScore) / 10) * 10
      await supabase.from("user_activity_log").insert({
        user_id: userId,
        activity_type: "productivity_bonus",
        points_earned: points,
        description: `${points} points for ${focusScore || calculatedFocusScore}/100 focus score!`,
      })

      // Update gamification
      const { data: current } = await supabase
        .from("user_gamification")
        .select("total_points")
        .eq("user_id", userId)
        .single()

      await supabase
        .from("user_gamification")
        .update({
          total_points: (current?.total_points || 0) + points,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
    }

    return NextResponse.json({
      success: true,
      analytics: data,
      pointsEarned: (focusScore || calculatedFocusScore) >= 70 ? Math.floor((focusScore || calculatedFocusScore) / 10) * 10 : 0,
    })
  } catch (error) {
    console.error("Analytics POST error:", error)
    return NextResponse.json({ error: "Failed to log analytics" }, { status: 500 })
  }
}

// PUT - Update analytics
export async function PUT(request: NextRequest) {
  try {
    const { analyticsId, ...updates } = await request.json()

    if (!analyticsId) {
      return NextResponse.json({ error: "Analytics ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("productivity_analytics")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", analyticsId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics PUT error:", error)
    return NextResponse.json({ error: "Failed to update analytics" }, { status: 500 })
  }
}
