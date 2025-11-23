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
  }

  private initializeGame(difficulty: keyof typeof SCORING_CONFIG): GameState {
    const targetCity = getRandomCity()
    const mapOffset = generateMapOffset()
    
    // Calculate initial map reveal state - START WITH CLUE INDEX 0
    const mapReveal = calculateMapReveal(0, targetCity.clues.length)
    
    console.log('🎮 Game initialized:', {
      city: targetCity.name,
      totalClues: targetCity.clues.length,
      initialBlur: mapReveal.blurIntensity
    })
    
    return {
      targetCity,
      currentClueIndex: 0, // Start at 0, not 1
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

getCurrentClue(): string | null {
  if (this.state.currentClueIndex >= this.state.targetCity.clues.length) {
    console.log('❌ No more clues available - current index:', this.state.currentClueIndex, 'total clues:', this.state.targetCity.clues.length)
    return null
  }
  
  const clue = this.state.targetCity.clues[this.state.currentClueIndex]
  this.state.usedClues.push(clue)
  
  console.log('🔍 Getting clue at index:', this.state.currentClueIndex, 'clue:', clue.substring(0, 50) + '...')
  
  // FIRST increment the index so we're ready for next clue
  this.state.currentClueIndex++
  
  // NOW update map reveal with the NEW index (after incrementing)
  // This ensures the blur matches the clue the user just received
  this.state.mapReveal = calculateMapReveal(
    this.state.currentClueIndex, 
    this.state.targetCity.clues.length
  )
  
  // Update max possible score
  this.state.maxPossibleScore = SCORING_CONFIG[this.state.difficulty].basePoints - 
    (this.state.currentClueIndex * SCORING_CONFIG[this.state.difficulty].cluePenalty)
  
  console.log('✅ Clue retrieved:', {
    newIndex: this.state.currentClueIndex,
    blurIntensity: this.state.mapReveal.blurIntensity,
    revealPercentage: this.state.mapReveal.revealPercentage,
    clueLength: clue.length
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
      
      console.log('🎉 Game won! Map fully revealed')
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
    return this.getGameState()
  }
}