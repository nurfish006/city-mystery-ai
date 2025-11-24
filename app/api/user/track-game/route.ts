import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, games_played_today, total_games_played")
      .eq("email", user.email)
      .single()

    if (profileError) throw profileError

    // Update game counters
    const { error: updateError } = await supabase
      .from("users")
      .update({
        games_played_today: (profile.games_played_today || 0) + 1,
        total_games_played: (profile.total_games_played || 0) + 1,
        last_game_date: new Date().toISOString().split("T")[0], // Today's date
      })
      .eq("id", profile.id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Track game error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
