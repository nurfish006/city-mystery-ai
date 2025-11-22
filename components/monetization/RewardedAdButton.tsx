'use client'

import { useState } from 'react'
import { useMonetizationStore } from '@/store/gameStore'

interface RewardedAdButtonProps {
  adType: 'clue' | 'continue' | 'bonus'
  onSuccess: () => void
  disabled?: boolean
}

export function RewardedAdButton({ adType, onSuccess, disabled }: RewardedAdButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const showRewardedAd = useMonetizationStore((state) => state.showRewardedAd)
  
  const handleWatchAd = async () => {
    setIsLoading(true)
    const success = await showRewardedAd(adType)
    if (success) {
      onSuccess()
    }
    setIsLoading(false)
  }

  const buttonText = {
    clue: '📺 Watch Ad for Extra Clue',
    continue: '📺 Watch Ad to Continue', 
    bonus: '📺 Watch Ad for Daily Bonus'
  }

  return (
    <button 
      onClick={handleWatchAd}
      disabled={disabled || isLoading}
      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors font-medium"
    >
      {isLoading ? '⏳ Loading Ad...' : buttonText[adType]}
    </button>
  )
}