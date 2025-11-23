import { create } from 'zustand'
import { GameEngine, GameState } from '@/lib/game/gameEngine'
import { ValidationResult } from '@/lib/utils/validateGuess'

const SCORING_CONFIG = {
  easy: { basePoints: 1000, cluePenalty: 50, attemptPenalty: 20 },
  medium: { basePoints: 1500, cluePenalty: 75, attemptPenalty: 30 },
  hard: { basePoints: 2000, cluePenalty: 100, attemptPenalty: 40 }
} as const

interface GameStoreState {
  gameEngine: GameEngine | null
  gameState: GameState | null
  currentClue: string | null
  gameHistory: Array<{
    city: string
    score: number
    attempts: number
    cluesUsed: number
    timestamp: Date
  }>
  
  initializeGame: (difficulty?: keyof typeof SCORING_CONFIG) => void
  getNextClue: () => string | null
  submitGuess: (guess: string) => ValidationResult
  startNewGame: (difficulty?: keyof typeof SCORING_CONFIG) => void
  getRemainingClues: () => number
  getMapState: () => {
    center: { lat: number; lng: number }
    offset: { latOffset: number; lngOffset: number }
    reveal: { blurIntensity: number; revealPercentage: number; isFullyRevealed: boolean }
    actualCityCoordinates: { lat: number; lng: number }
  } | null
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  gameEngine: null,
  gameState: null,
  currentClue: null,
  gameHistory: [],

  initializeGame: (difficulty = 'medium') => {
    console.log('🔄 Initializing game with first clue...')
    const gameEngine = new GameEngine(difficulty)
    const gameState = gameEngine.getGameState()
    
    // First clue is automatically shown - no penalty
    const currentClue = gameState.currentClueIndex > 0 ? gameState.targetCity.clues[0] : null
    
    console.log('✅ Game initialized:', {
      city: gameState.targetCity.name,
      clueIndex: gameState.currentClueIndex,
      totalClues: gameState.targetCity.clues.length,
      firstClue: currentClue?.substring(0, 50) + '...'
    })
    
    set({ gameEngine, gameState, currentClue })
  },

  getNextClue: () => {
    const { gameEngine, gameState } = get()
    if (!gameEngine || !gameState) {
      console.error('❌ Game not initialized')
      return null
    }

    console.log('🔄 Store: Getting next clue...', {
      currentIndex: gameState.currentClueIndex,
      totalClues: gameState.targetCity.clues.length
    })

    const clue = gameEngine.getCurrentClue()
    const newGameState = gameEngine.getGameState()
    
    console.log('✅ Store: Clue retrieved', {
      newIndex: newGameState.currentClueIndex,
      newBlur: newGameState.mapReveal.blurIntensity
    })
    
    set({ currentClue: clue, gameState: newGameState })
    return clue
  },

  submitGuess: (guess: string) => {
    const { gameEngine } = get()
    if (!gameEngine) {
      throw new Error('Game not initialized')
    }

    const result = gameEngine.submitGuess(guess)
    const gameState = gameEngine.getGameState()

    if (result.isCorrect && gameState.isGameWon) {
      const { gameHistory } = get()
      set({
        gameHistory: [
          ...gameHistory,
          {
            city: gameState.targetCity.name,
            score: gameState.score,
            attempts: gameState.attempts,
            cluesUsed: gameState.currentClueIndex,
            timestamp: new Date()
          }
        ]
      })
    }

    set({ gameState })
    return result
  },

  startNewGame: (difficulty = 'medium') => {
    const { gameEngine } = get()
    if (!gameEngine) {
      get().initializeGame(difficulty)
      return
    }

    const gameState = gameEngine.startNewGame(difficulty)
    // First clue is automatically available
    const currentClue = gameState.currentClueIndex > 0 ? gameState.targetCity.clues[0] : null
    
    set({ gameState, currentClue })
  },

  getRemainingClues: () => {
    const { gameEngine } = get()
    return gameEngine ? gameEngine.getRemainingClues() : 0
  },

  getMapState: () => {
    const { gameEngine } = get()
    return gameEngine ? gameEngine.getMapState() : null
  }
}))