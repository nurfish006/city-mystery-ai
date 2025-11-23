import { City } from '@/lib/utils/citySelect'

export interface AIClueRequest {
  city: City
  clueIndex: number
  mode: 'world' | 'ethiopia'
  previousClues?: string[]
}

export interface AIClueResponse {
  clue: string
  isCultural?: boolean
  hintType: 'geographical' | 'historical' | 'cultural' | 'landmark'
}

export class AIClueGenerator {
  private apiKey: string | null
  private isAvailable: boolean = false

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || null
    this.isAvailable = !!this.apiKey
  }

  async checkAvailability(): Promise<boolean> {
    if (!this.isAvailable) return false
    
    try {
      // Simple check to see if we can reach OpenAI
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })
      return response.status === 200
    } catch (error) {
      console.warn('⚠️ AI service unavailable, falling back to offline mode')
      return false
    }
  }

  async generateClue(request: AIClueRequest): Promise<AIClueResponse> {
    if (!this.isAvailable) {
      throw new Error('AI service not available')
    }

    try {
      const prompt = this.buildPrompt(request)
      const clue = await this.callOpenAI(prompt)
      
      return {
        clue,
        isCultural: request.mode === 'ethiopia',
        hintType: this.determineHintType(request.clueIndex)
      }
    } catch (error) {
      console.error('❌ AI clue generation failed:', error)
      throw new Error('Failed to generate AI clue')
    }
  }

  private buildPrompt(request: AIClueRequest): string {
    const { city, clueIndex, mode, previousClues = [] } = request
    
    const difficultyLevels = [
      "very cryptic and mysterious",
      "somewhat revealing but still challenging", 
      "quite informative but not obvious",
      "fairly direct but maintain some mystery"
    ]

    const culturalContext = mode === 'ethiopia' ? 
      `Focus on Ethiopian history, mythology, and cultural significance. 
       Include references to ancient kingdoms, religious significance, or local folklore.
       Make it educational about Ethiopian heritage.` :
      `Focus on geographical features, famous landmarks, and historical significance.`

    return `
      Generate a ${difficultyLevels[clueIndex]} clue for the city ${city.name}, ${city.country}.
      
      CONTEXT:
      - Mode: ${mode}
      - Clue number: ${clueIndex + 1} of 4
      - Previous clues: ${previousClues.join('; ') || 'None'}
      - Cultural focus: ${culturalContext}
      
      REQUIREMENTS:
      - Make it engaging and mysterious
      - Don't mention the city or country name directly
      - Vague for early clues, more specific for later clues
      - For Ethiopia mode, include cultural/historical references
      - Keep it 1-2 sentences maximum
      
      Generate only the clue text, no explanations.
    `.trim()
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const { OpenAI } = await import('openai')
    
    const openai = new OpenAI({
      apiKey: this.apiKey!,
    })

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a creative puzzle master generating engaging geographical and cultural clues. Always respond with just the clue text, no explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 100,
      temperature: 0.8 + (Math.random() * 0.3) // Add some creativity variance
    })

    return completion.choices[0]?.message?.content?.trim() || "I hold ancient secrets within my walls..."
  }

  private determineHintType(clueIndex: number): AIClueResponse['hintType'] {
    const types: AIClueResponse['hintType'][] = ['geographical', 'historical', 'cultural', 'landmark']
    return types[clueIndex % types.length]
  }
}

// Singleton instance
export const aiClueGenerator = new AIClueGenerator()