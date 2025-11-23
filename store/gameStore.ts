import { create } from 'zustand'
import { GameEngine, GameState } from '@/lib/game/gameEngine'
import { ValidationResult } from '@/lib/utils/validateGuess'
import { clueManager } from '@/lib/ai/clueManager'

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
  
  // AI/Offline status
  clueMode: 'ai' | 'offline'
  isAIAvailable: boolean

  initializeGame: (difficulty?: keyof typeof SCORING_CONFIG, gameMode?: 'world' | 'ethiopia') => Promise<void>
  getNextClue: () => Promise<string | null>
  submitGuess: (guess: string) => ValidationResult
  startNewGame: (difficulty?: keyof typeof SCORING_CONFIG, gameMode?: 'world' | 'ethiopia') => void
  getRemainingClues: () => number
  getMapState: () => {
    center: { lat: number; lng: number }
    offset: { latOffset: number; lngOffset: number }
    reveal: { blurIntensity: number; revealPercentage: number; isFullyRevealed: boolean }
    actualCityCoordinates: { lat: number; lng: number }
  } | null
  revealFullMap: () => void
  checkAIAvailability: () => Promise<boolean>
  switchToOffline: () => void
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  gameEngine: null,
  gameState: null,
  currentClue: null,
  gameHistory: [],
  clueMode: 'offline',
  isAIAvailable: false,

  initializeGame: async (difficulty = 'medium', gameMode = 'world') => {
    console.log('🔄 Initializing game with AI/Offline system...')
    
    // Initialize clue manager first
    await clueManager.initialize()
    const initialMode = clueManager.getCurrentMode()
    
    const gameEngine = new GameEngine(difficulty, gameMode)
    const gameState = gameEngine.getGameState()
    const clueMode = gameEngine.getClueMode()
    
    // Get the first clue that was automatically provided
    const currentClue = gameState.usedClues.length > 0 ? gameState.usedClues[0] : null
    
    console.log('✅ Game initialized:', {
      mode: clueMode,
      gameMode,
      city: gameState.targetCity.name,
      hasFirstClue: !!currentClue
    })
    
    set({ 
      gameEngine, 
      gameState, 
      currentClue, 
      clueMode,
      isAIAvailable: initialMode === 'ai'
    })
  },

  getNextClue: async () => {
    const { gameEngine } = get()
    if (!gameEngine) {
      console.error('❌ Game not initialized')
      return null
    }

    console.log('🔄 Store: Getting next clue...')

    const clue = await gameEngine.getCurrentClue()
    const newGameState = gameEngine.getGameState()
    const clueMode = gameEngine.getClueMode()
    
    console.log('✅ Store: Clue retrieved', {
      newIndex: newGameState.currentClueIndex,
      mode: clueMode,
      clueLength: clue?.length
    })
    
    set({ currentClue: clue, gameState: newGameState, clueMode })
    return clue
  },

  revealFullMap: () => {
    const { gameEngine, gameState } = get()
    if (!gameEngine || !gameState) {
      console.error('❌ Game not initialized')
      return
    }

    // Only allow if all clues are used
    if (gameState.currentClueIndex >= gameState.targetCity.clues.length) {
      gameEngine.revealFullMap()
      const newGameState = gameEngine.getGameState()
      set({ gameState: newGameState })
      console.log('✅ Full map revealed in store')
    } else {
      console.log('❌ Cannot reveal full map - not all clues used')
    }
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

  startNewGame: (difficulty = 'medium', gameMode = 'world') => {
    const { gameEngine } = get()
    if (!gameEngine) {
      get().initializeGame(difficulty, gameMode)
      return
    }

    const gameState = gameEngine.startNewGame(difficulty, gameMode)
    const clueMode = gameEngine.getClueMode()
    
    // First clue is automatically available
    const currentClue = gameState.usedClues.length > 0 ? gameState.usedClues[0] : null
    
    set({ gameState, currentClue, clueMode })
  },

  getRemainingClues: () => {
    const { gameEngine } = get()
    return gameEngine ? gameEngine.getRemainingClues() : 0
  },

  getMapState: () => {
    const { gameEngine } = get()
    return gameEngine ? gameEngine.getMapState() : null
  },

  checkAIAvailability: async (): Promise<boolean> => {
    const available = await clueManager.retryAIConnection()
    set({ isAIAvailable: available, clueMode: available ? 'ai' : 'offline' })
    return available
  },

  switchToOffline: () => {
    clueManager.switchToOffline()
    set({ clueMode: 'offline', isAIAvailable: false })
  }
}))