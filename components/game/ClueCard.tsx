'use client'

import { useGameStore } from '@/store/gameStore'

export function ClueCard() {
  const { currentClue, gameState, getNextClue, getRemainingClues } = useGameStore()
  
  const remainingClues = getRemainingClues()
  
  if (!currentClue) {
    return (
      <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-6 text-center">
        <p className="text-yellow-800">No more clues available!</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Current Clue</h3>
        <div className="flex gap-2">
          <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
            Clue {gameState?.currentClueIndex}/{gameState?.targetCity.clues.length}
          </span>
          <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
            {remainingClues} left
          </span>
        </div>
      </div>
      
      <p className="text-gray-700 text-lg mb-4 italic">"{currentClue}"</p>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Max possible score: {gameState?.maxPossibleScore}
        </p>
        
        {remainingClues > 0 && (
          <button
            onClick={getNextClue}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Get Another Clue (-{gameState ? 20 : 0} points)
          </button>
        )}
      </div>
    </div>
  )
}