import { generateObject } from "ai"
import { z } from "zod"

const citySchema = z.object({
  name: z.string().describe("The name of a real city"),
  country: z.string().describe("The country where the city is located"),
  region: z.string().describe("The region or continent"),
  coordinates: z.object({
    lat: z.number().min(-90).max(90).describe("Latitude"),
    lng: z.number().min(-180).max(180).describe("Longitude"),
  }),
  clues: z
    .array(z.string())
    .length(4)
    .describe(
      "Four progressive clues: 1) Very vague historical/cultural fact, 2) Geographic/climate hint, 3) Famous landmark or feature, 4) Almost obvious description",
    ),
  hints: z.array(z.string()).length(2).describe("Two additional helpful hints"),
})

export async function POST(req: Request) {
  try {
    const { difficulty, theme } = await req.json()

    const difficultyPrompts: Record<string, string> = {
      easy: "a well-known major city (like Tokyo, Paris, New York)",
      medium: "a moderately famous city (like Porto, Reykjavik, Adelaide)",
      hard: "an obscure or less famous city (like Gjirokastër, Shimla, Timbuktu)",
    }

    const themeContext =
      theme === "ethiopia"
        ? "Choose a city from Ethiopia (like Addis Ababa, Lalibela, Axum, Gondar, Harar, etc.)"
        : "Choose any city from around the world"

    const prompt = `Generate a mystery city for a geography guessing game.
    
${themeContext}
Difficulty: ${difficultyPrompts[difficulty || "medium"]}

Requirements:
- The city must be real and have accurate coordinates
- Clue 1: Very vague (historical era, general culture, or abstract description)
- Clue 2: Geographic or climate information (terrain, weather, nearby features)
- Clue 3: Famous landmark, building, or well-known feature
- Clue 4: Almost reveals the answer (very specific detail)
- All clues should progressively narrow down the answer
- Hints should be helpful but not give away the answer`

    const { object } = await generateObject({
      model: "openai/gpt-5",
      schema: citySchema,
      prompt,
      temperature: 0.8,
    })

    // Generate unique ID
    const city = {
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...object,
    }

    return Response.json({ city })
  } catch (error) {
    console.error("Nurfish006 Error generating city:", error)
    return Response.json({ error: "Failed to generate city" }, { status: 500 })
  }
}
