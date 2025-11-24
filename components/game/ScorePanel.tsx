"use client"

import { Heart, Trophy } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ScorePanelProps {
  score: number
  lives: number
  maxLives?: number
  cluesUsed: number
  totalClues?: number
}

export function ScorePanel({ score, lives, maxLives = 3, cluesUsed, totalClues = 4 }: ScorePanelProps) {
  return (
    <div className="bg-card border rounded-lg p-4 flex items-center justify-between shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Current Score</div>
        <div className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Trophy className="w-5 h-5" />
          {score}
        </div>
      </div>

      <div className="h-8 w-px bg-border mx-4 hidden sm:block" />

      <div className="flex flex-col gap-1 items-end sm:items-start">
        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Lives Left</div>
        <div className="flex gap-1">
          {Array.from({ length: maxLives }).map((_, i) => (
            <Heart
              key={i}
              className={`w-5 h-5 ${i < lives ? "fill-red-500 text-red-500" : "text-muted-foreground/30"}`}
            />
          ))}
        </div>
      </div>

      <div className="h-8 w-px bg-border mx-4 hidden sm:block" />

      <div className="hidden sm:flex flex-col gap-1 min-w-[100px]">
        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider flex justify-between">
          <span>Clues</span>
          <span>
            {cluesUsed}/{totalClues}
          </span>
        </div>
        <Progress value={(cluesUsed / totalClues) * 100} className="h-2" />
      </div>
    </div>
  )
}
