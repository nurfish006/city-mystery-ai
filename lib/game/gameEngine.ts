import { City, getRandomCity } from '@/lib/utils/citySelect'
import { calculateScore, SCORING_CONFIG } from '@/lib/game/scoring'
import { validateGuess, ValidationResult } from '@/lib/utils/validateGuess'
import { generateMapOffset, calculateMapReveal } from '@/lib/game/mapUtils'
import { Coordinates } from '@/lib/utils/coordinates'

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
  // NEW: Map-related state
  mapCenter: Coordinates
  mapOffset: { latOffset: number; lngOffset: number }
  mapReveal: {
    blurIntensity: number
    revealPercentage: number
    isFullyRevealed: boolean
  }
}

export class GameEngine {
  private state: GameState

  constructor(difficulty: keyof typeof SCORING_CONFIG = 'medium') {
    this.state = this.initializeGame(difficulty)
  }

  private initializeGame(difficulty: keyof typeof SCORING_CONFIG): GameState {
    const targetCity = getRandomCity()
    const mapOffset = generateMapOffset()
    
    // Calculate initial map reveal state
    const mapReveal = calculateMapReveal(0, targetCity.clues.length)
    
    return {
      targetCity,
      currentClueIndex: 0,
      usedClues: [],
      attempts: 0,
      score: 0,
      maxPossibleScore: SCORING_CONFIG[difficulty].basePoints,
      isGameOver: false,
      isGameWon: false,
      difficulty,
      // Map state
      mapCenter: {
        lat: targetCity.coordinates.lat + mapOffset.latOffset,
        lng: targetCity.coordinates.lng + mapOffset.lngOffset
      },
      mapOffset,
      mapReveal
    }
  }

  getCurrentClue(): string | null {
    if (this.state.currentClueIndex >= this.state.targetCity.clues.length) {
      return null
    }
    
    const clue = this.state.targetCity.clues[this.state.currentClueIndex]
    this.state.usedClues.push(clue)
    this.state.currentClueIndex++
    
    // UPDATE: Recalculate map reveal with new clue
    this.state.mapReveal = calculateMapReveal(
      this.state.currentClueIndex, 
      this.state.targetCity.clues.length
    )
    
    // Update max possible score
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

      // Fully reveal the map when game is won
      this.state.mapReveal = {
        blurIntensity: 0,
        revealPercentage: 100,
        isFullyRevealed: true
      }
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

  // NEW: Get map state
  getMapState() {
    return {
      center: this.state.mapCenter,
      offset: this.state.mapOffset,
      reveal: this.state.mapReveal,
      actualCityCoordinates: this.state.targetCity.coordinates
    }
  }

  startNewGame(difficulty: keyof typeof SCORING_CONFIG = 'medium'): GameState {
    this.state = this.initializeGame(difficulty)
    return this.getGameState()
  }
}