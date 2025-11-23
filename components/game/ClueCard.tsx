'use client'

import { useGameStore } from '@/store/gameStore'

// Add SCORING_CONFIG directly in the component file
const SCORING_CONFIG = {
  easy: { basePoints: 1000, cluePenalty: 50, attemptPenalty: 20 },
  medium: { basePoints: 1500, cluePenalty: 75, attemptPenalty: 30 },
  hard: { basePoints: 2000, cluePenalty: 100, attemptPenalty: 40 }
} as const

export function ClueCard() {
  const { gameState, currentClue, getNextClue } = useGameStore()

  if (!gameState) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-500">Start a game to see clues</p>
      </div>
    )
  }

  const canGetClue = gameState.currentClueIndex < gameState.targetCity.clues.length
  const allCluesRevealed = !canGetClue
  const isGameActive = !gameState.isGameOver
  const isFirstClue = gameState.currentClueIndex === 1 && currentClue

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Clues</h3>
        <div className="flex gap-2">
          <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
            {gameState.currentClueIndex}/{gameState.targetCity.clues.length} Clues
          </span>
          {isFirstClue && (
            <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
              Free!
            </span>
          )}
        </div>
      </div>

      {/* First clue is always visible from start */}
      {currentClue ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-100 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              {gameState.currentClueIndex}
            </div>
            <div className="flex-1">
              <p className="text-gray-800 text-lg mb-2">{currentClue}</p>
              {isFirstClue && (
                <p className="text-green-600 text-sm flex items-center gap-1">
                  <span>🎁</span>
                  <span>First clue - no points deducted!</span>
                </p>
              )}
              {gameState.currentClueIndex > 1 && (
                <p className="text-orange-600 text-sm">
                  Clue #{gameState.currentClueIndex} - {SCORING_CONFIG[gameState.difficulty].cluePenalty} point penalty
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center mb-4">
          <p className="text-gray-500">Loading first clue...</p>
        </div>
      )}

      {/* Get Next Clue Button */}
      <button
        onClick={getNextClue}
        disabled={!canGetClue || !isGameActive}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {!isGameActive ? 'Game Finished' :
         allCluesRevealed ? 'All Clues Revealed' : 
         'Get Next Clue →'
        }
      </button>

      {/* Clue cost information */}
      <div className="mt-3 text-sm text-gray-600 space-y-1">
        {isFirstClue && (
          <p className="text-green-600 flex items-center gap-1">
            <span>✓</span>
            <span>First clue is free - no point penalty</span>
          </p>
        )}
        {canGetClue && gameState.currentClueIndex >= 1 && (
          <p className="text-orange-600">
            Next clue will cost {SCORING_CONFIG[gameState.difficulty].cluePenalty} points
          </p>
        )}
        <p className="text-gray-500">
          Remaining clues: {gameState.targetCity.clues.length - gameState.currentClueIndex}
        </p>
      </div>
    </div>
  )
}