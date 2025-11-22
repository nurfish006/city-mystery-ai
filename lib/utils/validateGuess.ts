import { City } from './citySelect'

export interface ValidationResult {
  isCorrect: boolean
  isClose: boolean
  message: string
  correctCity?: string
}

export function validateGuess(userGuess: string, targetCity: City): ValidationResult {
  const normalizedGuess = userGuess.toLowerCase().trim()
  const normalizedTarget = targetCity.name.toLowerCase()
  
  // Exact match
  if (normalizedGuess === normalizedTarget) {
    return {
      isCorrect: true,
      isClose: false,
      message: "🎉 Perfect! You guessed it right!",
      correctCity: targetCity.name
    }
  }
  
  // Partial match (contains target or target contains guess)
  if (normalizedGuess.includes(normalizedTarget) || normalizedTarget.includes(normalizedGuess)) {
    return {
      isCorrect: false,
      isClose: true,
      message: "Close! But not quite right. Try again!",
      correctCity: undefined
    }
  }
  
  // Check if guess matches any hints
  const hintMatch = targetCity.hints.some(hint => 
    normalizedGuess.includes(hint.toLowerCase()) || hint.toLowerCase().includes(normalizedGuess)
  )
  
  if (hintMatch) {
    return {
      isCorrect: false,
      isClose: true,
      message: "You're on the right track! Think about famous landmarks...",
      correctCity: undefined
    }
  }
  
  // Check country match
  if (normalizedGuess === targetCity.country.toLowerCase()) {
    return {
      isCorrect: false,
      isClose: true,
      message: `Right country! Now guess the city in ${targetCity.country}`,
      correctCity: undefined
    }
  }
  
  // No match
  return {
    isCorrect: false,
    isClose: false,
    message: "Not quite. Try another approach or get another clue!",
    correctCity: undefined
  }
}