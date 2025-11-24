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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import worldCities from "@/data/world/cities.json"
import ethiopiaCities from "@/data/ethiopia/cities.json"
import { Loader2, Globe, MapIcon, RotateCcw, Home, Sparkles, Lightbulb, Crown } from "lucide-react"
import { AdRewardModal } from "@/components/ads/AdRewardModal"
import { PointsDisplay } from "@/components/ads/PointsDisplay"

export default function GamePage() {
  const {
    isPlaying,
    gameMode,
    difficulty,
    currentCity,
    score,
    lives,
    cluesRevealed,
    mapBlurLevel,
    guesses,
    isGameOver,
    isWin,
    aiHints,
    isGeneratingHint,
    startGame,
    setCurrentCity,
    revealClue,
    makeGuess,
    addAIHint,
    setGeneratingHint,
    resetGame,
  } = useGameStore()

  const [selectedMode, setSelectedMode] = useState<"world" | "ethiopia" | "ai">("world")
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [isGeneratingCity, setIsGeneratingCity] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [showAdModal, setShowAdModal] = useState(false)
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      const data = await response.json()
      setUserProfile(data.profile)
      setGamesPlayedToday(data.profile?.games_played_today || 0)
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    }
  }

  useEffect(() => {
    if (isGameOver) {
      if (isWin) {
        toast.success(`Correct! The city was ${currentCity?.name}.`)
      } else {
        toast.error(`Game Over! The city was ${currentCity?.name}.`)
      }
    }
  }, [isGameOver, isWin, currentCity])

  const handleStartGame = async () => {
    const isPremium = userProfile?.subscription_tier !== "free"
    const canPlay = isPremium || gamesPlayedToday < 5

    if (!canPlay) {
      toast.error("Daily limit reached! Watch an ad or upgrade to premium.")
      setShowAdModal(true)
      return
    }

    if (!isPremium) {
      await fetch("/api/user/track-game", { method: "POST" })
      setGamesPlayedToday((prev) => prev + 1)
    }

    if (selectedMode === "ai") {
      setIsGeneratingCity(true)
      try {
        const response = await fetch("/api/game/generate-city", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            difficulty: selectedDifficulty,
            theme: "world",
          }),
        })

        if (!response.ok) throw new Error("Failed to generate city")

        const data = await response.json()
        startGame("ai", undefined, selectedDifficulty)
        setCurrentCity(data.city)
        toast.success("AI generated a mystery city for you!")
      } catch (error) {
        console.error("Nurfish006 Error starting AI game:", error)
        toast.error("Failed to generate city. Please try again.")
      } finally {
        setIsGeneratingCity(false)
      }
    } else {
      if (selectedMode === "ethiopia" && !isPremium) {
        toast.error("Ethiopia Legend Mode is only available for premium users!")
        return
      }
      const cities = selectedMode === "world" ? worldCities : ethiopiaCities
      startGame(selectedMode, cities as City[])
    }
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

  const handleGenerateHint = async () => {
    if (!currentCity || isGeneratingHint) return

    setGeneratingHint(true)
    try {
      const response = await fetch("/api/game/generate-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityName: currentCity.name,
          existingClues: currentCity.clues.slice(0, cluesRevealed),
          guessHistory: guesses,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate hint")

      const data = await response.json()
      addAIHint(data.hint)
      toast.success("AI generated a hint for you!")
    } catch (error) {
      console.error("Nurfish006 Error generating hint:", error)
      toast.error("Failed to generate hint. Please try again.")
    } finally {
      setGeneratingHint(false)
    }
  }

  const handlePlayAgain = async () => {
    const currentMode = gameMode
    const currentDiff = difficulty
    resetGame()

    await new Promise((resolve) => setTimeout(resolve, 100))

    if (currentMode === "ai") {
      setIsGeneratingCity(true)
      try {
        const response = await fetch("/api/game/generate-city", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            difficulty: currentDiff || "medium",
            theme: "world",
          }),
        })

        if (!response.ok) throw new Error("Failed to generate city")

        const data = await response.json()
        startGame("ai", undefined, currentDiff)
        setCurrentCity(data.city)
      } catch (error) {
        console.error("Nurfish006 Error generating new city:", error)
        toast.error("Failed to generate new city.")
      } finally {
        setIsGeneratingCity(false)
      }
    } else {
      const cities = currentMode === "world" ? worldCities : ethiopiaCities
      startGame(currentMode, cities as City[])
    }
  }

  const handleAdComplete = () => {
    setGamesPlayedToday(0)
    fetchUserProfile()
    toast.success("You earned 10 points! Daily limit reset.")
  }

  if (!isPlaying) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 min-h-[80vh] flex flex-col items-center justify-center">
        <Card className="w-full max-w-md border-2">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <PointsDisplay />
              {userProfile?.subscription_tier !== "free" && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                  <Crown className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">Premium</span>
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              <Globe className="w-8 h-8 text-primary" />
              City Mystery AI
            </CardTitle>
            <CardDescription className="text-lg">Test your geographical knowledge!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {userProfile?.subscription_tier === "free" && (
              <div className="bg-muted/50 p-3 rounded-lg border text-center">
                <p className="text-sm">
                  <span className="font-semibold text-primary">{5 - gamesPlayedToday}</span> games left today
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs"
                  onClick={() => (window.location.href = "/premium")}
                >
                  Upgrade to Premium
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Select Game Mode
              </label>
              <Tabs
                value={selectedMode}
                onValueChange={(v) => setSelectedMode(v as "world" | "ethiopia" | "ai")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 h-12">
                  <TabsTrigger value="world" className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <Globe className="w-4 h-4" /> World
                  </TabsTrigger>
                  <TabsTrigger
                    value="ethiopia"
                    className="flex items-center gap-1.5 text-xs sm:text-sm relative"
                    disabled={userProfile?.subscription_tier === "free"}
                  >
                    <MapIcon className="w-4 h-4" /> Ethiopia
                    {userProfile?.subscription_tier === "free" && (
                      <Crown className="w-3 h-3 text-primary absolute -top-1 -right-1" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4" /> AI
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <p className="text-xs text-muted-foreground mt-2">
                {selectedMode === "world"
                  ? "Explore famous cities from around the globe."
                  : selectedMode === "ethiopia"
                    ? userProfile?.subscription_tier === "free"
                      ? "Premium only - Discover Ethiopia's historical sites."
                      : "Discover historical and cultural sites of Ethiopia."
                    : "AI generates unique cities and clues tailored to your skill level."}
              </p>
            </div>

            {selectedMode === "ai" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={(v: any) => setSelectedDifficulty(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy - Well-known cities</SelectItem>
                    <SelectItem value="medium">Medium - Moderately famous</SelectItem>
                    <SelectItem value="hard">Hard - Obscure cities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button size="lg" className="w-full text-lg h-12" onClick={handleStartGame} disabled={isGeneratingCity}>
              {isGeneratingCity ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Start Game"
              )}
            </Button>
          </CardContent>
        </Card>

        <AdRewardModal isOpen={showAdModal} onClose={() => setShowAdModal(false)} onAdComplete={handleAdComplete} />
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
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Where am I?</h1>
          <p className="text-muted-foreground">
            {gameMode === "world"
              ? "World Mode"
              : gameMode === "ethiopia"
                ? "Ethiopia Legend Mode"
                : `AI Mode (${difficulty})`}
          </p>
        </div>
        <div className="w-full md:w-auto">
          <ScorePanel score={score} lives={lives} cluesUsed={cluesRevealed} totalClues={4} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          {gameMode === "ai" && aiHints.length > 0 && (
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-primary">
                <Sparkles className="w-4 h-4" />
                AI Hints
              </h3>
              {aiHints.map((hint, index) => (
                <p key={index} className="text-sm text-muted-foreground italic">
                  💡 {hint}
                </p>
              ))}
            </div>
          )}

          <div className="sticky bottom-4 bg-background/80 backdrop-blur-md p-4 border rounded-xl shadow-lg space-y-3">
            <GuessInput onGuess={handleGuess} disabled={isGameOver} />

            {gameMode === "ai" && !isGameOver && (
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={handleGenerateHint}
                disabled={isGeneratingHint}
              >
                {isGeneratingHint ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Get AI Hint
                  </>
                )}
              </Button>
            )}

            <p className="text-xs text-center text-muted-foreground">
              Guess correctly to win! Wrong guesses cost a life.
            </p>
          </div>
        </div>
      </div>

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
            {gameMode === "ai" && (
              <div className="text-xs text-muted-foreground text-center">Difficulty: {difficulty} • AI Generated</div>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={resetGame} className="w-full bg-transparent">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button onClick={handlePlayAgain} className="w-full" disabled={isGeneratingCity}>
              {isGeneratingCity ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
