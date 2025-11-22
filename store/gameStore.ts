import { create } from 'zustand'
import { subscriptionService } from '@/lib/monetization/subscriptionService'
import { adManager } from '@/lib/monetization/adManager'

interface MonetizationState {
  isPremium: boolean
  adsWatchedToday: number
  availableRewards: {
    extraClues: number
    continues: number
  }
  
  // Actions
  checkPremiumStatus: () => Promise<void>
  showRewardedAd: (type: 'clue' | 'continue' | 'bonus') => Promise<boolean>
  grantReward: (type: 'clue' | 'continue' | 'bonus') => void
}

export const useMonetizationStore = create<MonetizationState>((set, get) => ({
  isPremium: false,
  adsWatchedToday: 0,
  availableRewards: {
    extraClues: 0,
    continues: 0
  },

  checkPremiumStatus: async () => {
    console.log('🔍 Checking premium status...')
    // For now, using mock user ID - will be real user ID when auth is implemented
    const isPremium = await subscriptionService.checkPremiumStatus('user-mock-id')
    set({ isPremium })
  },

  showRewardedAd: async (type) => {
    console.log(`🎬 Starting rewarded ad flow for: ${type}`)
    // Mock user ID for now
    const success = await adManager.showRewardedAd('user-mock-id', type)
    if (success) {
      get().grantReward(type)
      set(state => ({ 
        adsWatchedToday: state.adsWatchedToday + 1 
      }))
      console.log(`🎁 Reward granted for: ${type}`)
    }
    return success
  },

  grantReward: (type) => {
    const { availableRewards } = get()
    
    switch (type) {
      case 'clue':
        set({ 
          availableRewards: { 
            ...availableRewards, 
            extraClues: availableRewards.extraClues + 1 
          } 
        })
        break
      case 'continue':
        set({ 
          availableRewards: { 
            ...availableRewards, 
            continues: availableRewards.continues + 1 
          } 
        })
        break
      case 'bonus':
        // Handle daily bonus - could be extra games, etc.
        console.log('🎉 Daily bonus granted!')
        break
    }
  }
}))