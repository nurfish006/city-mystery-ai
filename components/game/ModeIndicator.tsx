'use client'

import { useGameStore } from '@/store/gameStore'

export function ModeIndicator() {
  const { clueMode, gameState, checkAIAvailability, switchToOffline } = useGameStore()

  const handleRetryAI = async () => {
    const available = await checkAIAvailability()
    if (available) {
      console.log('✅ AI mode reconnected!')
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Game Status</h3>
      
      <div className="space-y-3">
        {/* Clue Generation Mode */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Clue Generation:</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              clueMode === 'ai' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`} />
            <span className={`text-sm font-medium ${
              clueMode === 'ai' ? 'text-green-600' : 'text-gray-600'
            }`}>
              {clueMode === 'ai' ? 'AI Powered' : 'Offline Mode'}
            </span>
          </div>
        </div>

        {/* Game Mode */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Game Mode:</span>
          <span className="text-sm font-medium text-blue-600 capitalize">
            {gameState?.gameMode || 'world'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-200">
          {clueMode === 'offline' && (
            <button
              onClick={handleRetryAI}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm font-medium transition-colors"
            >
              Retry AI
            </button>
          )}
          <button
            onClick={switchToOffline}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm font-medium transition-colors"
          >
            Force Offline
          </button>
        </div>

        {/* Status Message */}
        <div className="text-xs text-gray-500">
          {clueMode === 'ai' ? (
            <>🤖 AI is generating creative, dynamic clues</>
          ) : (
            <>📚 Using pre-written clues (AI unavailable)</>
          )}
        </div>
      </div>
    </div>
  )
}