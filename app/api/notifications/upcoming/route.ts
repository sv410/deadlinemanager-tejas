import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// This endpoint should be called by a cron job to check for upcoming deadlines
export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Get all pending deadlines that are due within 24 hours
    const tomorrow = new Date()
    tomorrow.setHours(tomorrow.getHours() + 24)

    const { data: upcomingDeadlines, error } = await supabase
      .from("deadlines")
      .select("*, profiles(*)")
      .eq("status", "pending")
      .lt("deadline_date", tomorrow.toISOString())
      .gt("deadline_date", new Date().toISOString())

    if (error) {
      console.error("[v0] Get upcoming deadlines error:", error)
      return NextResponse.json({ error: "Failed to fetch deadlines" }, { status: 500 })
    }

    // Send notifications for each upcoming deadline
    const notifications = await Promise.all(
      upcomingDeadlines.map(async (deadline) => {
        return fetch(`${request.headers.get("origin")}/api/notifications/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: deadline.user_id,
            deadlineId: deadline.id,
            type: "upcoming",
          }),
        })
      }),
    )

    return NextResponse.json(
      {
        success: true,
        processed: upcomingDeadlines.length,
        message: `Processed ${upcomingDeadlines.length} upcoming deadlines`,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Upcoming deadlines cron error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
