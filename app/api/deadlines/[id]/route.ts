import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Update deadline
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id } = params

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update deadline
    const { data, error } = await supabase
      .from("deadlines")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user owns this deadline
      .select()
      .single()

    if (error) {
      console.error("[v0] Update deadline error:", error)
      return NextResponse.json({ error: "Failed to update deadline" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("[v0] Deadline update server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Delete deadline
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete deadline
    const { error } = await supabase.from("deadlines").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("[v0] Delete deadline error:", error)
      return NextResponse.json({ error: "Failed to delete deadline" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Deadline delete server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
