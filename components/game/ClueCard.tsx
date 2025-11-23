'use client'

import { useGameStore } from '@/store/gameStore'

export function ClueCard() {
  const { gameState, currentClue, getNextClue } = useGameStore()

  if (!gameState) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-500">Start a game to see clues</p>
      </div>
    )
  }

  console.log('🔍 ClueCard rendering:', {
    currentClueIndex: gameState.currentClueIndex,
    totalClues: gameState.targetCity.clues.length,
    currentClue: currentClue,
    canGetClue: gameState.currentClueIndex < gameState.targetCity.clues.length
  })

  const canGetClue = gameState.currentClueIndex < gameState.targetCity.clues.length
  const allCluesRevealed = !canGetClue
  const isGameActive = !gameState.isGameOver

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Clues</h3>
        <div className="flex gap-2">
          <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
            {gameState.currentClueIndex}/{gameState.targetCity.clues.length} Clues
          </span>
        </div>
      </div>

      {/* Display current clue or empty state */}
      {currentClue ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-100 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              {gameState.currentClueIndex}
            </div>
            <p className="text-gray-800 text-lg">{currentClue}</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center mb-4">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-gray-500 mb-2">No clues revealed yet</p>
          <p className="text-gray-400 text-sm">Click the button below to get your first clue</p>
        </div>
      )}

      {/* Get Clue Button */}
      <button
        onClick={getNextClue}
        disabled={!canGetClue || !isGameActive}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {!isGameActive ? 'Game Finished' :
         allCluesRevealed ? 'All Clues Revealed' : 
         currentClue ? 'Get Next Clue' : 'Get First Clue'
        }
        {canGetClue && isGameActive && '→'}
      </button>

      {/* Progress indicator */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Clue Progress</span>
          <span>{gameState.currentClueIndex} of {gameState.targetCity.clues.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(gameState.currentClueIndex / gameState.targetCity.clues.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Debug info - you can remove this after it works */}
    </div>
  )
}