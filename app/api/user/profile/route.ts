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

    const body = await req.json().catch(() => ({}))

    // Check if user profile exists
    const { data: existingProfile } = await supabase.from("users").select("id").eq("email", user.email).single()

    if (!existingProfile) {
      // Create user profile
      const { error } = await supabase.from("users").insert({
        email: user.email,
        first_name: body.firstName || user.user_metadata?.first_name,
        last_name: body.lastName || user.user_metadata?.last_name,
        subscription_tier: "free",
        subscription_status: "active",
        points: 0,
      })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Profile creation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error } = await supabase.from("users").select("*").eq("email", user.email).single()

    if (error) throw error

    return NextResponse.json({ profile })
  } catch (error: any) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
