import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { syncDeadlineToCalendar } from "@/lib/google-calendar-service"
import { sendDeadlineCreatedNotification } from "@/lib/email-service"

// Create new deadline
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, deadline_date, priority, category } = body

    if (!title || !deadline_date || !priority || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create deadline
    const { data, error } = await supabase
      .from("deadlines")
      .insert({
        user_id: user.id,
        title,
        description,
        deadline_date,
        priority,
        category,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Create deadline error:", error)
      return NextResponse.json({ error: "Failed to create deadline" }, { status: 500 })
    }

    // Sync to Google Calendar if deadline created
    if (data) {
      await syncDeadlineToCalendar(user.id, {
        ...data,
        due_date: deadline_date,
      })

      // Get user email for notification
      const { data: userData } = await supabase.from("users").select("email").eq("id", user.id).single()

      // Send email notification
      if (userData?.email) {
        await sendDeadlineCreatedNotification({
          userId: user.id,
          deadlineId: data.id,
          email: userData.email,
          deadlineTitle: title,
          dueDate: new Date(deadline_date),
          description,
        })
      }
    }

    // Send notification about new deadline
    await fetch(`${request.headers.get("origin")}/api/notifications/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        deadlineId: data.id,
        type: "created",
      }),
    })

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("[v0] Deadline creation server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Get all deadlines for authenticated user
export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get deadlines
    const { data, error } = await supabase
      .from("deadlines")
      .select("*")
      .eq("user_id", user.id)
      .order("deadline_date", { ascending: true })

    if (error) {
      console.error("[v0] Get deadlines error:", error)
      return NextResponse.json({ error: "Failed to fetch deadlines" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("[v0] Get deadlines server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
