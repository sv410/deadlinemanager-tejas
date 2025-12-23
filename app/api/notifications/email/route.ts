import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { sendDeadlineCreatedNotification } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { deadlineId, email, subject, message } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    // Fetch deadline details for richer email content
    const { data: deadline } = await supabase.from("deadlines").select("*").eq("id", deadlineId).single()

    if (deadline) {
      await sendDeadlineCreatedNotification({
        userId: deadline.user_id,
        deadlineId,
        email,
        deadlineTitle: deadline.title || subject || "New Deadline",
        dueDate: new Date(deadline.deadline_date),
        description: message || deadline.description || undefined,
      })
    }

    return NextResponse.json({ success: true, message: "Email notification sent" })
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email notification" }, { status: 500 })
  }
}
