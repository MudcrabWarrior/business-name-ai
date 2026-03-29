import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Business Name Generator - AI-Powered Company Name Ideas',
  description:
    'Generate creative business names powered by AI. Get 10 free ideas or 50 premium names with domains, taglines, and logo styles. Find the perfect name for your startup or company.',
  keywords: 'business name generator, company name ideas, startup name generator, business naming, AI business names',
  authors: [{ name: 'Velocity Forge AI' }],
  openGraph: {
    title: 'Business Name Generator - AI-Powered Company Name Ideas',
    description: 'Generate creative business names powered by AI. Get 10 free ideas or 50 premium names with domains and taglines.',
    type: 'website',
    url: 'https://business-name-ai.vercel.app',
    images: [
      {
        url: 'https://business-name-ai.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Business Name Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Name Generator - AI-Powered Company Name Ideas',
    description: 'Generate creative business names powered by AI. 10 free ideas, 50 premium names with domains and taglines.',
  },
  alternates: {
    canonical: 'https://business-name-ai.vercel.app',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' fill='%232563eb'>✨</text></svg>" />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
