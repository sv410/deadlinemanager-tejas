import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Gamification: Award points for completing deadlines
export async function POST(request: Request) {
  const supabase = await createServerClient()
  const { userId, deadlineId, action } = await request.json()

  let points = 0
  let achievement = null

  // Point system
  switch (action) {
    case "completed_on_time":
      points = 100
      break
    case "completed_early":
      points = 150
      achievement = "Early Bird"
      break
    case "completed_high_priority":
      points = 200
      achievement = "Priority Master"
      break
    case "streak_7_days":
      points = 500
      achievement = "Week Warrior"
      break
    default:
      points = 50
  }

  // Update user points
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("gamification_points, achievements")
    .eq("id", userId)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  const newPoints = (profile.gamification_points || 0) + points
  const achievements = profile.achievements || []
  if (achievement && !achievements.includes(achievement)) {
    achievements.push(achievement)
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      gamification_points: newPoints,
      achievements: achievements,
    })
    .eq("id", userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    pointsAwarded: points,
    totalPoints: newPoints,
    achievement: achievement,
  })
}
