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
  gameMode: GameMode
  clueMode: 'ai' | 'offline'
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
    // Don't wait for AI - provide first clue immediately
    this.provideFirstClue()
  }

  private initializeGame(difficulty: keyof typeof SCORING_CONFIG, gameMode: GameMode): GameState {
    const targetCity = getRandomCity()
    const mapOffset = generateMapOffset()
    
    // Use Ethiopian coordinates for Ethiopia mode
    let mapCenter: Coordinates
    if (gameMode === 'ethiopia') {
      // Center map on Ethiopia
      mapCenter = {
        lat: 9.1450 + mapOffset.latOffset, // Ethiopia center latitude
        lng: 40.4897 + mapOffset.lngOffset  // Ethiopia center longitude
      }
    } else {
      // Use city coordinates for world mode
      mapCenter = {
        lat: targetCity.coordinates.lat + mapOffset.latOffset,
        lng: targetCity.coordinates.lng + mapOffset.lngOffset
      }
    }
    
    const mapReveal = calculateMapReveal(0, targetCity.clues.length)
    
    console.log('🎮 Game initialized:', {
      city: targetCity.name,
      gameMode,
      mapCenter,
      totalClues: targetCity.clues.length
    })
    
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
      gameMode,
      clueMode: 'offline',
      mapCenter,
      mapOffset,
      mapReveal
    }
  }

  private async provideFirstClue(): Promise<void> {
    if (this.state.targetCity.clues.length > 0) {
      try {
        // Try AI first, but don't wait long
        const aiPromise = clueManager.generateClue(
          this.state.targetCity,
          0,
          this.state.gameMode,
          []
        )
        
        // Set a timeout to fallback quickly
        const timeoutPromise = new Promise<ClueGenerationResult>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 1000)
        )
        
        const result = await Promise.race([aiPromise, timeoutPromise])
        
        this.state.usedClues.push(result.clue)
        this.state.currentClueIndex = 1
        this.state.clueMode = result.mode
        
        console.log('🎁 First clue provided (AI):', {
          mode: result.mode,
          clue: result.clue.substring(0, 30) + '...'
        })
      } catch (error) {
        // Fallback to offline clue immediately
        const fallbackClue = this.getFallbackClue(0)
        this.state.usedClues.push(fallbackClue)
        this.state.currentClueIndex = 1
        this.state.clueMode = 'offline'
        
        console.log('🎁 First clue provided (Offline):', {
          clue: fallbackClue.substring(0, 30) + '...'
        })
      }
      
      // Update map for first clue
      this.state.mapReveal = calculateMapReveal(1, this.state.targetCity.clues.length)
    }
  }

  private getFallbackClue(clueIndex: number): string {
    const { targetCity, gameMode } = this.state
    
    if (gameMode === 'ethiopia') {
      const ethiopiaClues = [
        `Ancient city with rich cultural heritage`,
        `Known for historical significance in Ethiopian history`,
        `Home to remarkable architecture and traditions`,
        `A place where ancient and modern Ethiopia meet`
      ]
      return ethiopiaClues[clueIndex % ethiopiaClues.length]
    } else {
      const worldClues = [
        `A city with deep historical roots`,
        `Famous for its cultural landmarks`,
        `Known for unique geographical features`,
        `A place where tradition meets modernity`
      ]
      return worldClues[clueIndex % worldClues.length]
    }
  }

  async getCurrentClue(): Promise<string | null> {
    if (this.state.currentClueIndex >= this.state.targetCity.clues.length) {
      return null
    }

    try {
      const result = await clueManager.generateClue(
        this.state.targetCity,
        this.state.currentClueIndex,
        this.state.gameMode,
        this.state.usedClues
      )

      this.state.usedClues.push(result.clue)
      this.state.clueMode = result.mode
      
      // Update map reveal
      this.state.mapReveal = calculateMapReveal(
        this.state.currentClueIndex, 
        this.state.targetCity.clues.length
      )
      
      this.state.currentClueIndex++
      
      // Update score
      const effectiveCluesUsed = Math.max(0, this.state.currentClueIndex - 1)
      this.state.maxPossibleScore = SCORING_CONFIG[this.state.difficulty].basePoints - 
        (effectiveCluesUsed * SCORING_CONFIG[this.state.difficulty].cluePenalty)
      
      return result.clue
    } catch (error) {
      // Fallback to offline clue
      const fallbackClue = this.getFallbackClue(this.state.currentClueIndex)
      this.state.usedClues.push(fallbackClue)
      this.state.clueMode = 'offline'
      this.state.currentClueIndex++
      return fallbackClue
    }
  }

  revealFullMap(): void {
    if (this.state.currentClueIndex >= this.state.targetCity.clues.length) {
      this.state.mapReveal = {
        blurIntensity: 0,
        revealPercentage: 100,
        isFullyRevealed: true
      }
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
      
      const effectiveCluesUsed = Math.max(0, this.state.currentClueIndex - 1)
      const wasPerfect = this.state.attempts === 1 && effectiveCluesUsed === 0
      
      this.state.score = calculateScore(
        this.state.difficulty,
        effectiveCluesUsed,
        this.state.attempts,
        wasPerfect
      )

      // Reveal map when won
      this.state.mapReveal = {
        blurIntensity: 0,
        revealPercentage: 100,
        isFullyRevealed: true
      }
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
    this.provideFirstClue()
    return this.getGameState()
  }
}