import { NextRequest, NextResponse } from 'next/server'

interface NameItem {
  name: string
  domain: string
  tagline: string
  logoStyle: string
  description: string
}

export async function POST(request: NextRequest) {
  try {
    const { names, industry, keywords, style } = await request.json()

    if (!names || !Array.isArray(names) || names.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid names data' },
        { status: 400 }
      )
    }

    // Generate text report
    const reportLines: string[] = [
      '═══════════════════════════════════════════════════════════',
      'BUSINESS NAME GENERATOR - PREMIUM REPORT',
      '═══════════════════════════════════════════════════════════',
      '',
      `Generated for: ${industry} Industry`,
      `Keywords: ${keywords}`,
      `Style: ${style}`,
      `Date: ${new Date().toISOString().split('T')[0]}`,
      '',
      '═══════════════════════════════════════════════════════════',
      `PREMIUM BUSINESS NAME IDEAS (${names.length} total)`,
      '═══════════════════════════════════════════════════════════',
      '',
    ]

    names.forEach((item: NameItem, index: number) => {
      reportLines.push(`${index + 1}. ${item.name}`)
      reportLines.push(`   Domain: ${item.domain}`)
      reportLines.push(`   Tagline: "${item.tagline}"`)
      reportLines.push(`   Logo Style: ${item.logoStyle}`)
      reportLines.push(`   Description: ${item.description}`)
      reportLines.push('')
    })

    reportLines.push('═══════════════════════════════════════════════════════════')
    reportLines.push('End of Report')
    reportLines.push('═══════════════════════════════════════════════════════════')

    const reportText = reportLines.join('\n')

    // Return as downloadable text file
    return new NextResponse(reportText, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="business-names-report.txt"',
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate download',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
