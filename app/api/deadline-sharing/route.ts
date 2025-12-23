import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

// GET - Get shared deadlines
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")
    const type = request.nextUrl.searchParams.get("type") // 'shared-by-me' or 'shared-with-me'

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    let query = supabase.from("deadline_shares").select(`
      *,
      deadlines(*),
      shared_with:users!deadline_shares_shared_with_user_id_fkey(*)
    `)

    if (type === "shared-by-me") {
      query = query.eq("owner_id", userId)
    } else {
      query = query.eq("shared_with_user_id", userId)
    }

    const { data: shares, error } = await query.order("shared_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ shares: shares || [] })
  } catch (error) {
    console.error("Get shares error:", error)
    return NextResponse.json({ error: "Failed to fetch shared deadlines" }, { status: 500 })
  }
}

// POST - Share a deadline with user
export async function POST(request: NextRequest) {
  try {
    const { deadlineId, ownerId, sharedWithUserId, shareType = "viewer" } = await request.json()

    if (!deadlineId || !ownerId || !sharedWithUserId || !shareType) {
      return NextResponse.json(
        { error: "Missing required fields: deadlineId, ownerId, sharedWithUserId, shareType" },
        { status: 400 }
      )
    }

    // Check if deadline belongs to owner
    const { data: deadline } = await supabase
      .from("deadlines")
      .select("*")
      .eq("id", deadlineId)
      .eq("user_id", ownerId)
      .single()

    if (!deadline) {
      return NextResponse.json(
        { error: "Deadline not found or you don't have permission" },
        { status: 403 }
      )
    }

    // Create share
    const { data: share, error } = await supabase
      .from("deadline_shares")
      .insert({
        deadline_id: deadlineId,
        owner_id: ownerId,
        shared_with_user_id: sharedWithUserId,
        share_type: shareType,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Deadline already shared with this user" },
          { status: 409 }
        )
      }
      throw error
    }

    // Log activity
    await supabase.from("user_activity_log").insert({
      user_id: ownerId,
      activity_type: "deadline_shared",
      description: `Shared deadline: ${deadline.title}`,
    })

    return NextResponse.json({ share, success: true })
  } catch (error) {
    console.error("Share deadline error:", error)
    return NextResponse.json({ error: "Failed to share deadline" }, { status: 500 })
  }
}

// PUT - Update share permissions
export async function PUT(request: NextRequest) {
  try {
    const { shareId, shareType } = await request.json()

    if (!shareId || !shareType) {
      return NextResponse.json(
        { error: "Share ID and share type are required" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("deadline_shares")
      .update({ share_type: shareType })
      .eq("id", shareId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update share error:", error)
    return NextResponse.json({ error: "Failed to update share" }, { status: 500 })
  }
}

// DELETE - Revoke share access
export async function DELETE(request: NextRequest) {
  try {
    const shareId = request.nextUrl.searchParams.get("shareId")

    if (!shareId) {
      return NextResponse.json({ error: "Share ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("deadline_shares")
      .delete()
      .eq("id", shareId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Revoke share error:", error)
    return NextResponse.json({ error: "Failed to revoke share" }, { status: 500 })
  }
}
