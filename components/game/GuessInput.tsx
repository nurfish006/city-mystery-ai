'use client'

import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'

export function GuessInput() {
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { gameState, submitGuess } = useGameStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guess.trim() || !gameState || gameState.isGameOver) return

    setIsLoading(true)
    const result = submitGuess(guess)
    
    setFeedback(result.message)
    setGuess('')
    
    setIsLoading(false)
  }

  if (!gameState) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-600">Game not started</p>
      </div>
    )
  }

  if (gameState.isGameOver) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold mb-2">
          {gameState.isGameWon ? '🎉 You Won!' : '💔 Game Over'}
        </p>
        <p className="text-gray-600 mb-4">
          {gameState.isGameWon 
            ? `You guessed ${gameState.targetCity.name} with ${gameState.score} points!`
            : `The city was ${gameState.targetCity.name}. Better luck next time!`
          }
        </p>
        <button
          onClick={() => useGameStore.getState().startNewGame()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
        >
          Play Again
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="guess" className="block text-sm font-medium text-gray-700 mb-2">
            Your Guess
          </label>
          <input
            id="guess"
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter city name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
        
        {feedback && (
          <div className={`p-3 rounded-lg ${
            feedback.includes('🎉') ? 'bg-green-100 text-green-800' : 
            feedback.includes('Close') ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {feedback}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Attempts: {gameState.attempts}/5
          </div>
          <button
            type="submit"
            disabled={!guess.trim() || isLoading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Checking...' : 'Submit Guess'}
          </button>
        </div>
      </form>
    </div>
  )
}