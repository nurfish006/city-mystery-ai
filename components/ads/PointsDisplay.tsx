"use client"

import { Coins } from "lucide-react"
import { useEffect, useState } from "react"

export function PointsDisplay() {
  const [points, setPoints] = useState<number | null>(null)

  useEffect(() => {
    fetchPoints()
  }, [])

  const fetchPoints = async () => {
    try {
      const response = await fetch("/api/user/profile")
      const data = await response.json()
      setPoints(data.profile?.points ?? 0)
    } catch (error) {
      console.error("Failed to fetch points:", error)
    }
  }

  if (points === null) return null

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
      <Coins className="h-4 w-4 text-yellow-500" />
      <span className="text-sm font-semibold text-yellow-500">{points}</span>
    </div>
  )
}
