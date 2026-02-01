import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

// GET - Fetch comments on a deadline
export async function GET(request: NextRequest) {
  try {
    const deadlineId = request.nextUrl.searchParams.get("deadlineId")

    if (!deadlineId) {
      return NextResponse.json({ error: "Deadline ID is required" }, { status: 400 })
    }

    const { data: comments, error } = await supabase
      .from("deadline_comments")
      .select(`*,
        users(full_name, avatar_url, email)`)
      .eq("deadline_id", deadlineId)
      .order("created_at", { ascending: true })

    if (error) throw error

    return NextResponse.json({ comments: comments || [] })
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

// POST - Create a comment on deadline
export async function POST(request: NextRequest) {
  try {
    const { deadlineId, userId, content, mentions = [] } = await request.json()

    if (!deadlineId || !userId || !content) {
      return NextResponse.json(
        { error: "Missing required fields: deadlineId, userId, content" },
        { status: 400 }
      )
    }

    const { data: comment, error } = await supabase
      .from("deadline_comments")
      .insert({
        deadline_id: deadlineId,
        user_id: userId,
        content,
        mentions: mentions,
      })
      .select(`*,
        users(full_name, avatar_url, email)`)
      .single()

    if (error) throw error

    // Send notifications to mentioned users
    for (const mentionedUserId of mentions) {
      await supabase.from("user_activity_log").insert({
        user_id: mentionedUserId,
        activity_type: "mentioned_in_comment",
        description: `You were mentioned in a deadline comment`,
      })
    }

    return NextResponse.json({ comment, success: true })
  } catch (error) {
    console.error("Create comment error:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}

// PUT - Update a comment
export async function PUT(request: NextRequest) {
  try {
    const { commentId, content } = await request.json()

    if (!commentId || !content) {
      return NextResponse.json(
        { error: "Comment ID and content are required" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("deadline_comments")
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update comment error:", error)
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  }
}

// DELETE - Delete a comment
export async function DELETE(request: NextRequest) {
  try {
    const commentId = request.nextUrl.searchParams.get("commentId")

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("deadline_comments").delete().eq("id", commentId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete comment error:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}
