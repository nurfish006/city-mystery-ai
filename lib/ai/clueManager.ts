import { City } from '@/lib/utils/citySelect'
import { aiClueGenerator, AIClueResponse } from './aiMode'
import { offlineClueGenerator, OfflineClueResponse } from './offlineMode'

export type ClueMode = 'ai' | 'offline'
export type GameMode = 'world' | 'ethiopia'

export interface ClueGenerationResult {
  clue: string
  mode: ClueMode
  isCultural?: boolean
  hintType: string
  timestamp: Date
}

export class ClueManager {
  private currentMode: ClueMode = 'offline'
  private aiAvailabilityChecked: boolean = false

  async initialize(): Promise<void> {
    if (!this.aiAvailabilityChecked) {
      this.currentMode = await aiClueGenerator.checkAvailability() ? 'ai' : 'offline'
      this.aiAvailabilityChecked = true
      console.log(`🔧 Clue Manager initialized in ${this.currentMode.toUpperCase()} mode`)
    }
  }

  async generateClue(
    city: City, 
    clueIndex: number, 
    gameMode: GameMode = 'world',
    previousClues: string[] = []
  ): Promise<ClueGenerationResult> {
    // Ensure we're initialized
    if (!this.aiAvailabilityChecked) {
      await this.initialize()
    }

    try {
      if (this.currentMode === 'ai') {
        const aiResult = await aiClueGenerator.generateClue({
          city,
          clueIndex,
          mode: gameMode,
          previousClues
        })
        
        return {
          ...aiResult,
          mode: 'ai',
          timestamp: new Date()
        }
      }
    } catch (error) {
      console.warn('⚠️ AI generation failed, falling back to offline mode')
      this.currentMode = 'offline'
    }

    // Use offline mode (fallback or primary)
    const offlineResult = offlineClueGenerator.generateClue(city, clueIndex, gameMode)
    
    return {
      ...offlineResult,
      mode: 'offline',
      timestamp: new Date()
    }
  }

  getCurrentMode(): ClueMode {
    return this.currentMode
  }

  async switchToOffline(): Promise<void> {
    this.currentMode = 'offline'
    console.log('🔄 Manually switched to OFFLINE mode')
  }

  async retryAIConnection(): Promise<boolean> {
    const available = await aiClueGenerator.checkAvailability()
    if (available) {
      this.currentMode = 'ai'
      console.log('🔄 Successfully reconnected to AI mode')
    }
    return available
  }
}

// Singleton instance
export const clueManager = new ClueManager()