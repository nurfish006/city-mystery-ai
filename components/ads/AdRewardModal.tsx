"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Play, Coins } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdRewardModalProps {
  isOpen: boolean
  onClose: () => void
  onAdComplete: () => void
}

export function AdRewardModal({ isOpen, onClose, onAdComplete }: AdRewardModalProps) {
  const [isWatching, setIsWatching] = useState(false)
  const [adProgress, setAdProgress] = useState(0)
  const router = useRouter()

  const handleWatchAd = async () => {
    setIsWatching(true)
    setAdProgress(0)

    // Simulate ad viewing (in production, integrate with actual ad provider like Google AdSense, AdMob, etc.)
    const interval = setInterval(() => {
      setAdProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          handleAdComplete()
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const handleAdComplete = async () => {
    try {
      // Award points to user
      const response = await fetch("/api/ads/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adType: "video", pointsEarned: 10 }),
      })

      if (response.ok) {
        onAdComplete()
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to record ad view:", error)
    } finally {
      setIsWatching(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-serif">
            <Coins className="h-5 w-5 text-yellow-500" />
            Earn Points
          </DialogTitle>
          <DialogDescription>Watch a short ad to earn 10 points and continue playing</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isWatching ? (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-6 text-center space-y-3">
                <Play className="h-12 w-12 mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">Watch a 5-second ad to earn points</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleWatchAd} className="flex-1">
                  Watch Ad
                </Button>
                <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-8 flex items-center justify-center min-h-[200px]">
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground">Ad playing... {Math.floor(adProgress / 20)}s</p>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-100"
                      style={{ width: `${adProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
