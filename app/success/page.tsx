'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface PremiumName {
  name: string
  domain: string
  tagline: string
  logoStyle: string
  description: string
}

interface PremiumNamesResponse {
  names: PremiumName[]
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [names, setNames] = useState<PremiumName[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const generatePremiumNames = async () => {
      try {
        // Get form data from sessionStorage
        const formDataStr = sessionStorage.getItem('formData')
        if (!formDataStr) {
          setError('Session data not found. Please start over.')
          setLoading(false)
          return
        }

        const { industry, keywords, style } = JSON.parse(formDataStr) as { industry: string; keywords: string; style: string }

        // Call premium generation endpoint
        const response = await fetch('/api/premium', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            industry,
            keywords,
            style,
            sessionId,
          }),
        })

        const data = (await response.json()) as PremiumNamesResponse

        if (!response.ok) {
          setError((data as any).error || 'Failed to generate premium names')
          setLoading(false)
          return
        }

        setNames(data.names)

        // Clear sessionStorage
        sessionStorage.removeItem('formData')
      } catch (err) {
        setError('An error occurred. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    generatePremiumNames()
  }, [sessionId])

  const handleCopyName = (name: string) => {
    navigator.clipboard.writeText(name)
    setCopied(name)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names }),
      })

      if (!response.ok) {
        setError('Failed to download report')
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'business-names-report.txt'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Failed to download report')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
          <p style={{ fontSize: '1.2rem' }}>Generating your premium business names...</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>This usually takes 15-30 seconds</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉 Success!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>Here are your 50 premium business name ideas</p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {names.length > 0 && (
          <>
            {/* Download Button */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleDownload}
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                📥 Download Full Report
              </button>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  padding: '0.75rem 1.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                ← Generate More
              </button>
            </div>

            {/* Names Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {names.map((name, index) => (
                <div
                  key={index}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--accent)'
                    el.style.boxShadow = '0 10px 25px rgba(109, 40, 217, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--border)'
                    el.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--accent)', fontSize: '1.25rem', flex: 1 }}>{name.name}</h3>
                    <button
                      onClick={() => handleCopyName(name.name)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        padding: 0,
                      }}
                      title="Copy to clipboard"
                    >
                      {copied === name.name ? '✓' : '📋'}
                    </button>
                  </div>

                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Domain</span>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text)' }}>{name.domain}</p>
                  </div>

                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Tagline</span>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text)', fontStyle: 'italic' }}>"{name.tagline}"</p>
                  </div>

                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Logo Style</span>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text)' }}>{name.logoStyle}</p>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Description</span>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{name.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Steps */}
            <div
              style={{
                marginTop: '4rem',
                padding: '2rem',
                background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.1) 0%, rgba(109, 40, 217, 0.05) 100%)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
              }}
            >
              <h3 style={{ marginBottom: '1rem' }}>What's Next?</h3>
              <ol style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.75rem' }}>Check domain availability on GoDaddy, Namecheap, or your registrar</li>
                <li style={{ marginBottom: '0.75rem' }}>Search trademark databases to ensure the name is unique</li>
                <li style={{ marginBottom: '0.75rem' }}>Say it out loud and get feedback from friends and colleagues</li>
                <li>Sketch logo concepts using the suggested logo style</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>Loading...</p>
    </div>}>
      <SuccessContent />
    </Suspense>
  )
}
