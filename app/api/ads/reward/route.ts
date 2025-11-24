import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { adType, pointsEarned } = await req.json()

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, points")
      .eq("email", user.email)
      .single()

    if (profileError) throw profileError

    // Update points
    const { error: updateError } = await supabase
      .from("users")
      .update({ points: (profile.points || 0) + pointsEarned })
      .eq("id", profile.id)

    if (updateError) throw updateError

    // Record ad view
    const { error: adError } = await supabase.from("ad_views").insert({
      user_id: profile.id,
      ad_type: adType,
      points_earned: pointsEarned,
      completed: true,
    })

    if (adError) throw adError

    return NextResponse.json({ success: true, newPoints: (profile.points || 0) + pointsEarned })
  } catch (error: any) {
    console.error("Ad reward error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
