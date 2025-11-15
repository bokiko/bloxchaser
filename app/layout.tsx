import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "bloxchaser - Real-Time Mining Network Analytics",
  description: "Track hashrate trends, difficulty adjustments, and network health for top mineable cryptocurrencies including Bitcoin, Litecoin, Monero, Dogecoin, Kaspa, and Ethereum Classic.",
  keywords: ["crypto mining", "hashrate", "network difficulty", "mining analytics", "bitcoin hashrate", "cryptocurrency mining"],
  authors: [{ name: "bloxchaser" }],
  openGraph: {
    title: "bloxchaser - Real-Time Mining Network Analytics",
    description: "Track hashrate trends, difficulty adjustments, and network health for top mineable cryptocurrencies.",
    url: "https://bloxchaser.com",
    siteName: "bloxchaser",
    type: "website",
    images: [
      {
        url: "/og-image.png", // You can create this later
        width: 1200,
        height: 630,
        alt: "bloxchaser - Mining Network Analytics Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "bloxchaser - Real-Time Mining Network Analytics",
    description: "Track hashrate trends, difficulty adjustments, and network health for top mineable cryptocurrencies.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
