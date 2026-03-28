import Anthropic from '@anthropic-ai/sdk'

let anthropicInstance: Anthropic | null = null

export function getAnthropic(): Anthropic {
  if (!anthropicInstance) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not defined')
    }
    anthropicInstance = new Anthropic({ apiKey })
  }
  return anthropicInstance
}

export interface FreeNameResponse {
  names: Array<{
    name: string
    description: string
  }>
}

export interface PremiumNameResponse {
  names: Array<{
    name: string
    domain: string
    tagline: string
    logoStyle: string
    description: string
  }>
}

export async function generateFreeNames(
  industry: string,
  keywords: string,
  style: string
): Promise<FreeNameResponse> {
  const client = getAnthropic()

  const prompt = `Generate 10 creative business names for a company in the ${industry} industry.

Business focus/keywords: ${keywords}
Naming style preference: ${style}

For each name, provide a very brief one-sentence description explaining why it's a good fit.

Return the response as valid JSON with this exact structure:
{
  "names": [
    {
      "name": "Business Name",
      "description": "Brief explanation"
    }
  ]
}

Ensure the JSON is valid and parseable. Generate exactly 10 names.`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const responseText =
    message.content[0].type === 'text' ? message.content[0].text : ''

  // Parse JSON from response, handling markdown code blocks
  let jsonStr = responseText
  const jsonMatch = responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/)
  if (jsonMatch) {
    jsonStr = jsonMatch[1]
  }

  try {
    const parsed = JSON.parse(jsonStr)
    return parsed as FreeNameResponse
  } catch (error) {
    console.error('Failed to parse response:', responseText)
    throw new Error('Failed to generate business names')
  }
}

export async function generatePremiumNames(
  industry: string,
  keywords: string,
  style: string
): Promise<PremiumNameResponse> {
  const client = getAnthropic()

  const prompt = `Generate 50 creative business names for a company in the ${industry} industry.

Business focus/keywords: ${keywords}
Naming style preference: ${style}

For each name, provide:
1. The business name itself
2. A potential domain hint (e.g., "domain.com available" or "domain.io alternative")
3. A compelling tagline (5-10 words)
4. A logo style suggestion (e.g., "Minimalist geometric", "Hand-drawn organic", etc.)
5. A one-sentence description

Return the response as valid JSON with this exact structure:
{
  "names": [
    {
      "name": "Business Name",
      "domain": "businessname.com or alternative",
      "tagline": "Catchy tagline here",
      "logoStyle": "Logo style description",
      "description": "One sentence explanation"
    }
  ]
}

Ensure the JSON is valid and parseable. Generate exactly 50 names with variety in styles and approaches.`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const responseText =
    message.content[0].type === 'text' ? message.content[0].text : ''

  // Parse JSON from response, handling markdown code blocks
  let jsonStr = responseText
  const jsonMatch = responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/)
  if (jsonMatch) {
    jsonStr = jsonMatch[1]
  }

  try {
    const parsed = JSON.parse(jsonStr)
    return parsed as PremiumNameResponse
  } catch (error) {
    console.error('Failed to parse response:', responseText)
    throw new Error('Failed to generate premium business names')
  }
}
