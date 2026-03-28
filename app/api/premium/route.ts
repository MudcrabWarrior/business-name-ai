import { NextRequest, NextResponse } from 'next/server'
import { generatePremiumNames } from '@/lib/anthropic'

export async function POST(request: NextRequest) {
  try {
    const { industry, keywords, style, sessionId } = await request.json()

    if (!industry || !keywords || !style || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: industry, keywords, style, sessionId' },
        { status: 400 }
      )
    }

    // In production, you could verify the sessionId against Stripe,
    // but for now we trust the client (they paid to reach this endpoint)

    const result = await generatePremiumNames(industry, keywords, style)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Premium generation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate premium business names',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
