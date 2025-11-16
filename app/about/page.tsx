import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About bloxchaser - Real-Time Mining Intelligence',
  description: 'Built by miners, for miners. bloxchaser provides real-time mining network analytics for the crypto community. Learn about our mission, team, and what we track.',
  openGraph: {
    title: 'About bloxchaser - Real-Time Mining Intelligence',
    description: 'Built by miners, for miners. Real-time blockchain analytics for the mining community.',
    url: 'https://bloxchaser.com/about',
    siteName: 'bloxchaser',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About bloxchaser - Real-Time Mining Intelligence',
    description: 'Built by miners, for miners. Real-time blockchain analytics for the mining community.',
    creator: '@blxchaser',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 cursor-pointer">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative">
                  <img src="/logo.svg" alt="bloxchaser" className="h-10 w-auto" />
                </div>
              </div>
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-lg transition-colors border border-slate-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            About bloxchaser
          </h1>
          <p className="text-2xl text-slate-300 font-semibold">
            Real-Time Mining Intelligence for the Crypto Community
          </p>
          <p className="text-xl text-slate-400 mt-4">
            bloxchaser was built by miners, for miners.
          </p>
        </div>

        {/* Main Description */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-8 shadow-xl">
          <p className="text-lg text-slate-300 leading-relaxed">
            We're a real-time mining network analytics platform providing accurate, up-to-date data on blockchain networks that matter to the mining community. Whether you're running a single GPU rig or managing a data center, bloxchaser gives you the metrics you need to make informed decisions.
          </p>
        </div>

        {/* Why We Built This */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-4xl mr-3">💡</span>
            Why We Built This
          </h2>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-xl">
            <p className="text-slate-300 mb-4">As active cryptocurrency miners ourselves, we got tired of:</p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start">
                <span className="text-red-400 mr-3 text-xl">✗</span>
                <span>Scattered information across multiple sites</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-3 text-xl">✗</span>
                <span>Outdated or inaccurate mining data</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-3 text-xl">✗</span>
                <span>Platforms that don't cover the coins we actually mine</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-3 text-xl">✗</span>
                <span>Complex interfaces that make simple data hard to find</span>
              </li>
            </ul>
            <p className="text-slate-300 mt-6 text-lg font-semibold">
              So we built bloxchaser — a clean, fast, and reliable hub for mining network analytics.
            </p>
          </div>
        </section>

        {/* What We Track */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-4xl mr-3">📊</span>
            What We Track
          </h2>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-xl">
            <p className="text-slate-300 mb-6">We monitor the most popular and profitable mining networks:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                <span className="text-cyan-400 font-semibold">Bitcoin (BTC)</span>
                <span className="text-slate-400 ml-2">- The OG</span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                <span className="text-cyan-400 font-semibold">Litecoin (LTC)</span>
                <span className="text-slate-400 ml-2">- Scrypt king</span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                <span className="text-cyan-400 font-semibold">Monero (XMR)</span>
                <span className="text-slate-400 ml-2">- CPU mining champion</span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                <span className="text-cyan-400 font-semibold">Dogecoin (DOGE)</span>
                <span className="text-slate-400 ml-2">- Merge-mined with Litecoin</span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                <span className="text-cyan-400 font-semibold">Kaspa (KAS)</span>
                <span className="text-slate-400 ml-2">- Fast & efficient</span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                <span className="text-cyan-400 font-semibold">And more...</span>
                <span className="text-slate-400 ml-2">- Ravencoin, Ergo, & more</span>
              </div>
            </div>
            <p className="text-slate-300 mb-4 font-semibold">Each network gets real-time updates on:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                <span>Network hashrate</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                <span>Mining difficulty</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                <span>Block times</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                <span>Reward schedules</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                <span>Profitability indicators</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-4xl mr-3">🎯</span>
            Our Mission
          </h2>
          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl border border-cyan-700/50 p-8 shadow-xl">
            <p className="text-slate-200 text-lg leading-relaxed">
              To provide the mining community with accurate, real-time blockchain data that's easy to access and understand. No fluff, no sponsored content, no BS — just the numbers miners need.
            </p>
          </div>
        </section>

        {/* Who We Are */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-4xl mr-3">👥</span>
            Who We Are
          </h2>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-xl">
            <p className="text-slate-300 mb-6">
              We're a team of crypto mining enthusiasts and blockchain developers who believe in:
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-4">🔍</span>
                <div>
                  <h3 className="text-cyan-400 font-semibold text-lg">Transparency</h3>
                  <p className="text-slate-400">All data is pulled directly from blockchain nodes</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-4">✓</span>
                <div>
                  <h3 className="text-cyan-400 font-semibold text-lg">Accuracy</h3>
                  <p className="text-slate-400">Real-time updates, not cached garbage</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-4">🤝</span>
                <div>
                  <h3 className="text-cyan-400 font-semibold text-lg">Community</h3>
                  <p className="text-slate-400">Built for miners, by miners</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-4">📖</span>
                <div>
                  <h3 className="text-cyan-400 font-semibold text-lg">Open Knowledge</h3>
                  <p className="text-slate-400">Sharing what we learn</p>
                </div>
              </div>
            </div>
            <p className="text-slate-300 mt-6">
              Follow us on Twitter{' '}
              <a
                href="https://twitter.com/blxchaser"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                @blxchaser
              </a>
              {' '}for updates, mining insights, and crypto analysis.
            </p>
          </div>
        </section>

        {/* Get Involved */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-4xl mr-3">📬</span>
            Get Involved
          </h2>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-xl">
            <p className="text-slate-300 mb-6">
              Got feedback? Want to see a specific network added? Found incorrect data?
              <br />
              Reach out to us:
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-cyan-400 mr-3">📧</span>
                <span className="text-slate-300">Email: </span>
                <a
                  href="mailto:info@bloxchaser.com"
                  className="text-cyan-400 hover:text-cyan-300 ml-2 font-mono"
                >
                  info@bloxchaser.com
                </a>
              </div>
              <div className="flex items-center">
                <span className="text-cyan-400 mr-3">🐦</span>
                <span className="text-slate-300">Twitter: </span>
                <a
                  href="https://twitter.com/blxchaser"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 ml-2 font-mono"
                >
                  @blxchaser
                </a>
              </div>
              <div className="flex items-center">
                <span className="text-cyan-400 mr-3">💻</span>
                <span className="text-slate-300">GitHub: </span>
                <a
                  href="https://github.com/bokiko/bloxchaser"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 ml-2 font-mono"
                >
                  github.com/bokiko/bloxchaser
                </a>
              </div>
            </div>
            <p className="text-slate-400 mt-6 italic">
              We're constantly improving bloxchaser based on community feedback.
            </p>
          </div>
        </section>

        {/* Support the Project */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-4xl mr-3">💎</span>
            Support the Project
          </h2>
          <div className="bg-gradient-to-br from-orange-900/20 to-amber-900/20 backdrop-blur-sm rounded-2xl border border-orange-700/50 p-8 shadow-xl">
            <p className="text-slate-300 mb-6">
              bloxchaser is free to use and always will be. If you find it useful:
            </p>
            <ul className="space-y-2 text-slate-300 mb-6">
              <li className="flex items-center">
                <span className="text-amber-400 mr-2">★</span>
                <span>Share it with fellow miners</span>
              </li>
              <li className="flex items-center">
                <span className="text-amber-400 mr-2">★</span>
                <span>Follow us on Twitter</span>
              </li>
              <li className="flex items-center">
                <span className="text-amber-400 mr-2">★</span>
                <span>Give feedback to help us improve</span>
              </li>
            </ul>
            <p className="text-slate-300 mb-4 font-semibold">
              Donations welcome to help cover hosting costs:
            </p>
            <div className="space-y-3 bg-slate-900/50 rounded-lg p-6 border border-slate-700/30">
              <div>
                <p className="text-orange-400 font-semibold mb-1">BTC:</p>
                <code className="text-slate-300 text-sm break-all bg-slate-800/80 px-3 py-2 rounded block">
                  bc1q4vdyz0nhltgjyc67feljyv52hk2ct70s57haq3
                </code>
              </div>
              <div>
                <p className="text-blue-400 font-semibold mb-1">EVM (ETH/USDT/USDC):</p>
                <code className="text-slate-300 text-sm break-all bg-slate-800/80 px-3 py-2 rounded block">
                  0x534CcAF69453c23160E35CccFe3200c8593c1852
                </code>
              </div>
              <div>
                <p className="text-purple-400 font-semibold mb-1">SOL:</p>
                <code className="text-slate-300 text-sm break-all bg-slate-800/80 px-3 py-2 rounded block">
                  58TxNx9fywzhisy2Up631XSy2krWuX6W7CTvNbPVgBo4
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Tagline */}
        <div className="text-center py-12">
          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            bloxchaser — chase the blocks, mine the future.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400 text-sm">
            <p>© 2025 bloxchaser. Built for miners, by miners.</p>
            <div className="mt-2 space-x-4">
              <Link href="/" className="hover:text-cyan-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/legal/terms" className="hover:text-cyan-400 transition-colors">
                Terms
              </Link>
              <Link href="/legal/privacy" className="hover:text-cyan-400 transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
