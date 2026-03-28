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

      sessionStorage.setItem('formData', JSON.stringify({ industry, keywords, style }))
      window.location.href = data.url
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Business Name</h1>
          <p className="text-lg md:text-xl text-blue-100">AI-powered business name generator. Get 10 free ideas or 50 premium names with domains, taglines, and logo styles.</p>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Tell Us About Your Business</h2>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Industry or Business Type</label>
              <input
                type="text"
                placeholder="e.g., Tech Startup, Coffee Shop, Consulting, E-commerce"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Keywords or Focus Area</label>
              <input
                type="text"
                placeholder="e.g., Sustainable, AI-powered, Community-driven"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Naming Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              >
                <option>Modern</option>
                <option>Classic</option>
                <option>Playful</option>
                <option>Tech</option>
                <option>Minimal</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 mb-4">
              <button
                onClick={handleGenerateFree}
                disabled={loading}
                className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                {loading ? 'Generating...' : 'Generate Free (10 Ideas)'}
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="flex-1 bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition"
              >
                {loading ? 'Processing...' : 'Upgrade to Premium ($5.99)'}
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              {remaining > 0 ? `Free generations remaining this hour: ${remaining}` : 'Rate limit reached. Upgrade to premium for unlimited access.'}
            </p>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {results.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Your Free Ideas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {results.map((name, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <h4 className="text-lg font-semibold text-brand-600 mb-1">{name.name}</h4>
                  <p className="text-sm text-gray-600">{name.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-4">Want 50 names with domains, taglines, and logo styles?</p>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-3 px-8 rounded-lg transition"
              >
                {loading ? 'Processing...' : 'Unlock Premium for $5.99'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Upsell Section */}
      {results.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Want the full package?</h3>
            <p className="text-gray-700 mb-4">Get 50 carefully curated names with domain availability hints, taglines for each name, and logo style suggestions.</p>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Upgrade for $5.99
            </button>
          </div>
        </section>
      )}

      {/* Free vs Premium Comparison */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Free vs Premium</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Tier */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Free</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">10 business names</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Brief descriptions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">3/hour rate limit</span>
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <span className="font-bold">✗</span>
                  <span className="text-gray-700">Domain hints</span>
                </li>
              </ul>
            </div>

            {/* Premium Tier */}
            <div className="bg-white border-2 border-brand-500 rounded-xl p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Premium</h3>
                <span className="bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded">$5.99</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">50 business names</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Domain availability hints</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Taglines for each name</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Logo style suggestions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-brand-600">1</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Tell Us About Your Business</h4>
              <p className="text-gray-600 text-sm">Provide your industry, keywords, and naming style preferences.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-brand-600">2</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">AI Generates Ideas</h4>
              <p className="text-gray-600 text-sm">Our AI instantly creates creative, memorable names tailored to your business.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-brand-600">3</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Pick Your Favorite</h4>
              <p className="text-gray-600 text-sm">Choose a name and start building your brand with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Can I use the generated names commercially?',
                a: 'Yes! All names are generated fresh for you. However, we recommend checking trademark databases before officially registering your business name.',
              },
              {
                q: "What if I don't like any of the free names?",
                a: 'No problem! You get 3 free generations per hour. Try different keywords or styles. Upgrade to premium for 50 names in one go.',
              },
              {
                q: 'Do you check domain availability?',
                a: 'Premium results include domain hints, but we recommend checking registrars like GoDaddy or Namecheap to confirm availability.',
              },
              {
                q: 'Can I get a refund?',
                a: "We offer a 100% satisfaction guarantee. If you're not happy with your premium results, contact us within 7 days for a full refund.",
              },
              {
                q: 'How long does generation take?',
                a: 'Usually just 10-30 seconds. Our AI works in real-time to give you instant feedback.',
              },
            ].map((item, index) => (
              <details key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-gray-900 hover:text-brand-600">{item.q}</summary>
                <p className="text-gray-600 text-sm mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-8 px-4 text-center text-sm text-gray-500">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Velocity Forge AI</h4>
              <p className="text-xs">Create Faster. Think Smarter. Scale Higher.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Tools</h4>
              <ul className="space-y-1 text-xs">
                <li>
                  <a href="#" className="text-gray-600 hover:text-brand-600">Business Names</a>
                </li>
                <li>
                  <a href="https://cover-letter-ai.vercel.app" className="text-gray-600 hover:text-brand-600">Cover Letter Generator</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-brand-600">Pitch Deck Generator</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Legal</h4>
              <ul className="space-y-1 text-xs">
                <li>
                  <a href="#" className="text-gray-600 hover:text-brand-600">Privacy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-brand-600">Terms</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-6">
            <p>© 2026 Velocity Forge AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
