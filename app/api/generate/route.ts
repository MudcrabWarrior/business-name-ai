import { NextRequest, NextResponse } from 'next/server'
import { generateFreeNames } from '@/lib/anthropic'
import { checkRateLimit, getRemainingQuota } from '@/lib/rate-limit'

// Sanitize user input to prevent prompt injection
function sanitizeInput(input: string): string {
  return input
    .replace(/\b(ignore|disregard|forget)\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/gi, '[filtered]')
    .replace(/\b(you\s+are\s+now|act\s+as|pretend\s+to\s+be|new\s+instructions?)\b/gi, '[filtered]')
    .replace(/\b(system\s*prompt|system\s*message|<\/?system>)/gi, '[filtered]');
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP — prefer x-real-ip (not spoofable on Vercel)
    const ip = request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown'

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

    const result = await generateFreeNames(
      sanitizeInput(industry.slice(0, 500)),
      sanitizeInput(keywords.slice(0, 1000)),
      sanitizeInput(style.slice(0, 200))
    )

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
