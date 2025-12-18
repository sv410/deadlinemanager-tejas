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

    const { deadlineId, webhookUrl, title, description } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json({ error: "Teams webhook URL required" }, { status: 400 })
    }

    // Send to Microsoft Teams webhook
    const teamsMessage = {
      "@type": "MessageCard",
      "@context": "https://schema.org/extensions",
      summary: title,
      themeColor: "f97316", // Orange theme
      title: "⏰ Deadline Reminder",
      sections: [
        {
          activityTitle: title,
          activitySubtitle: "DeadlineSync",
          text: description,
          facts: [
            {
              name: "Deadline ID:",
              value: deadlineId,
            },
          ],
        },
      ],
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamsMessage),
    })

    if (!response.ok) {
      throw new Error("Failed to send Teams notification")
    }

    console.log("[v0] Teams notification sent:", { deadlineId, title })

    return NextResponse.json({ success: true, message: "Teams notification sent" })
  } catch (error) {
    console.error("[v0] Error sending Teams notification:", error)
    return NextResponse.json({ error: "Failed to send Teams notification" }, { status: 500 })
  }
}
