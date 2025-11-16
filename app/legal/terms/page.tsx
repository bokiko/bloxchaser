import Link from 'next/link';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-700 bg-gray-900/80 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative">
                  <img src="/logo.svg" alt="bloxchaser" className="h-10 w-auto" />
                </div>
              </div>
            </Link>
            <Link href="/" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-xl prose prose-invert prose-slate max-w-none">
          <h1 className="text-4xl font-bold text-white mb-2">Terms of Use</h1>
          <p className="text-slate-400 mb-8">
            <strong>Effective Date:</strong> November 16, 2025<br />
            <strong>Last Updated:</strong> November 16, 2025
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Agreement to Terms</h2>
          <p className="text-slate-300 mb-4">
            Welcome to bloxchaser. These Terms of Use ("Terms") govern your access to and use of the bloxchaser website located at bloxchaser.com and bloxchaser.vercel.app (collectively, the "Website"), operated by bloxchaser ("we," "us," or "our").
          </p>
          <p className="text-slate-300 mb-4">
            <strong>BY ACCESSING OR USING THE WEBSITE, YOU AGREE TO BE BOUND BY THESE TERMS.</strong> If you do not agree to these Terms, do not access or use the Website.
          </p>
          <p className="text-slate-300 mb-4">
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Website after changes constitutes acceptance of the modified Terms.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Description of Service</h2>
          <p className="text-slate-300 mb-4">
            bloxchaser is a free, open-source cryptocurrency mining network analytics dashboard that provides:
          </p>
          <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
            <li>Real-time hashrate tracking for various cryptocurrencies</li>
            <li>Historical network data and charts</li>
            <li>Mining difficulty information</li>
            <li>Network health metrics</li>
            <li>Trend analysis for mining networks</li>
          </ul>
          <p className="text-slate-300 mb-4">
            <strong>The Service is provided "AS IS" and "AS AVAILABLE" without any warranties of any kind.</strong>
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Eligibility and Account Requirements</h2>
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.1 Age Requirement</h3>
          <p className="text-slate-300 mb-4">
            You must be at least 18 years old to use this Website. By using the Website, you represent and warrant that you are at least 18 years of age.
          </p>
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.2 No Account Required</h3>
          <p className="text-slate-300 mb-4">
            bloxchaser does not require user registration or account creation. The service is freely accessible to all visitors.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Acceptable Use</h2>
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.1 Permitted Uses</h3>
          <p className="text-slate-300 mb-4">You may use the Website for lawful purposes only, including:</p>
          <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
            <li>Viewing cryptocurrency mining network analytics</li>
            <li>Analyzing mining trends and data</li>
            <li>Accessing historical mining network information</li>
            <li>Sharing links to the Website</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.2 Prohibited Uses</h3>
          <p className="text-slate-300 mb-4">You agree NOT to:</p>
          <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
            <li><strong>Violate Laws:</strong> Use the Website for any illegal purpose or in violation of any applicable laws</li>
            <li><strong>Interfere with Service:</strong> Attempt to interfere with, disrupt, or harm the Website's operation</li>
            <li><strong>Automated Access:</strong> Use bots, scrapers, or automated tools to access the Website excessively</li>
            <li><strong>Reverse Engineer:</strong> Attempt to reverse engineer, decompile, or disassemble any part of the Website</li>
            <li><strong>Unauthorized Access:</strong> Attempt to gain unauthorized access to our systems, networks, or data</li>
            <li><strong>Malicious Code:</strong> Introduce viruses, malware, or any harmful code</li>
            <li><strong>API Abuse:</strong> Overwhelm our API endpoints or third-party data providers</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Disclaimers and Warnings</h2>
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">5.1 NO FINANCIAL ADVICE</h3>
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-300 font-semibold mb-2">IMPORTANT:</p>
            <p className="text-slate-300">
              bloxchaser provides informational data only. We do NOT provide financial advice, investment recommendations, mining profitability guarantees, or trading signals.
            </p>
            <p className="text-slate-300 mt-2">
              <strong>You should NOT make financial decisions based solely on data from our Website.</strong> Always conduct your own research and consult with qualified financial advisors.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">5.2 Data Accuracy Disclaimer</h3>
          <p className="text-slate-300 mb-4">While we strive to provide accurate and up-to-date information:</p>
          <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
            <li>Data may be delayed or inaccurate</li>
            <li>Network statistics can change rapidly</li>
            <li>API sources may provide incorrect data</li>
            <li>Historical data may contain gaps or errors</li>
          </ul>
          <p className="text-slate-300 mb-4">
            <strong>WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR TIMELINESS OF ANY DATA ON THE WEBSITE.</strong>
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Cryptocurrency Risk Disclosure</h2>
          <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-4">
            <p className="text-yellow-300 font-semibold mb-2">CRYPTOCURRENCY AND MINING INVOLVE SUBSTANTIAL RISK:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Cryptocurrency prices are highly volatile</li>
              <li>You may lose your entire investment</li>
              <li>Mining profitability fluctuates</li>
              <li>Hardware costs may not be recovered</li>
              <li>Network difficulty adjusts dynamically</li>
              <li>Equipment may fail or become obsolete</li>
            </ul>
            <p className="text-slate-300 mt-4">
              <strong>BY USING THIS WEBSITE, YOU ACKNOWLEDGE THESE RISKS AND AGREE THAT YOU ARE SOLELY RESPONSIBLE FOR YOUR MINING AND INVESTMENT DECISIONS.</strong>
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Limitation of Liability</h2>
          <p className="text-slate-300 mb-4">
            <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
          </p>
          <p className="text-slate-300 mb-4">
            THE WEBSITE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. IN NO EVENT SHALL bloxchaser BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Contact Information</h2>
          <p className="text-slate-300 mb-4">
            For questions, concerns, or notices regarding these Terms, please contact us:
          </p>
          <ul className="list-none text-slate-300 mb-4 space-y-2">
            <li><strong>Email:</strong> info@bloxchaser.com</li>
            <li><strong>GitHub:</strong> <a href="https://github.com/bokiko/bloxchaser" className="text-blue-400 hover:text-blue-300">https://github.com/bokiko/bloxchaser</a></li>
            <li><strong>Website:</strong> <a href="https://bloxchaser.com" className="text-blue-400 hover:text-blue-300">https://bloxchaser.com</a></li>
          </ul>

          <div className="border-t border-slate-700 mt-8 pt-8">
            <p className="text-slate-400 text-sm">
              <strong>Last Updated:</strong> November 16, 2025
            </p>
            <p className="text-slate-500 text-sm mt-2">
              bloxchaser - built for miners, by miners
            </p>
            <p className="text-slate-500 text-xs mt-4">
              For the complete Terms of Use, please visit our <a href="https://github.com/bokiko/bloxchaser/blob/main/TERMS_OF_USE.md" className="text-blue-400 hover:text-blue-300">GitHub repository</a>.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
