import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { cityName, existingClues, guessHistory } = await req.json()

    const prompt = `You are helping a player in a geography guessing game. They are trying to guess: ${cityName}

Existing clues they've seen:
${existingClues.map((clue: string, i: number) => `${i + 1}. ${clue}`).join("\n")}

Their previous wrong guesses: ${guessHistory.length > 0 ? guessHistory.join(", ") : "None yet"}

Generate ONE additional helpful hint that:
- Doesn't directly reveal the city name
- Provides new information not covered in existing clues
- Is specific and actionable
- Helps narrow down the possibilities
- Keep it under 20 words

Return ONLY the hint text, nothing else.`

    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt,
      temperature: 0.7,
      maxOutputTokens: 100,
    })

    return Response.json({ hint: text.trim() })
  } catch (error) {
    console.error("[v0] Error generating hint:", error)
    return Response.json({ error: "Failed to generate hint" }, { status: 500 })
  }
}
