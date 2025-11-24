"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ClueCardProps {
  clueNumber: number
  text?: string
  isRevealed: boolean
  isActive: boolean
  onReveal?: () => void
}

export function ClueCard({ clueNumber, text, isRevealed, isActive, onReveal }: ClueCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-300 border-2",
        isRevealed ? "border-primary/50 bg-card" : "border-muted bg-muted/50 opacity-70",
        isActive && !isRevealed && "border-primary ring-2 ring-primary/20 cursor-pointer hover:bg-muted/80",
      )}
      onClick={isActive && !isRevealed ? onReveal : undefined}
    >
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {isRevealed ? (
            <Lightbulb className="w-4 h-4 text-yellow-500" />
          ) : (
            <Lock className="w-4 h-4 text-muted-foreground" />
          )}
          Clue #{clueNumber}
        </CardTitle>
        {isRevealed && <Badge variant="secondary">Revealed</Badge>}
        {!isRevealed && isActive && <Badge className="animate-pulse">Next Clue</Badge>}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className={cn("text-sm", !isRevealed && "blur-sm select-none")}>
          {isRevealed ? text : "Hidden clue content. Reveal to see details."}
        </p>
      </CardContent>
    </Card>
  )
}
