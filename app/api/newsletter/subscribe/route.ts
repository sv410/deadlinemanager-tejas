import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { email } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Check if email already exists
    const { data: existing } = await supabase.from("newsletter_subscribers").select("email").eq("email", email).single()

    if (existing) {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 400 })
    }

    // Add to newsletter subscribers
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email,
        subscribed_at: new Date().toISOString(),
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Newsletter subscription error:", error)
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("[v0] Newsletter server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
