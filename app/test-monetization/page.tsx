'use client'

import { useMonetizationStore } from '@/store/gameStore'
import { RewardedAdButton } from '@/components/monetization/RewardedAdButton'

export default function TestMonetizationPage() {
  const { 
    isPremium, 
    adsWatchedToday, 
    availableRewards,
    checkPremiumStatus 
  } = useMonetizationStore()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Monetization Test</h1>
      
      <div className="space-y-4 mb-6">
        <div>Premium Status: {isPremium ? '✅ Premium' : '❌ Free Tier'}</div>
        <div>Ads Watched Today: {adsWatchedToday}</div>
        <div>Available Extra Clues: {availableRewards.extraClues}</div>
        <div>Available Continues: {availableRewards.continues}</div>
      </div>

      <div className="space-y-2">
        <RewardedAdButton 
          adType="clue" 
          onSuccess={() => console.log('Extra clue granted!')} 
        />
        <RewardedAdButton 
          adType="continue" 
          onSuccess={() => console.log('Continue granted!')} 
        />
        <button 
          onClick={checkPremiumStatus}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Check Premium Status
        </button>
      </div>
    </div>
  )
}