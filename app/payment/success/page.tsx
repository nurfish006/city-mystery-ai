"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [verificationData, setVerificationData] = useState<any>(null)

  const txRef = searchParams.get("tx_ref") || searchParams.get("trx_ref")

  useEffect(() => {
    if (!txRef) {
      setStatus("error")
      return
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payment/verify/${txRef}`)
        const data = await response.json()

        if (data.status === "success") {
          setStatus("success")
          setVerificationData(data.data)
          await updateSubscription(data.data)
        } else {
          setStatus("error")
        }
      } catch (error) {
        console.error("Verification failed", error)
        setStatus("error")
      }
    }

    verifyPayment()
  }, [txRef])

  const updateSubscription = async (paymentData: any) => {
    try {
      await fetch("/api/payment/update-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tx_ref: txRef,
          amount: paymentData.amount,
          email: paymentData.email,
        }),
      })
    } catch (error) {
      console.error("Failed to update subscription:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && <Loader2 className="h-16 w-16 text-primary animate-spin" />}
            {status === "success" && <CheckCircle2 className="h-16 w-16 text-green-500" />}
            {status === "error" && <XCircle className="h-16 w-16 text-destructive" />}
          </div>
          <CardTitle className="text-2xl font-serif">
            {status === "loading" && "Verifying Payment..."}
            {status === "success" && "Payment Successful!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          {status === "loading" && (
            <p className="text-muted-foreground">Please wait while we confirm your transaction with Chapa.</p>
          )}

          {status === "success" && (
            <>
              <p className="text-muted-foreground">
                Thank you for subscribing! Your account has been upgraded to Legend status. Reference:{" "}
                <span className="font-mono text-xs">{txRef}</span>
              </p>
              <div className="pt-4">
                <Button onClick={() => router.push("/play")} className="w-full">
                  Start Playing Now
                </Button>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <p className="text-muted-foreground">
                We couldn't verify your payment. If you believe this is an error, please contact support.
              </p>
              <div className="pt-4">
                <Button variant="outline" onClick={() => router.push("/premium")} className="w-full">
                  Try Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
