import { NextResponse, NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendBulkReminders } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { userId, deadlineId, type, action } = body

    // Handle bulk reminder sending
    if (action === "send-reminders") {
      const result = await sendBulkReminders()
      return NextResponse.json(result)
    }

    if (!userId || !deadlineId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user profile and deadline details
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

    const { data: deadline } = await supabase.from("deadlines").select("*").eq("id", deadlineId).single()

    if (!profile || !deadline) {
      return NextResponse.json({ error: "User or deadline not found" }, { status: 404 })
    }

    // Store notification in database
    const { data: notification, error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        deadline_id: deadlineId,
        type,
        title: `Deadline ${type}: ${deadline.title}`,
        message: `Your deadline "${deadline.title}" is ${type === "created" ? "created" : type === "upcoming" ? "coming up soon" : type === "overdue" ? "overdue" : "updated"}`,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (notificationError) {
      console.error("[v0] Notification creation error:", notificationError)
    }

    // Send email notification if user has notifications enabled
    if (profile.email_notifications_enabled) {
      await fetch(`${request.headers.get("origin")}/api/notifications/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deadlineId,
          email: profile.email,
          subject: `DeadlineSync: ${deadline.title}`,
          message: `Your deadline "${deadline.title}" is ${type === "upcoming" ? "coming up" : type}. Due: ${new Date(deadline.deadline_date).toLocaleString()}`,
        }),
      })
    }

    // Send Teams notification if enabled
    if (profile.teams_notifications_enabled && profile.teams_webhook_url) {
      await fetch(`${request.headers.get("origin")}/api/notifications/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: profile.teams_webhook_url,
          title: deadline.title,
          deadline: deadline.deadline_date,
          priority: deadline.priority,
          type,
        }),
      })
    }

    // Sync to Google Calendar
    await fetch(`${request.headers.get("origin")}/api/calendar/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deadlineId,
        calendarType: "google",
      }),
    })

    return NextResponse.json({ success: true, notification }, { status: 200 })
  } catch (error) {
    console.error("[v0] Send notification server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Webhook for scheduled reminder checks (can be called by a cron job service)
export async function GET(request: NextRequest) {
  try {
    // Simple cron job handler - can be secured with API key
    const apiKey = request.nextUrl.searchParams.get("api_key")

    if (apiKey !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await sendBulkReminders()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Scheduled reminder error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
