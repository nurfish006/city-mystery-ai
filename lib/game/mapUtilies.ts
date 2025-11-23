import { MAP_CONFIG } from '@/data/maps/mapConfig'

export interface MapRevealState {
  blurIntensity: number
  revealPercentage: number
  isFullyRevealed: boolean
}

/**
 * Calculate map reveal state based on clue index
 */
export function calculateMapReveal(clueIndex: number, totalClues: number): MapRevealState {
  const progress = Math.min(clueIndex / totalClues, 1)
  
  // Get blur level for current clue index
  const blurIntensity = MAP_CONFIG.blurLevels[Math.min(clueIndex, MAP_CONFIG.blurLevels.length - 1)]
  
  // Calculate how much of the map is revealed
  const revealPercentage = MAP_CONFIG.revealPercentages[Math.min(clueIndex, MAP_CONFIG.revealPercentages.length - 1)]
  
  return {
    blurIntensity,
    revealPercentage,
    isFullyRevealed: clueIndex >= totalClues - 1
  }
}

/**
 * Generate random offset to make guessing harder
 * Adds slight variance to the map center
 */
export function generateMapOffset(): { latOffset: number; lngOffset: number } {
  // Random offset between -1.5 and 1.5 degrees
  const latOffset = (Math.random() - 0.5) * 3
  const lngOffset = (Math.random() - 0.5) * 3
  return { latOffset, lngOffset }
}

/**
 * Calculate appropriate zoom level based on clue progress
 */
export function calculateZoomLevel(clueIndex: number, totalClues: number): number {
  const baseZoom = MAP_CONFIG.initialZoom
  const maxZoom = MAP_CONFIG.maxZoom
  const progress = clueIndex / totalClues
  
  // Zoom in progressively as clues are revealed
  return baseZoom + (maxZoom - baseZoom) * progress
}