"use client"

import { useState } from "react"
import { Check, Shield, Zap, Globe, Crown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PremiumPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  const handlePayment = async (plan: string, amount: number) => {
    try {
      if (!formData.email || !formData.firstName || !formData.lastName) {
        alert("Please fill in your details first")
        return
      }

      setLoading(true)
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount,
          plan,
        }),
      })

      const data = await response.json()

      if (data.data?.checkout_url) {
        window.location.href = data.data.checkout_url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Failed to initialize payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Premium
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
            Unlock the Mysteries of <span className="text-primary">Ethiopia</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Get unlimited access to the Ethiopia Legend Mode, exclusive city cards, and ad-free experience. Support the
            preservation of cultural heritage.
          </p>
        </div>

        {/* User Details Form */}
        <div className="max-w-md mx-auto bg-card border border-border/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">Your Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Abebe"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Bikila"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-background/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="abebe@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background/50"
              />
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Free Tier */}
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Explorer</CardTitle>
              <CardDescription>For casual players</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">Free</span>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-primary" />5 games per day
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-primary" />
                  World mode access
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-primary" />
                  Basic city cards
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-primary" />
                  Ads enabled
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-transparent" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Monthly Premium */}
          <Card className="bg-gradient-to-b from-card to-background border-primary/50 shadow-2xl scale-105 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Legend</CardTitle>
              <CardDescription>Monthly subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">49</span>
                <span className="text-lg text-muted-foreground">ETB</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-primary" />
                  Unlimited daily games
                </li>
                <li className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-primary" />
                  Ethiopia Legend Mode
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-primary" />
                  Ad-free experience
                </li>
                <li className="flex items-center gap-3">
                  <Crown className="h-4 w-4 text-primary" />
                  Premium animated cards
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handlePayment("Monthly", 49)}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Subscribe Now
              </Button>
            </CardFooter>
          </Card>

          {/* Yearly Premium */}
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Guardian</CardTitle>
              <CardDescription>Annual subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">490</span>
                <span className="text-lg text-muted-foreground">ETB</span>
                <span className="text-sm text-muted-foreground">/yr</span>
              </div>
              <p className="text-xs text-green-500 font-medium">Save ~17% (2 months free)</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-primary" />
                  All Legend benefits
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-primary" />
                  Exclusive Founder Badge
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-primary" />
                  Priority support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary/50 bg-transparent"
                onClick={() => handlePayment("Yearly", 490)}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Go Annual
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Trust Badge */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border/50">
          <p className="flex items-center justify-center gap-2">
            <Shield className="h-4 w-4" />
            Secure payments powered by Chapa. You can cancel anytime.
          </p>
        </div>
      </div>
    </div>
  )
}
