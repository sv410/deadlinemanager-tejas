import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Share deadline with team members
export async function POST(request: Request) {
  const supabase = await createServerClient()
  const { deadlineId, shareWithEmails, message } = await request.json()

  // Create shareable link
  const shareToken = Math.random().toString(36).substring(2, 15)

  const { data, error } = await supabase
    .from("deadline_shares")
    .insert({
      deadline_id: deadlineId,
      share_token: shareToken,
      shared_with: shareWithEmails,
      message: message,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send email notifications to shared users
  const shareLink = `${process.env.NEXT_PUBLIC_APP_URL}/shared/${shareToken}`

  return NextResponse.json({
    success: true,
    shareLink,
    data,
  })
}
