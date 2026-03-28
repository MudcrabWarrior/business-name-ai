import { NextRequest, NextResponse } from 'next/server'
import { generateFreeNames } from '@/lib/anthropic'
import { checkRateLimit, getRemainingQuota } from '@/lib/rate-limit'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'You have used all 3 free generations this hour. Please upgrade to premium or try again later.',
          remaining: getRemainingQuota(ip),
        },
        { status: 429 }
      )
    }

    const { industry, keywords, style } = await request.json()

    if (!industry || !keywords || !style) {
      return NextResponse.json(
        { error: 'Missing required fields: industry, keywords, style' },
        { status: 400 }
      )
    }

    const result = await generateFreeNames(industry, keywords, style)

    return NextResponse.json({
      ...result,
      remaining: getRemainingQuota(ip),
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate business names',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
