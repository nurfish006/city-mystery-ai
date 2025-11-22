'use client'

import { useGameStore } from '@/store/gameStore'

export function ScorePanel() {
  const { gameState } = useGameStore()

  if (!gameState) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Score</h3>
        <p className="text-gray-500">Start a game to see your score</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Game Progress</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Difficulty:</span>
          <span className="font-medium capitalize">{gameState.difficulty}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Current Score:</span>
          <span className="font-medium text-green-600">{gameState.score}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Max Possible:</span>
          <span className="font-medium text-blue-600">{gameState.maxPossibleScore}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Clues Used:</span>
          <span className="font-medium">{gameState.currentClueIndex}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Attempts:</span>
          <span className="font-medium">{gameState.attempts}/5</span>
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status:</span>
            <span className={`font-medium ${
              gameState.isGameOver 
                ? gameState.isGameWon ? 'text-green-600' : 'text-red-600'
                : 'text-blue-600'
            }`}>
              {gameState.isGameOver 
                ? gameState.isGameWon ? 'Completed' : 'Failed'
                : 'In Progress'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}