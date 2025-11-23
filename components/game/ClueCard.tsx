'use client'

import { useGameStore } from '@/store/gameStore'

const SCORING_CONFIG = {
  easy: { basePoints: 1000, cluePenalty: 50, attemptPenalty: 20 },
  medium: { basePoints: 1500, cluePenalty: 75, attemptPenalty: 30 },
  hard: { basePoints: 2000, cluePenalty: 100, attemptPenalty: 40 }
} as const

export function ClueCard() {
  const { gameState, currentClue, getNextClue, revealFullMap } = useGameStore()

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
  const canRevealFullMap = allCluesRevealed && !gameState.mapReveal.isFullyRevealed

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
          {gameState.mapReveal.isFullyRevealed && (
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
              Map Revealed
            </span>
          )}
        </div>
      </div>

      {/* Clue Display */}
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
      {!allCluesRevealed && (
        <button
          onClick={getNextClue}
          disabled={!canGetClue || !isGameActive}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mb-3"
        >
          {!isGameActive ? 'Game Finished' : 'Get Next Clue →'}
        </button>
      )}

      {/* Reveal Full Map Button */}
      {canRevealFullMap && (
        <button
          onClick={revealFullMap}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mb-3"
        >
          🗺️ Reveal Full Map
        </button>
      )}

      {/* Map Fully Revealed Message */}
      {gameState.mapReveal.isFullyRevealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 text-center">
          <p className="text-blue-700 font-semibold">🗺️ Map Fully Revealed!</p>
          <p className="text-blue-600 text-sm">The map is now completely clear</p>
        </div>
      )}

      {/* Progress Information */}
      <div className="mt-3 text-sm text-gray-600 space-y-2">
        {/* Map Progress */}
        <div>
          <div className="flex justify-between mb-1">
            <span>Map Revealed:</span>
            <span>{gameState.mapReveal.revealPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${gameState.mapReveal.revealPercentage}%` }}
            />
          </div>
        </div>

        {/* Clue Information */}
        <div className="space-y-1">
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
          {canRevealFullMap && (
            <p className="text-purple-600">
              All clues used! Click to reveal full map
            </p>
          )}
          <p className="text-gray-500">
            Remaining clues: {gameState.targetCity.clues.length - gameState.currentClueIndex}
          </p>
        </div>
      </div>
    </div>
  )
}