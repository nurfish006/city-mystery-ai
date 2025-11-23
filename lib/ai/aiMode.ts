export class AIClueGenerator {
  private apiKey: string | null
  private isAvailable: boolean = false

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || null
    this.isAvailable = !!this.apiKey && this.apiKey !== 'your_openai_api_key_here'
    console.log('🤖 AI Generator:', { 
      hasKey: !!this.apiKey, 
      isAvailable: this.isAvailable 
    })
  }

  async checkAvailability(): Promise<boolean> {
    // If no API key or using placeholder, fail immediately
    if (!this.isAvailable) {
      return false
    }
    
    try {
      // Quick timeout for availability check
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)
      
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      return response.status === 200
    } catch (error) {
      console.warn('⚠️ AI service unavailable')
      return false
    }
  }

  // ... rest of the class
}