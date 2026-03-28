'use client'

import { useState } from 'react'

interface FreeName {
  name: string
  description: string
}

interface FreeNamesResponse {
  names?: FreeName[]
  remaining?: number
  error?: string
}

export default function Home() {
  const [industry, setIndustry] = useState('')
  const [keywords, setKeywords] = useState('')
  const [style, setStyle] = useState('Modern')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<FreeName[]>([])
  const [remaining, setRemaining] = useState(3)
  const [error, setError] = useState('')
  const [showFAQ, setShowFAQ] = useState(false)

  const handleGenerateFree = async () => {
    if (!industry.trim() || !keywords.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, keywords, style }),
      })

      const data = (await response.json()) as FreeNamesResponse

      if (!response.ok) {
        setError(data.error || 'Failed to generate names')
        setRemaining(data.remaining || 0)
        return
      }

      setResults(data.names || [])
      setRemaining(data.remaining || 0)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async () => {
    if (!industry.trim() || !keywords.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, keywords, style }),
      })

      const data = (await response.json()) as { url?: string; error?: string }

      if (!response.ok || !data.url) {
        setError(data.error || 'Failed to create checkout session')
        return
      }

      // Store form data in sessionStorage before redirecting
      sessionStorage.setItem('formData', JSON.stringify({ industry, keywords, style }))

      // Redirect to Stripe checkout
      window.location.href = data.url
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>✨ Velocity Forge</h1>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
                Business Names
              </a>
              <a href="https://website-roaster-ai-jade.vercel.app" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                Website Roaster
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                More Tools
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 700 }}>
            Find Your Perfect Business Name
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            AI-powered business name generator. Get 10 free ideas or 50 premium names with domains, taglines, and logo styles.
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <section style={{ paddingBottom: '4rem' }}>
        <div className="container">
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Tell Us About Your Business</h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Industry or Business Type
                </label>
                <input
                  type="text"
                  placeholder="e.g., Tech Startup, Coffee Shop, Consulting, E-commerce"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Keywords or Focus Area
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sustainable, AI-powered, Community-driven"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Naming Style
                </label>
                <select value={style} onChange={(e) => setStyle(e.target.value)} style={{ width: '100%' }}>
                  <option>Modern</option>
                  <option>Classic</option>
                  <option>Playful</option>
                  <option>Tech</option>
                  <option>Minimal</option>
                </select>
              </div>

              {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleGenerateFree}
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: 'var(--accent)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 500,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    fontSize: '1rem',
                  }}
                >
                  {loading ? 'Generating...' : 'Generate Free (10 Ideas)'}
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: 'var(--surface-hover)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontWeight: 500,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    fontSize: '1rem',
                  }}
                >
                  {loading ? 'Processing...' : 'Upgrade to Premium ($5.99)'}
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center' }}>
                {remaining > 0 ? `Free generations remaining this hour: ${remaining}` : 'Rate limit reached. Upgrade to premium for unlimited access.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {results.length > 0 && (
        <section style={{ paddingBottom: '4rem' }}>
          <div className="container">
            <h2 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem' }}>Your Free Ideas</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {results.map((name, index) => (
                <div
                  key={index}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
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
                  <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent)', fontSize: '1.2rem' }}>{name.name}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{name.description}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Want 50 names with domains, taglines, and logo styles?
              </p>
              <button
                onClick={handleCheckout}
                disabled={loading}
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  padding: '0.875rem 2rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  fontSize: '1rem',
                }}
              >
                {loading ? 'Processing...' : 'Unlock Premium for $5.99'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Free vs Premium Comparison */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem', background: 'var(--surface)' }}>
        <div className="container">
          <h2 style={{ marginBottom: '3rem', textAlign: 'center', fontSize: '2rem' }}>Free vs Premium</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            {/* Free Tier */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Free</h3>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span> 10 business names
                </li>
                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span> Brief descriptions
                </li>
                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span> 3/hour rate limit
                </li>
                <li style={{ padding: '0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5 }}>
                  <span style={{ fontWeight: 'bold' }}>✗</span> Domain hints
                </li>
              </ul>
            </div>

            {/* Premium Tier */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.1) 0%, rgba(109, 40, 217, 0.05) 100%)',
                border: '2px solid var(--accent)',
                borderRadius: '0.5rem',
                padding: '2rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Premium</h3>
                <span style={{ background: 'var(--accent)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  $5.99
                </span>
              </div>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span> 50 business names
                </li>
                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span> Domain hints
                </li>
                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span> Taglines
                </li>
                <li style={{ padding: '0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span> Logo style suggestions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <h2 style={{ marginBottom: '3rem', textAlign: 'center', fontSize: '2rem' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  background: 'var(--accent-subtle)',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.5rem',
                }}
              >
                1
              </div>
              <h4>Tell Us About Your Business</h4>
              <p style={{ color: 'var(--text-secondary)' }}>Provide your industry, keywords, and naming style preferences.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  background: 'var(--accent-subtle)',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.5rem',
                }}
              >
                2
              </div>
              <h4>AI Generates Ideas</h4>
              <p style={{ color: 'var(--text-secondary)' }}>Our AI instantly creates creative, memorable names tailored to your business.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  background: 'var(--accent-subtle)',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.5rem',
                }}
              >
                3
              </div>
              <h4>Pick Your Favorite</h4>
              <p style={{ color: 'var(--text-secondary)' }}>Choose a name and start building your brand with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem', background: 'var(--surface)' }}>
        <div className="container">
          <h2 style={{ marginBottom: '3rem', textAlign: 'center', fontSize: '2rem' }}>Frequently Asked Questions</h2>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {[
              {
                q: 'Can I use the generated names commercially?',
                a: 'Yes! All names are generated fresh for you. However, we recommend checking trademark databases before officially registering your business name.',
              },
              {
                q: 'What if I don\'t like any of the free names?',
                a: 'No problem! You get 3 free generations per hour. Try different keywords or styles. Upgrade to premium for 50 names in one go.',
              },
              {
                q: 'Do you check domain availability?',
                a: 'Premium results include domain hints, but we recommend checking registrars like GoDaddy or Namecheap to confirm availability.',
              },
              {
                q: 'Can I get a refund?',
                a: 'We offer a 100% satisfaction guarantee. If you\'re not happy with your premium results, contact us within 7 days for a full refund.',
              },
              {
                q: 'How long does generation take?',
                a: 'Usually just 10-30 seconds. Our AI works in real-time to give you instant feedback.',
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  borderBottom: '1px solid var(--border)',
                  paddingTop: index === 0 ? 0 : '1.5rem',
                  paddingBottom: '1.5rem',
                }}
              >
                <button
                  onClick={() => setShowFAQ(!showFAQ)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  {item.q}
                </button>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '0.95rem', lineHeight: 1.7 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Velocity Forge AI</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Create Faster. Think Smarter. Scale Higher.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Tools</h4>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    Business Names
                  </a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="https://website-roaster-ai-jade.vercel.app" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    Website Roaster
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    More Tools
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Legal</h4>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <p>© 2026 Velocity Forge AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
