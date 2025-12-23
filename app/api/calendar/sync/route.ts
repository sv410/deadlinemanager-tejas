import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { syncDeadlineToCalendar } from "@/lib/google-calendar-service"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { deadlineId, calendarType = "google" } = await request.json()

    const { data: deadline } = await supabase.from("deadlines").select("*").eq("id", deadlineId).single()
    if (!deadline) {
      return NextResponse.json({ error: "Deadline not found" }, { status: 404 })
    }

    if (calendarType !== "google") {
      return NextResponse.json({ error: "Only Google Calendar supported currently" }, { status: 400 })
    }

    const result = await syncDeadlineToCalendar(deadline.user_id, {
      ...deadline,
      due_date: deadline.deadline_date,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to sync to calendar" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Deadline synced to Google Calendar",
      eventId: result.eventId,
    })
  } catch (error) {
    console.error("[v0] Error syncing to calendar:", error)
    return NextResponse.json({ error: "Failed to sync to calendar" }, { status: 500 })
  }
}
