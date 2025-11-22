import { create } from 'zustand'
import { GameEngine, GameState } from '@/lib/game/gameEngine'
import { ValidationResult } from '@/lib/utils/validateGuess'

interface GameStoreState {
  // Game Engine
  gameEngine: GameEngine | null
  gameState: GameState | null
  
  // UI State
  currentClue: string | null
  gameHistory: Array<{
    city: string
    score: number
    attempts: number
    cluesUsed: number
    timestamp: Date
  }>
  
  // Actions
  initializeGame: (difficulty?: keyof typeof SCORING_CONFIG) => void
  getNextClue: () => string | null
  submitGuess: (guess: string) => ValidationResult
  startNewGame: (difficulty?: keyof typeof SCORING_CONFIG) => void
  getRemainingClues: () => number
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  gameEngine: null,
  gameState: null,
  currentClue: null,
  gameHistory: [],

  initializeGame: (difficulty = 'medium') => {
    const gameEngine = new GameEngine(difficulty)
    const gameState = gameEngine.getGameState()
    const currentClue = gameEngine.getCurrentClue() // Get first clue automatically
    
    set({ gameEngine, gameState, currentClue })
  },

  getNextClue: () => {
    const { gameEngine } = get()
    if (!gameEngine) {
      console.error('Game not initialized')
      return null
    }

    const clue = gameEngine.getCurrentClue()
    const gameState = gameEngine.getGameState()
    
    set({ currentClue: clue, gameState })
    return clue
  },

  submitGuess: (guess: string) => {
    const { gameEngine } = get()
    if (!gameEngine) {
      throw new Error('Game not initialized')
    }

    const result = gameEngine.submitGuess(guess)
    const gameState = gameEngine.getGameState()

    // Add to history if game is won
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
    const currentClue = gameEngine.getCurrentClue()
    
    set({ gameState, currentClue })
  },

  getRemainingClues: () => {
    const { gameEngine } = get()
    return gameEngine ? gameEngine.getRemainingClues() : 0
  }
}))