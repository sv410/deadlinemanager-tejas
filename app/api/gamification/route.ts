import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

// Get user gamification stats
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get gamification stats
    const { data: gamification, error: gamError } = await supabase
      .from("user_gamification")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (gamError && gamError.code !== "PGRST116") {
      throw gamError
    }

    // Get recent achievements
    const { data: achievements, error: achError } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false })
      .limit(10)

    if (achError) throw achError

    // Get current streak
    const { data: streak } = await supabase.rpc("get_user_streak", { p_user_id: userId })

    // Get daily challenges progress
    const { data: challenges, error: chalError } = await supabase
      .from("user_challenge_progress")
      .select(`*,
        daily_challenges(*)`)
      .eq("user_id", userId)
      .eq("date", new Date().toISOString().split("T")[0])

    if (chalError) throw chalError

    return NextResponse.json({
      gamification: gamification || {
        total_points: 0,
        current_streak: 0,
        longest_streak: 0,
        level: 1,
        completion_rate: 0,
      },
      achievements: achievements || [],
      currentStreak: streak || 0,
      dailyChallenges: challenges || [],
    })
  } catch (error) {
    console.error("Gamification GET error:", error)
    return NextResponse.json({ error: "Failed to fetch gamification data" }, { status: 500 })
  }
}

// POST - Award points and handle achievements
export async function POST(request: NextRequest) {
  try {
    const { userId, action, points, achievementId } = await request.json()

    if (!userId || !action) {
      return NextResponse.json({ error: "User ID and action are required" }, { status: 400 })
    }

    // Log activity
    const { error: logError } = await supabase.from("user_activity_log").insert({
      user_id: userId,
      activity_type: action,
      points_earned: points || 0,
    })

    if (logError) throw logError

    // Update gamification stats
    const { data: current } = await supabase
      .from("user_gamification")
      .select("*")
      .eq("user_id", userId)
      .single()

    const newPoints = (current?.total_points || 0) + (points || 0)
    const newLevel = Math.floor(newPoints / 1000) + 1

    const { error: updateError } = await supabase
      .from("user_gamification")
      .upsert({
        user_id: userId,
        total_points: newPoints,
        level: newLevel,
        level_progress: newPoints % 1000,
        updated_at: new Date().toISOString(),
      })

    if (updateError) throw updateError

    // Award achievement if provided
    if (achievementId) {
      const { error: achError } = await supabase.from("user_achievements").upsert({
        user_id: userId,
        achievement_id: achievementId,
        achievement_name: action,
        points_awarded: points || 0,
      })

      if (achError && achError.code !== "23505") throw achError
    }

    return NextResponse.json({
      success: true,
      newPoints,
      newLevel,
      message: `+${points} points!`,
    })
  } catch (error) {
    console.error("Gamification POST error:", error)
    return NextResponse.json({ error: "Failed to update gamification" }, { status: 500 })
  }
}

// PUT - Update streak
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user's gamification data
    const { data: gamification } = await supabase
      .from("user_gamification")
      .select("*")
      .eq("user_id", userId)
      .single()

    const lastActivity = gamification?.last_activity_date
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

    let newStreak = gamification?.current_streak || 0
    let newLongestStreak = gamification?.longest_streak || 0

    if (lastActivity === today) {
      // Already active today
      newStreak = gamification?.current_streak || 1
    } else if (lastActivity === yesterday) {
      // Continue streak
      newStreak = (gamification?.current_streak || 0) + 1
      if (newStreak > newLongestStreak) {
        newLongestStreak = newStreak
      }
    } else {
      // Streak broken
      newStreak = 1
    }

    const { error: updateError } = await supabase
      .from("user_gamification")
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newLongestStreak, newStreak),
        last_activity_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)

    if (updateError) throw updateError

    // Award streak bonuses
    if (newStreak % 7 === 0) {
      await supabase.from("user_activity_log").insert({
        user_id: userId,
        activity_type: "streak_bonus",
        points_earned: 500,
        description: `${newStreak}-day streak bonus!`,
      })

      const { data: current } = await supabase
        .from("user_gamification")
        .select("total_points")
        .eq("user_id", userId)
        .single()

      await supabase
        .from("user_gamification")
        .update({ total_points: (current?.total_points || 0) + 500 })
        .eq("user_id", userId)
    }

    return NextResponse.json({
      success: true,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
    })
  } catch (error) {
    console.error("Streak update error:", error)
    return NextResponse.json({ error: "Failed to update streak" }, { status: 500 })
  }
}
