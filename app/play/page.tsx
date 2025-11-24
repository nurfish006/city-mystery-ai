"use client"

import { useEffect, useState } from "react"
import { useGameStore, type City } from "@/store/gameStore"
import { MapPreview } from "@/components/game/MapPreview"
import { ClueCard } from "@/components/game/ClueCard"
import { GuessInput } from "@/components/game/GuessInput"
import { ScorePanel } from "@/components/game/ScorePanel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import worldCities from "@/data/world/cities.json"
import ethiopiaCities from "@/data/ethiopia/cities.json"
import { Loader2, Globe, MapIcon, RotateCcw, Home } from "lucide-react"

export default function GamePage() {
  const {
    isPlaying,
    gameMode,
    currentCity,
    score,
    lives,
    cluesRevealed,
    mapBlurLevel,
    guesses,
    isGameOver,
    isWin,
    startGame,
    revealClue,
    makeGuess,
    resetGame,
  } = useGameStore()

  const [selectedMode, setSelectedMode] = useState<"world" | "ethiopia">("world")

  // Handle Game Over / Win effects
  useEffect(() => {
    if (isGameOver) {
      if (isWin) {
        toast.success(`Correct! The city was ${currentCity?.name}.`)
      } else {
        toast.error(`Game Over! The city was ${currentCity?.name}.`)
      }
    }
  }, [isGameOver, isWin, currentCity])

  const handleStartGame = () => {
    const cities = selectedMode === "world" ? worldCities : ethiopiaCities
    startGame(selectedMode, cities as City[])
  }

  const handleGuess = (guess: string) => {
    if (guesses.includes(guess)) {
      toast.warning("You already guessed that city!")
      return
    }
    const correct = makeGuess(guess)
    if (!correct && !isGameOver) {
      toast.error("Incorrect guess! Try again.")
    }
  }

  const handlePlayAgain = () => {
    resetGame()
    // Small delay to allow reset to propagate before starting new game
    setTimeout(() => {
      const cities = gameMode === "world" ? worldCities : ethiopiaCities
      startGame(gameMode, cities as City[])
    }, 100)
  }

  if (!isPlaying) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 min-h-[80vh] flex flex-col items-center justify-center">
        <Card className="w-full max-w-md border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              <Globe className="w-8 h-8 text-primary" />
              City Mystery AI
            </CardTitle>
            <CardDescription className="text-lg">Test your geographical knowledge!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Select Game Mode
              </label>
              <Tabs
                value={selectedMode}
                onValueChange={(v) => setSelectedMode(v as "world" | "ethiopia")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger value="world" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" /> World
                  </TabsTrigger>
                  <TabsTrigger value="ethiopia" className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4" /> Ethiopia Legend
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <p className="text-xs text-muted-foreground mt-2">
                {selectedMode === "world"
                  ? "Explore famous cities from around the globe."
                  : "Discover historical and cultural sites of Ethiopia."}
              </p>
            </div>

            <Button size="lg" className="w-full text-lg h-12" onClick={handleStartGame}>
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentCity)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Header / Stats */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Where am I?</h1>
          <p className="text-muted-foreground">{gameMode === "world" ? "World Mode" : "Ethiopia Legend Mode"}</p>
        </div>
        <div className="w-full md:w-auto">
          <ScorePanel score={score} lives={lives} cluesUsed={cluesRevealed} totalClues={4} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Map */}
        <div className="space-y-4">
          <Card className="overflow-hidden border-2">
            <MapPreview lat={currentCity.coordinates.lat} lng={currentCity.coordinates.lng} blurLevel={mapBlurLevel} />
          </Card>

          <div className="bg-muted/30 p-4 rounded-lg border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Your Guesses
            </h3>
            {guesses.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No guesses yet...</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {guesses.map((g, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-background border rounded-md text-sm text-muted-foreground line-through decoration-red-500/50"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Clues & Input */}
        <div className="space-y-6">
          <div className="space-y-3">
            {currentCity.clues.map((clue, index) => (
              <ClueCard
                key={index}
                clueNumber={index + 1}
                text={clue}
                isRevealed={index < cluesRevealed}
                isActive={index === cluesRevealed}
                onReveal={revealClue}
              />
            ))}
          </div>

          <div className="sticky bottom-4 bg-background/80 backdrop-blur-md p-4 border rounded-xl shadow-lg space-y-3">
            <GuessInput onGuess={handleGuess} disabled={isGameOver} />
            <p className="text-xs text-center text-muted-foreground">
              Guess correctly to win! Wrong guesses cost a life.
            </p>
          </div>
        </div>
      </div>

      {/* Game Over / Win Dialog */}
      <Dialog open={isGameOver} onOpenChange={(open) => !open && resetGame()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">{isWin ? "🎉 Victory!" : "💔 Game Over"}</DialogTitle>
            <DialogDescription className="text-center text-lg pt-2">
              {isWin
                ? `You found ${currentCity.name} with ${score} points!`
                : `The city was ${currentCity.name}. Better luck next time!`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">Final Score</span>
              <span className="text-xl font-bold">{isWin ? score : 0}</span>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={resetGame} className="w-full bg-transparent">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button onClick={handlePlayAgain} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
