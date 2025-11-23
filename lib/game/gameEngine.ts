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
    
    // Automatically provide first clue (free)
    this.provideFirstClue()
  }

  private initializeGame(difficulty: keyof typeof SCORING_CONFIG): GameState {
    const targetCity = getRandomCity()
    const mapOffset = generateMapOffset()
    
    // Start with clue index 0 (first clue will be automatically provided)
    const mapReveal = calculateMapReveal(0, targetCity.clues.length)
    
    console.log('🎮 Game initialized:', {
      city: targetCity.name,
      totalClues: targetCity.clues.length,
      initialBlur: mapReveal.blurIntensity
    })
    
    return {
      targetCity,
      currentClueIndex: 0, // Will be incremented to 1 after first clue
      usedClues: [],
      attempts: 0,
      score: 0,
      maxPossibleScore: SCORING_CONFIG[difficulty].basePoints,
      isGameOver: false,
      isGameWon: false,
      difficulty,
      mapCenter: {
        lat: targetCity.coordinates.lat + mapOffset.latOffset,
        lng: targetCity.coordinates.lng + mapOffset.lngOffset
      },
      mapOffset,
      mapReveal
    }
  }

  private provideFirstClue(): void {
    // First clue is free - no penalty, automatically provided
    if (this.state.targetCity.clues.length > 0) {
      const firstClue = this.state.targetCity.clues[0]
      this.state.usedClues.push(firstClue)
      this.state.currentClueIndex = 1 // Now we're at first clue
      
      // Update map for first clue state
      this.state.mapReveal = calculateMapReveal(1, this.state.targetCity.clues.length)
      
      console.log('🎁 First clue provided automatically:', {
        clue: firstClue.substring(0, 50) + '...',
        newIndex: this.state.currentClueIndex,
        blur: this.state.mapReveal.blurIntensity
      })
    }
  }

  getCurrentClue(): string | null {
    if (this.state.currentClueIndex >= this.state.targetCity.clues.length) {
      console.log('❌ No more clues available')
      return null
    }
    
    const clue = this.state.targetCity.clues[this.state.currentClueIndex]
    this.state.usedClues.push(clue)
    
    console.log('🔍 Getting clue at index:', this.state.currentClueIndex)
    
    // Update map reveal with CURRENT index (before incrementing)
    this.state.mapReveal = calculateMapReveal(
      this.state.currentClueIndex, 
      this.state.targetCity.clues.length
    )
    
    // Increment index for next call
    this.state.currentClueIndex++
    
    // Update max possible score (first clue was free, so subtract 1)
    const effectiveCluesUsed = Math.max(0, this.state.currentClueIndex - 1)
    this.state.maxPossibleScore = SCORING_CONFIG[this.state.difficulty].basePoints - 
      (effectiveCluesUsed * SCORING_CONFIG[this.state.difficulty].cluePenalty)
    
    console.log('✅ Clue retrieved:', {
      newIndex: this.state.currentClueIndex,
      effectiveCluesUsed,
      blurIntensity: this.state.mapReveal.blurIntensity
    })
    
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
      
      // Calculate final score (first clue is free)
      const effectiveCluesUsed = Math.max(0, this.state.currentClueIndex - 1)
      const wasPerfect = this.state.attempts === 1 && effectiveCluesUsed === 0
      
      this.state.score = calculateScore(
        this.state.difficulty,
        effectiveCluesUsed,
        this.state.attempts,
        wasPerfect
      )

      // Fully reveal the map when game is won
      this.state.mapReveal = {
        blurIntensity: 0,
        revealPercentage: 100,
        isFullyRevealed: true
      }
      
      console.log('🎉 Game won! Score:', this.state.score)
    }

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
    return { ...this.state }
  }

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
    this.provideFirstClue() // Provide first clue for new game too
    return this.getGameState()
  }
}