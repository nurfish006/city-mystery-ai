import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { tx_ref, amount, email } = await req.json()

    const supabase = await createClient()

    // Determine subscription tier based on amount
    const tier = amount >= 490 ? "yearly" : amount >= 49 ? "monthly" : "free"
    const startDate = new Date()
    const endDate = new Date()
    if (tier === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1)
    } else if (tier === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }

    // Update user subscription
    const { error } = await supabase
      .from("users")
      .update({
        subscription_tier: tier,
        subscription_status: "active",
        subscription_start_date: startDate.toISOString(),
        subscription_end_date: endDate.toISOString(),
        last_payment_tx_ref: tx_ref,
        last_payment_amount: amount,
        last_payment_date: new Date().toISOString(),
      })
      .eq("email", email)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Subscription update error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
