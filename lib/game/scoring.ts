export const SCORING_CONFIG = {
  easy: { basePoints: 1000, cluePenalty: 50, attemptPenalty: 20 },
  medium: { basePoints: 1500, cluePenalty: 75, attemptPenalty: 30 },
  hard: { basePoints: 2000, cluePenalty: 100, attemptPenalty: 40 }
} as const

export function calculateScore(
  difficulty: keyof typeof SCORING_CONFIG,
  cluesUsed: number, // This should already account for first clue being free
  attempts: number,
  wasPerfect: boolean
): number {
  const config = SCORING_CONFIG[difficulty]
  
  let score = config.basePoints
  score -= cluesUsed * config.cluePenalty
  score -= (attempts - 1) * config.attemptPenalty
  
  // Ensure score doesn't go below 0
  score = Math.max(0, score)
  
  // Bonus for perfect game (first attempt, no additional clues beyond free one)
  if (wasPerfect) {
    score += 500
  }
  
  console.log('💰 Score calculation:', {
    difficulty,
    cluesUsed,
    attempts,
    base: config.basePoints,
    finalScore: score,
    perfectBonus: wasPerfect ? 500 : 0
  })
  
  return score
}