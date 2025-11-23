import { City, getRandomCity } from '@/lib/utils/citySelect'
import { calculateScore, SCORING_CONFIG } from '@/lib/game/scoring'
import { validateGuess, ValidationResult } from '@/lib/utils/validateGuess'
import { generateMapOffset, calculateMapReveal } from '@/lib/game/mapUtils'
import { Coordinates } from '@/lib/utils/coordinates'
import { clueManager, ClueGenerationResult, GameMode } from '@/lib/ai/clueManager'

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
  gameMode: GameMode // 'world' | 'ethiopia'
  clueMode: 'ai' | 'offline'
  // Map state
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

  constructor(difficulty: keyof typeof SCORING_CONFIG = 'medium', gameMode: GameMode = 'world') {
    this.state = this.initializeGame(difficulty, gameMode)
    this.provideFirstClue()
  }

  private initializeGame(difficulty: keyof typeof SCORING_CONFIG, gameMode: GameMode): GameState {
    const targetCity = getRandomCity()
    const mapOffset = generateMapOffset()
    
    // Start with clue index 0 (first clue will be automatically provided)
    const mapReveal = calculateMapReveal(0, targetCity.clues.length)
    
    console.log('🎮 Game initialized:', {
      city: targetCity.name,
      totalClues: targetCity.clues.length,
      gameMode,
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
      gameMode,
      clueMode: 'offline', // Will be updated when first clue is generated
      mapCenter: {
        lat: targetCity.coordinates.lat + mapOffset.latOffset,
        lng: targetCity.coordinates.lng + mapOffset.lngOffset
      },
      mapOffset,
      mapReveal
    }
  }

  private async provideFirstClue(): Promise<void> {
    // First clue is free - no penalty, automatically provided
    if (this.state.targetCity.clues.length > 0) {
      try {
        // Use AI/Offline manager to generate first clue
        const result: ClueGenerationResult = await clueManager.generateClue(
          this.state.targetCity,
          0, // First clue index
          this.state.gameMode,
          [] // No previous clues
        )

        this.state.usedClues.push(result.clue)
        this.state.currentClueIndex = 1 // Now we're at first clue
        this.state.clueMode = result.mode
        
        // Update map for first clue state
        this.state.mapReveal = calculateMapReveal(1, this.state.targetCity.clues.length)
        
        console.log('🎁 First clue provided:', {
          mode: result.mode,
          clue: result.clue.substring(0, 50) + '...',
          newIndex: this.state.currentClueIndex,
          blur: this.state.mapReveal.blurIntensity
        })
      } catch (error) {
        console.error('Failed to generate first clue:', error)
        // Fallback to original first clue
        const firstClue = this.state.targetCity.clues[0]
        this.state.usedClues.push(firstClue)
        this.state.currentClueIndex = 1
        this.state.clueMode = 'offline'
        this.state.mapReveal = calculateMapReveal(1, this.state.targetCity.clues.length)
      }
    }
  }

  async getCurrentClue(): Promise<string | null> {
    if (this.state.currentClueIndex >= this.state.targetCity.clues.length) {
      console.log('❌ No more clues available')
      return null
    }

    try {
      // Use AI/Offline manager to generate clue
      const result: ClueGenerationResult = await clueManager.generateClue(
        this.state.targetCity,
        this.state.currentClueIndex,
        this.state.gameMode,
        this.state.usedClues
      )

      this.state.usedClues.push(result.clue)
      this.state.clueMode = result.mode // Update current mode
      
      console.log('🔍 Getting clue at index:', this.state.currentClueIndex, 'mode:', result.mode)
      
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
        blurIntensity: this.state.mapReveal.blurIntensity,
        mode: this.state.clueMode
      })
      
      return result.clue
    } catch (error) {
      console.error('Failed to generate clue:', error)
      // Fallback to original clue system
      const clue = this.state.targetCity.clues[this.state.currentClueIndex]
      this.state.usedClues.push(clue)
      this.state.clueMode = 'offline'
      this.state.currentClueIndex++
      return clue
    }
  }

  revealFullMap(): void {
    if (this.state.currentClueIndex >= this.state.targetCity.clues.length) {
      // Only allow full reveal after all clues are used
      this.state.mapReveal = {
        blurIntensity: 0,
        revealPercentage: 100,
        isFullyRevealed: true
      }
      console.log('🗺️ Full map revealed!')
    } else {
      console.log('❌ Cannot reveal full map - not all clues used yet')
    }
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

  getClueMode(): 'ai' | 'offline' {
    return this.state.clueMode
  }

  getGameMode(): GameMode {
    return this.state.gameMode
  }

  startNewGame(difficulty: keyof typeof SCORING_CONFIG = 'medium', gameMode: GameMode = 'world'): GameState {
    this.state = this.initializeGame(difficulty, gameMode)
    this.provideFirstClue() // Provide first clue for new game too
    return this.getGameState()
  }
}