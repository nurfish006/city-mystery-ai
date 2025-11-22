'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { ClueCard } from '@/components/game/ClueCard'
import { GuessInput } from '@/components/game/GuessInput'
import { ScorePanel } from '@/components/game/ScorePanel'

export default function PlayPage() {
  const { initializeGame, gameState } = useGameStore()

  useEffect(() => {
    // Initialize game when component mounts
    if (!gameState) {
      initializeGame('medium')
    }
  }, [initializeGame, gameState])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">City Mystery Explorer</h1>
        <p className="text-gray-600">
          Uncover the hidden city through cryptic clues. Choose wisely - each clue costs points!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Game Info */}
        <div className="lg:col-span-1 space-y-6">
          <ScorePanel />
          
          {/* Game Controls */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Game Controls</h3>
            <div className="space-y-3">
              <button
                onClick={() => useGameStore.getState().startNewGame('easy')}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                New Easy Game
              </button>
              <button
                onClick={() => useGameStore.getState().startNewGame('medium')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                New Medium Game
              </button>
              <button
                onClick={() => useGameStore.getState().startNewGame('hard')}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                New Hard Game
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Gameplay */}
        <div className="lg:col-span-2 space-y-6">
          <ClueCard />
          <GuessInput />
          
          {/* Game Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tips</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Guess early for maximum points</li>
              <li>• Each clue reduces your potential score</li>
              <li>• Wrong guesses don't cost points, but limit attempts</li>
              <li>• Perfect guess with first clue earns bonus!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}