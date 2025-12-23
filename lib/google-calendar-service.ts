import { google } from "googleapis"
import { createServerClient } from "@/lib/supabase/server"
import { OAuth2Client } from "google-auth-library"

const calendar = google.calendar("v3")

export async function getOAuth2Client(userId: string): Promise<OAuth2Client | null> {
  const supabase = await createServerClient()

  const { data: tokenData, error } = await supabase
    .from("google_tokens")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", userId)
    .single()

  if (error || !tokenData) {
    return null
  }

  const oauth2Client = new OAuth2Client(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
  )

  oauth2Client.setCredentials({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expiry_date: tokenData.expires_at ? new Date(tokenData.expires_at).getTime() : undefined,
  })

  return oauth2Client
}

export interface CalendarEventData {
  title: string
  description?: string
  startTime: Date
  endTime: Date
  location?: string
}

export async function createCalendarEvent(userId: string, eventData: CalendarEventData) {
  try {
    const auth = await getOAuth2Client(userId)
    if (!auth) {
      return { success: false, error: "Google Calendar not connected" }
    }

    const event = {
      summary: eventData.title,
      description: eventData.description || "",
      location: eventData.location,
      start: {
        dateTime: eventData.startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: eventData.endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 1 day before
          { method: "notification", minutes: 60 }, // 1 hour before
          { method: "notification", minutes: 15 }, // 15 minutes before
        ],
      },
    }

    const response = await calendar.events.insert({
      auth,
      calendarId: "primary",
      requestBody: event as any,
    })

    return {
      success: true,
      eventId: response.data.id,
      event: response.data,
    }
  } catch (error) {
    console.error("Failed to create calendar event:", error)
    return { success: false, error: String(error) }
  }
}

export async function updateCalendarEvent(
  userId: string,
  eventId: string,
  eventData: Partial<CalendarEventData>,
) {
  try {
    const auth = await getOAuth2Client(userId)
    if (!auth) {
      return { success: false, error: "Google Calendar not connected" }
    }

    const event: any = {}
    if (eventData.title) event.summary = eventData.title
    if (eventData.description) event.description = eventData.description
    if (eventData.location) event.location = eventData.location
    if (eventData.startTime) {
      event.start = {
        dateTime: eventData.startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
    }
    if (eventData.endTime) {
      event.end = {
        dateTime: eventData.endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
    }

    const response = await calendar.events.update({
      auth,
      calendarId: "primary",
      eventId,
      requestBody: event,
    })

    return { success: true, event: response.data }
  } catch (error) {
    console.error("Failed to update calendar event:", error)
    return { success: false, error: String(error) }
  }
}

export async function deleteCalendarEvent(userId: string, eventId: string) {
  try {
    const auth = await getOAuth2Client(userId)
    if (!auth) {
      return { success: false, error: "Google Calendar not connected" }
    }

    await calendar.events.delete({
      auth,
      calendarId: "primary",
      eventId,
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to delete calendar event:", error)
    return { success: false, error: String(error) }
  }
}

export async function getCalendarEvents(userId: string, timeMin?: Date, timeMax?: Date) {
  try {
    const auth = await getOAuth2Client(userId)
    if (!auth) {
      return { success: false, error: "Google Calendar not connected", events: [] }
    }

    const response = await calendar.events.list({
      auth,
      calendarId: "primary",
      timeMin: timeMin?.toISOString() || new Date().toISOString(),
      timeMax: timeMax?.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    })

    return { success: true, events: response.data.items || [] }
  } catch (error) {
    console.error("Failed to get calendar events:", error)
    return { success: false, error: String(error), events: [] }
  }
}

export async function syncDeadlineToCalendar(userId: string, deadline: any) {
  try {
    const supabase = await createServerClient()

    // Check if already synced
    const { data: existingSync } = await supabase
      .from("google_calendar_events")
      .select("google_event_id")
      .eq("deadline_id", deadline.id)
      .eq("user_id", userId)
      .single()

    const startTime = new Date(deadline.due_date)
    // Set end time 30 minutes after start time
    const endTime = new Date(startTime.getTime() + 30 * 60000)

    if (existingSync?.google_event_id) {
      // Update existing event
      const result = await updateCalendarEvent(userId, existingSync.google_event_id, {
        title: deadline.title,
        description: deadline.description,
        startTime,
        endTime,
      })

      return result
    } else {
      // Create new event
      const result = await createCalendarEvent(userId, {
        title: deadline.title,
        description: deadline.description,
        startTime,
        endTime,
      })

      if (result.success && result.eventId) {
        // Store sync record
        await supabase.from("google_calendar_events").insert({
          user_id: userId,
          deadline_id: deadline.id,
          google_event_id: result.eventId,
        })
      }

      return result
    }
  } catch (error) {
    console.error("Failed to sync deadline to calendar:", error)
    return { success: false, error: String(error) }
  }
}

export async function removeDeadlineFromCalendar(userId: string, deadlineId: string) {
  try {
    const supabase = await createServerClient()

    const { data: sync } = await supabase
      .from("google_calendar_events")
      .select("google_event_id")
      .eq("deadline_id", deadlineId)
      .eq("user_id", userId)
      .single()

    if (sync?.google_event_id) {
      const result = await deleteCalendarEvent(userId, sync.google_event_id)

      if (result.success) {
        await supabase
          .from("google_calendar_events")
          .delete()
          .eq("deadline_id", deadlineId)
          .eq("user_id", userId)
      }

      return result
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to remove deadline from calendar:", error)
    return { success: false, error: String(error) }
  }
}
