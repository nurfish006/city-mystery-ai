import { MAP_CONFIG } from '@/data/maps/mapConfig'

export interface MapRevealState {
  blurIntensity: number
  revealPercentage: number
  isFullyRevealed: boolean
}

export function calculateMapReveal(clueIndex: number, totalClues: number): MapRevealState {
  // For 4 clues, we have 5 states (including full reveal)
  const safeIndex = Math.min(clueIndex, MAP_CONFIG.blurLevels.length - 1)
  const blurIntensity = MAP_CONFIG.blurLevels[safeIndex]
  const revealPercentage = MAP_CONFIG.revealPercentages[safeIndex]
  
  console.log('🔄 calculateMapReveal:', {
    clueIndex,
    totalClues,
    safeIndex,
    blurIntensity,
    revealPercentage,
    state: clueIndex <= totalClues ? `After ${clueIndex} clue(s)` : 'Full reveal'
  })
  
  return {
    blurIntensity,
    revealPercentage,
    isFullyRevealed: false // This will be set to true only by revealFullMap
  }
}

export function generateMapOffset(): { latOffset: number; lngOffset: number } {
  const latOffset = (Math.random() - 0.5) * 3
  const lngOffset = (Math.random() - 0.5) * 3
  return { latOffset, lngOffset }
}

export function calculateZoomLevel(clueIndex: number, totalClues: number): number {
  const baseZoom = MAP_CONFIG.initialZoom
  const maxZoom = MAP_CONFIG.maxZoom
  const progress = clueIndex / totalClues
  return baseZoom + (maxZoom - baseZoom) * progress
}