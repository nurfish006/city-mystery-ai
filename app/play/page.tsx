'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { ClueCard } from '@/components/game/ClueCard'
import { GuessInput } from '@/components/game/GuessInput'
import { ScorePanel } from '@/components/game/ScorePanel'
import { MapPreview } from '@/components/game/MapPreview'
import { ModeIndicator } from '@/components/game/ModeIndicator'

export default function PlayPage() {
  const { initializeGame, gameState } = useGameStore()

  useEffect(() => {
    if (!gameState) {
      initializeGame('medium', 'world')
    }
  }, [initializeGame, gameState])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">City Mystery Explorer</h1>
        <p className="text-gray-600">
          Uncover hidden cities with AI-powered clues and interactive maps!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Game Info */}
        <div className="lg:col-span-1 space-y-6">
          <ScorePanel />
          <ModeIndicator />
          
          {/* Enhanced Game Controls */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Game Controls</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => useGameStore.getState().startNewGame('easy', 'world')}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm font-medium transition-colors"
                >
                  Easy World
                </button>
                <button
                  onClick={() => useGameStore.getState().startNewGame('easy', 'ethiopia')}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm font-medium transition-colors"
                >
                  Easy Ethiopia
                </button>
                <button
                  onClick={() => useGameStore.getState().startNewGame('medium', 'world')}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-medium transition-colors"
                >
                  Medium World
                </button>
                <button
                  onClick={() => useGameStore.getState().startNewGame('medium', 'ethiopia')}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-medium transition-colors"
                >
                  Medium Ethiopia
                </button>
                <button
                  onClick={() => useGameStore.getState().startNewGame('hard', 'world')}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm font-medium transition-colors"
                >
                  Hard World
                </button>
                <button
                  onClick={() => useGameStore.getState().startNewGame('hard', 'ethiopia')}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm font-medium transition-colors"
                >
                  Hard Ethiopia
                </button>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={() => useGameStore.getState().revealFullMap()}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded text-sm font-medium transition-colors mb-2"
                >
                  Reveal Full Map
                </button>
                <button
                  onClick={() => useGameStore.getState().checkAIAvailability()}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded text-sm font-medium transition-colors"
                >
                  Check AI Status
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Gameplay */}
        <div className="lg:col-span-3 space-y-6">
          <MapPreview />
          <ClueCard />
          <GuessInput />
          
          {/* Enhanced Game Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💡 How to Play</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• <strong>First clue is free</strong> - use it to start guessing!</li>
              <li>• <strong>AI Mode:</strong> Dynamic, creative clues (when available)</li>
              <li>• <strong>Ethiopia Mode:</strong> Cultural and historical Ethiopian cities</li>
              <li>• <strong>World Mode:</strong> Cities from around the globe</li>
              <li>• Maps reveal more details with each clue</li>
              <li>• Click "Reveal Full Map" after using all clues</li>
              <li>• Fewer clues + attempts = higher score!</li>
            </ul>
          </div>

          {/* Game Status Info */}
          {gameState && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🎮 Current Game</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">City:</span>
                  <span className="font-medium ml-2">???</span>
                </div>
                <div>
                  <span className="text-gray-600">Mode:</span>
                  <span className="font-medium ml-2 capitalize">{gameState.gameMode}</span>
                </div>
                <div>
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium ml-2 capitalize">{gameState.difficulty}</span>
                </div>
                <div>
                  <span className="text-gray-600">Clues:</span>
                  <span className="font-medium ml-2">{gameState.currentClueIndex}/{gameState.targetCity.clues.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Attempts:</span>
                  <span className="font-medium ml-2">{gameState.attempts}/5</span>
                </div>
                <div>
                  <span className="text-gray-600">Map Revealed:</span>
                  <span className="font-medium ml-2">{gameState.mapReveal.revealPercentage}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}