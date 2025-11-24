import { NextResponse } from "next/server"
import { chapa } from "@/lib/chapa"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, email, firstName, lastName, plan } = body

    // Validate request
    if (!amount || !email || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Initialize payment with Chapa
    const response = await chapa.initialize({
      amount: amount.toString(),
      currency: "ETB",
      email,
      first_name: firstName,
      last_name: lastName,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/success`,
      customization: {
        title: `City Mystery AI - ${plan || "Premium"}`,
        description: "Unlock full access to City Mystery AI Explorer",
      },
    })

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ error: error.message || "Failed to initialize payment" }, { status: 500 })
  }
}
