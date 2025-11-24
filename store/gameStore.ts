import { create } from "zustand"

export type City = {
  id: string
  name: string
  country?: string
  region: string
  coordinates: { lat: number; lng: number }
  clues: string[]
  hints: string[]
}

type GameState = {
  // Session
  isPlaying: boolean
  gameMode: "world" | "ethiopia"
  currentCity: City | null

  // Progress
  score: number
  lives: number
  cluesRevealed: number // 0 to 4
  mapBlurLevel: number // 8, 6, 3, 0

  // History
  guesses: string[]
  isGameOver: boolean
  isWin: boolean

  // Actions
  startGame: (mode: "world" | "ethiopia", cities: City[]) => void
  revealClue: () => void
  makeGuess: (guess: string) => boolean
  resetGame: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  isPlaying: false,
  gameMode: "world",
  currentCity: null,

  score: 100,
  lives: 3,
  cluesRevealed: 0,
  mapBlurLevel: 8,

  guesses: [],
  isGameOver: false,
  isWin: false,

  startGame: (mode, cities) => {
    // Select random city
    const randomCity = cities[Math.floor(Math.random() * cities.length)]

    set({
      isPlaying: true,
      gameMode: mode,
      currentCity: randomCity,
      score: 100,
      lives: 3,
      cluesRevealed: 1, // Start with 1 clue
      mapBlurLevel: 8,
      guesses: [],
      isGameOver: false,
      isWin: false,
    })
  },

  revealClue: () => {
    const { cluesRevealed, score } = get()
    if (cluesRevealed < 4) {
      // Degrade score: 100 -> 70 -> 40 -> 20
      const newScore = cluesRevealed === 1 ? 70 : cluesRevealed === 2 ? 40 : 20
      const newBlur = cluesRevealed === 1 ? 6 : cluesRevealed === 2 ? 3 : 0

      set({
        cluesRevealed: cluesRevealed + 1,
        score: newScore,
        mapBlurLevel: newBlur,
      })
    }
  },

  makeGuess: (guess: string) => {
    const { currentCity, lives, score } = get()
    if (!currentCity) return false

    // Normalize strings for comparison
    const normalizedGuess = guess.toLowerCase().trim()
    const normalizedCity = currentCity.name.toLowerCase().trim()

    if (normalizedGuess === normalizedCity) {
      // Correct guess
      set({ isGameOver: true, isWin: true, mapBlurLevel: 0 })
      return true
    } else {
      // Incorrect guess
      const newLives = lives - 1
      if (newLives <= 0) {
        set({ isGameOver: true, isWin: false, lives: 0, mapBlurLevel: 0 })
      } else {
        set({ lives: newLives })
      }
      // Add to guesses history
      set((state) => ({ guesses: [...state.guesses, guess] }))
      return false
    }
  },

  resetGame: () => {
    set({
      isPlaying: false,
      currentCity: null,
      score: 100,
      lives: 3,
      cluesRevealed: 0,
      guesses: [],
      isGameOver: false,
      isWin: false,
    })
  },
}))
