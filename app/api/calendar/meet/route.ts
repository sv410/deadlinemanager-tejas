import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getOAuth2Client } from "@/lib/google-calendar-service"
import { google } from "googleapis"

const calendar = google.calendar("v3")

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, deadlineId, title } = body

    if (!userId || !deadlineId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const auth = await getOAuth2Client(userId)
    if (!auth) {
      return NextResponse.json({ error: "Google Calendar not connected" }, { status: 400 })
    }

    // Create a Google Meet event
    const meetEvent = {
      summary: `Meeting: ${title}`,
      description: `Google Meet for deadline discussion: ${title}`,
      conferenceData: {
        createRequest: {
          requestId: `${deadlineId}-${Date.now()}`,
          conferenceSolutionKey: {
            key: "hangoutsMeet",
          },
        },
      },
      start: {
        dateTime: new Date().toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    }

    const response = await calendar.events.insert({
      auth,
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: meetEvent as any,
    })

    const meetLink = response.data.conferenceData?.entryPoints?.find(
      (entry: any) => entry.entryPointType === "video",
    )?.uri

    // Store Meet link in database
    const supabase = await createServerClient()
    await supabase.from("deadlines").update({
      meet_link: meetLink,
    }).eq("id", deadlineId)

    return NextResponse.json({
      success: true,
      meetLink,
      eventId: response.data.id,
    })
  } catch (error) {
    console.error("Failed to create Google Meet:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("user_id")
    const deadlineId = searchParams.get("deadline_id")

    if (!userId || !deadlineId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Get deadline with meet link
    const { data: deadline } = await supabase
      .from("deadlines")
      .select("meet_link")
      .eq("id", deadlineId)
      .eq("user_id", userId)
      .single()

    if (!deadline) {
      return NextResponse.json({ error: "Deadline not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      meetLink: deadline.meet_link,
    })
  } catch (error) {
    console.error("Failed to get Google Meet:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
