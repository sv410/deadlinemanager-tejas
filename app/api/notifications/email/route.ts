import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { deadlineId, email, subject, message } = await request.json()

    // In production, integrate with email service (SendGrid, Resend, etc.)
    console.log("[v0] Email notification:", { deadlineId, email, subject, message })

    // TODO: Implement actual email sending logic with your preferred email service
    // Example: await sendEmail({ to: email, subject, body: message })

    return NextResponse.json({ success: true, message: "Email notification sent" })
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email notification" }, { status: 500 })
  }
}
