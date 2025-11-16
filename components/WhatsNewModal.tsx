'use client';

import { useEffect, useState } from 'react';

export default function WhatsNewModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the modal
    const hasSeenModal = localStorage.getItem('whatsNewModalSeen_v1');

    if (!hasSeenModal) {
      // Show modal after a brief delay
      setTimeout(() => setIsVisible(true), 500);

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem('whatsNewModalSeen_v1', 'true');
      }, 3000);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-cyan-500/20 animate-slideUp">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">What's New!</h2>
        </div>

        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-2 text-slate-300">
            <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span><strong className="text-white">ZEC, BCH & RVN</strong> networks added</span>
          </li>
          <li className="flex items-start gap-2 text-slate-300">
            <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span><strong className="text-white">Profit calculator</strong> - estimate your daily earnings</span>
          </li>
          <li className="flex items-start gap-2 text-slate-300">
            <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span><strong className="text-white">Trend sparklines</strong> - visualize hashrate changes</span>
          </li>
          <li className="flex items-start gap-2 text-slate-300">
            <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span><strong className="text-white">Share on X</strong> - spread the word about network changes</span>
          </li>
        </ul>

        <button
          onClick={() => {
            setIsVisible(false);
            localStorage.setItem('whatsNewModalSeen_v1', 'true');
          }}
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Got it!
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
