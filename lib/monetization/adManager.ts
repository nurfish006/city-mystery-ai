export class AdManager {
  private adsWatched: Map<string, number> = new Map()

  async showRewardedAd(userId: string, adType: 'clue' | 'continue' | 'bonus'): Promise<boolean> {
    console.log(`📺 Showing rewarded ad for ${adType} to user ${userId}`)
    
    // Simulate ad viewing delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Track ad watch
    const currentCount = this.adsWatched.get(userId) || 0
    this.adsWatched.set(userId, currentCount + 1)
    
    console.log(`✅ Rewarded ad completed successfully for ${adType}`)
    return true // Always succeed in mock
  }

  getAdsWatchedToday(userId: string): number {
    return this.adsWatched.get(userId) || 0
  }

  resetDailyCounts() {
    console.log('🔄 Resetting daily ad counts')
    this.adsWatched.clear()
  }
}

// Export a singleton instance
export const adManager = new AdManager()