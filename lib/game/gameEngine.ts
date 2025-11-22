import { City, getRandomCity } from '@/lib/utils/citySelect'
import { calculateScore, SCORING_CONFIG } from '@/lib/game/scoring'
import { validateGuess, ValidationResult } from '@/lib/utils/validateGuess'

export interface GameState {
  targetCity: City
  currentClueIndex: number
  usedClues: string[]
  attempts: number
  score: number
  maxPossibleScore: number
  isGameOver: boolean
  isGameWon: boolean
  difficulty: keyof typeof SCORING_CONFIG
}

export class GameEngine {
  private state: GameState

  constructor(difficulty: keyof typeof SCORING_CONFIG = 'medium') {
    this.state = this.initializeGame(difficulty)
  }

  private initializeGame(difficulty: keyof typeof SCORING_CONFIG): GameState {
    const targetCity = getRandomCity()
    
    return {
      targetCity,
      currentClueIndex: 0,
      usedClues: [],
      attempts: 0,
      score: 0,
      maxPossibleScore: SCORING_CONFIG[difficulty].basePoints,
      isGameOver: false,
      isGameWon: false,
      difficulty
    }
  }

  getCurrentClue(): string | null {
    if (this.state.currentClueIndex >= this.state.targetCity.clues.length) {
      return null // No more clues available
    }
    
    const clue = this.state.targetCity.clues[this.state.currentClueIndex]
    this.state.usedClues.push(clue)
    this.state.currentClueIndex++
    
    // Update max possible score based on clues used
    this.state.maxPossibleScore = SCORING_CONFIG[this.state.difficulty].basePoints - 
      (this.state.currentClueIndex * SCORING_CONFIG[this.state.difficulty].cluePenalty)
    
    return clue
  }

  submitGuess(guess: string): ValidationResult {
    if (this.state.isGameOver) {
      throw new Error('Game is already over')
    }

    this.state.attempts++
    const result = validateGuess(guess, this.state.targetCity)

    if (result.isCorrect) {
      this.state.isGameWon = true
      this.state.isGameOver = true
      
      // Calculate final score
      const wasPerfect = this.state.attempts === 1 && this.state.currentClueIndex === 1
      this.state.score = calculateScore(
        this.state.difficulty,
        this.state.currentClueIndex,
        this.state.attempts,
        wasPerfect
      )
    }

    // Game over after 5 attempts
    if (this.state.attempts >= 5 && !result.isCorrect) {
      this.state.isGameOver = true
      this.state.score = 0
    }

    return result
  }

  getRemainingClues(): number {
    return this.state.targetCity.clues.length - this.state.currentClueIndex
  }

  getGameState(): GameState {
    return { ...this.state } // Return copy to prevent direct mutation
  }

  startNewGame(difficulty: keyof typeof SCORING_CONFIG = 'medium'): GameState {
    this.state = this.initializeGame(difficulty)
    return this.getGameState()
  }
}