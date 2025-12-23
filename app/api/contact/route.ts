import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Store contact form submission in database
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        message,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Contact form error:", error)
      return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
    }

    // TODO: Send email notification to admin
    // This would integrate with an email service like Resend or SendGrid

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("[v0] Contact form server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
