import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Get timeline view of deadlines with AI-powered suggestions
export async function GET(request: Request) {
  const supabase = await createServerClient()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  const { data: deadlines, error } = await supabase
    .from("deadlines")
    .select("*")
    .eq("user_id", userId)
    .order("due_date", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Group deadlines by time periods
  const now = new Date()
  const timeline = {
    overdue: deadlines.filter((d) => new Date(d.due_date) < now && d.status !== "completed"),
    today: deadlines.filter((d) => {
      const due = new Date(d.due_date)
      return due.toDateString() === now.toDateString()
    }),
    thisWeek: deadlines.filter((d) => {
      const due = new Date(d.due_date)
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      return due > now && due <= weekFromNow
    }),
    thisMonth: deadlines.filter((d) => {
      const due = new Date(d.due_date)
      return due.getMonth() === now.getMonth() && due.getFullYear() === now.getFullYear()
    }),
    upcoming: deadlines.filter((d) => new Date(d.due_date) > now),
  }

  return NextResponse.json({ timeline })
}
