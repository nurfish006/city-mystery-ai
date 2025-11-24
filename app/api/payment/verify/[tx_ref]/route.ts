import { NextResponse } from "next/server"
import { chapa } from "@/lib/chapa"

export async function GET(req: Request, { params }: { params: { tx_ref: string } }) {
  try {
    const { tx_ref } = params
    const response = await chapa.verify(tx_ref)

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: error.message || "Failed to verify payment" }, { status: 500 })
  }
}
