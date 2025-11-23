import { City } from '@/lib/utils/citySelect'

export interface OfflineClueResponse {
  clue: string
  isCultural: boolean
  hintType: 'geographical' | 'historical' | 'cultural' | 'landmark'
}

export class OfflineClueGenerator {
  private worldHintTemplates = [
    "I am known for my {landmark} that attracts millions",
    "My streets echo with the history of {historicalEvent}",
    "Located in {region}, I boast {geographicalFeature}",
    "Famous for {culturalFact}, I stand as a testament to {historicalSignificance}",
    "My skyline is dominated by {architecture} and my culture by {tradition}",
    "The {riverName} flows through me, connecting {connection}",
    "Founded in {year}, I have witnessed {historicalPeriod}",
    "My cuisine is famous for {food}, and my people for {characteristic}"
  ]

  private ethiopiaHintTemplates = [
    "Ancient legends speak of my connection to {mythicalReference}",
    "I am home to {landmark}, a UNESCO World Heritage site",
    "Founded in {year}, my name means '{meaning}' in Amharic",
    "My history is intertwined with {historicalFigure} and {historicalEvent}",
    "Located in {region}, I am known for {culturalSpecialty}",
    "According to the Kebra Nagast, {mythicalStory}",
    "My architecture features {architecturalStyle} from the {dynasty} dynasty",
    "Traditional {craft} has been practiced here for centuries"
  ]

  generateClue(city: City, clueIndex: number, mode: 'world' | 'ethiopia'): OfflineClueResponse {
    const templates = mode === 'ethiopia' ? this.ethiopiaHintTemplates : this.worldHintTemplates
    const templateIndex = clueIndex % templates.length
    const template = templates[templateIndex]
    
    const clue = this.fillTemplate(template, city, mode)
    
    return {
      clue,
      isCultural: mode === 'ethiopia',
      hintType: this.determineHintType(clueIndex)
    }
  }

  private fillTemplate(template: string, city: any, mode: 'world' | 'ethiopia'): string {
    const replacements: Record<string, string> = {
      '{landmark}': city.landmarks?.[0] || 'ancient monuments',
      '{historicalEvent}': 'centuries of history',
      '{region}': city.region || 'a famous region',
      '{geographicalFeature}': 'breathtaking landscapes',
      '{culturalFact}': city.culturalFacts?.[0] || 'rich traditions',
      '{historicalSignificance}': city.historicalSignificance || 'historical importance',
      '{architecture}': 'unique structures',
      '{tradition}': 'cultural heritage',
      '{riverName}': 'a mighty river',
      '{connection}': 'ancient trade routes',
      '{year}': 'ancient times',
      '{historicalPeriod}': 'many civilizations',
      '{food}': 'delicious local dishes',
      '{characteristic}': 'warm hospitality'
    }

    if (mode === 'ethiopia') {
      const ethiopiaReplacements: Record<string, string> = {
        '{mythicalReference}': this.getRandomMythicalReference(),
        '{meaning}': city.name === 'Addis Ababa' ? 'New Flower' : 'ancient meaning',
        '{historicalFigure}': 'great emperors',
        '{historicalEvent}': 'imperial history',
        '{culturalSpecialty}': city.culturalFacts?.[0] || 'cultural heritage',
        '{mythicalStory}': this.getRandomMythicalStory(),
        '{architecturalStyle}': 'rock-hewn',
        '{dynasty}': 'Solomonic',
        '{craft}': 'traditional weaving'
      }
      Object.assign(replacements, ethiopiaReplacements)
    }

    let result = template
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(key, value)
    }

    return result
  }

  private getRandomMythicalReference(): string {
    const references = [
      "the Queen of Sheba", "King Solomon", "the Ark of the Covenant",
      "ancient saints", "biblical figures", "Ethiopian emperors"
    ]
    return references[Math.floor(Math.random() * references.length)]
  }

  private getRandomMythicalStory(): string {
    const stories = [
      "this was a holy site", "angels guided construction here",
      "this place was blessed by saints", "ancient prophecies were fulfilled here"
    ]
    return stories[Math.floor(Math.random() * stories.length)]
  }

  private determineHintType(clueIndex: number): OfflineClueResponse['hintType'] {
    const types: OfflineClueResponse['hintType'][] = ['geographical', 'historical', 'cultural', 'landmark']
    return types[clueIndex % types.length]
  }
}

// Singleton instance
export const offlineClueGenerator = new OfflineClueGenerator()