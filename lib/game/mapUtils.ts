import { MAP_CONFIG } from '@/data/maps/mapConfig'

export interface MapRevealState {
  blurIntensity: number
  revealPercentage: number
  isFullyRevealed: boolean
}

export function calculateMapReveal(clueIndex: number, totalClues: number): MapRevealState {
  // Ensure we don't go out of bounds
  const safeIndex = Math.min(clueIndex, MAP_CONFIG.blurLevels.length - 1)
  const blurIntensity = MAP_CONFIG.blurLevels[safeIndex]
  const revealPercentage = MAP_CONFIG.revealPercentages[safeIndex]
  
  console.log('🔄 calculateMapReveal called:', {
    clueIndex,
    totalClues,
    safeIndex,
    blurIntensity,
    revealPercentage
  })
  
  return {
    blurIntensity,
    revealPercentage,
    isFullyRevealed: clueIndex >= totalClues
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