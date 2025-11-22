export interface ScoreConfig {
  basePoints: number
  cluePenalty: number
  attemptPenalty: number
  perfectBonus: number
}

export const SCORING_CONFIG = {
  easy: {
    basePoints: 100,
    cluePenalty: 20,    // Points lost per clue used
    attemptPenalty: 10, // Points lost per wrong guess
    perfectBonus: 50    // Bonus for guessing with first clue
  },
  medium: {
    basePoints: 150, 
    cluePenalty: 30,
    attemptPenalty: 15,
    perfectBonus: 75
  },
  hard: {
    basePoints: 200,
    cluePenalty: 40,
    attemptPenalty: 20, 
    perfectBonus: 100
  }
} as const

export function calculateScore(
  difficulty: keyof typeof SCORING_CONFIG,
  cluesUsed: number,
  attempts: number,
  wasPerfect: boolean
): number {
  const config = SCORING_CONFIG[difficulty]
  
  let score = config.basePoints
  score -= cluesUsed * config.cluePenalty
  score -= (attempts - 1) * config.attemptPenalty // First attempt doesn't count as penalty
  
  if (wasPerfect) {
    score += config.perfectBonus
  }
  
  // Ensure score doesn't go below minimum
  return Math.max(score, 10)
}

export function getMaxPossibleScore(difficulty: keyof typeof SCORING_CONFIG, cluesUsed: number): number {
  const config = SCORING_CONFIG[difficulty]
  return config.basePoints - (cluesUsed * config.cluePenalty) + config.perfectBonus
}