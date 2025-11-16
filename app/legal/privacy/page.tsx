import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-slate-400 mb-8">
            <strong>Effective Date:</strong> November 16, 2025<br />
            <strong>Last Updated:</strong> November 16, 2025
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
          <p className="text-slate-300 mb-4">
            Welcome to bloxchaser ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website bloxchaser.com and bloxchaser.vercel.app (collectively, the "Website").
          </p>
          <p className="text-slate-300 mb-4">
            Please read this Privacy Policy carefully. By accessing or using our Website, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.1 Information Collected Automatically</h3>
          <p className="text-slate-300 mb-4">When you visit our Website, we may automatically collect certain information about your device, including:</p>
          <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
            <li><strong>Browser Type and Version:</strong> Information about your web browser</li>
            <li><strong>Operating System:</strong> Information about your device's operating system</li>
            <li><strong>IP Address:</strong> Your Internet Protocol address for security and analytics</li>
            <li><strong>Device Information:</strong> Device type, screen resolution, and technical information</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent, click data, and navigation patterns</li>
            <li><strong>Referral Source:</strong> The website or search engine that referred you</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.2 Cookies and Similar Technologies</h3>
          <p className="text-slate-300 mb-4">
            We use cookies and similar tracking technologies to enhance your experience on our Website. Cookies are small data files stored on your device. We use:
          </p>
          <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for basic Website functionality</li>
            <li><strong>Analytics Cookies:</strong> To understand how visitors interact with our Website</li>
            <li><strong>Performance Cookies:</strong> To improve Website speed and performance</li>
          </ul>
          <p className="text-slate-300 mb-4">
            You can control cookies through your browser settings. However, disabling cookies may affect certain features of our Website.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.3 Information We Do NOT Collect</h3>
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 mb-4">
            <p className="text-green-300 font-semibold mb-2">We do NOT collect:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Personal identification information (name, email, phone number) unless you voluntarily provide it</li>
              <li>Financial information or payment details</li>
              <li>Mining wallet addresses or private keys</li>
              <li>Account registration information (our service is completely anonymous)</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="text-slate-300 mb-4">We use the automatically collected information for the following purposes:</p>
          <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
            <li><strong>Website Operation:</strong> To provide, maintain, and improve our Website functionality</li>
            <li><strong>Analytics:</strong> To analyze usage patterns and optimize user experience</li>
            <li><strong>Performance Monitoring:</strong> To identify and fix technical issues</li>
            <li><strong>Security:</strong> To detect, prevent, and address security threats</li>
            <li><strong>Compliance:</strong> To comply with legal obligations and enforce our terms</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Data Sharing and Disclosure</h2>
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.1 Third-Party Services</h3>
          <p className="text-slate-300 mb-4">We use the following third-party services that may collect information:</p>
          <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
            <li><strong>Vercel (Hosting):</strong> Our Website is hosted on Vercel</li>
            <li><strong>Blockchain APIs:</strong> We retrieve mining network data from public blockchain APIs</li>
            <li><strong>Analytics Services:</strong> We may use analytics tools to understand Website usage</li>
          </ul>
          <p className="text-slate-300 mb-4">
            <strong>We do NOT sell, rent, or trade your information to third parties for marketing purposes.</strong>
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Data Security</h2>
          <p className="text-slate-300 mb-4">
            We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>
          <p className="text-slate-300 mb-4">Our security measures include:</p>
          <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
            <li>Secure HTTPS connections</li>
            <li>Regular security assessments</li>
            <li>Limited data collection practices</li>
            <li>Secure hosting infrastructure</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Your Rights and Choices</h2>
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.1 Cookie Management</h3>
          <p className="text-slate-300 mb-4">You have the right to:</p>
          <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
            <li>Accept or reject cookies through your browser settings</li>
            <li>Delete existing cookies from your device</li>
            <li>Set your browser to notify you when cookies are sent</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.2 Access to Data</h3>
          <p className="text-slate-300 mb-4">
            Since we do not collect personally identifiable information, there is no personal account data to access, modify, or delete. The data we collect is anonymous and technical in nature.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Cryptocurrency Data Disclaimer</h2>
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-4">
            <p className="text-blue-300 font-semibold mb-2">Important:</p>
            <p className="text-slate-300 mb-2">
              bloxchaser provides publicly available cryptocurrency mining network data. This data is sourced from public blockchain networks and APIs.
            </p>
            <p className="text-slate-300">We do not:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-2">
              <li>Collect or store cryptocurrency wallet addresses</li>
              <li>Have access to your mining operations or private keys</li>
              <li>Track your mining rewards or transactions</li>
              <li>Require user registration or accounts</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Regional Specific Information</h2>
          <h3 className="text-xl font-semibold text-white mt-6 mb-3">8.1 European Union Users (GDPR)</h3>
          <p className="text-slate-300 mb-4">
            If you are located in the European Union, you have additional rights under GDPR, including rights to access, rectification, erasure, and data portability.
          </p>
          <p className="text-slate-300 mb-4 text-sm">
            Note: Since we do not collect personally identifiable information, these rights are largely inapplicable to our service.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">8.2 California Users (CCPA)</h3>
          <p className="text-slate-300 mb-4">
            California residents have rights under the CCPA, including the right to know what personal information is collected and the right to opt-out of sale of personal information.
          </p>
          <p className="text-slate-300 mb-4 text-sm">
            Note: We do not sell personal information to third parties.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Contact Information</h2>
          <p className="text-slate-300 mb-4">
            If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:
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
              By using bloxchaser, you acknowledge that you have read and understood this Privacy Policy.
            </p>
            <p className="text-slate-500 text-xs mt-4">
              For the complete Privacy Policy, please visit our <a href="https://github.com/bokiko/bloxchaser/blob/main/PRIVACY_POLICY.md" className="text-blue-400 hover:text-blue-300">GitHub repository</a>.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
