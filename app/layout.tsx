import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '../hooks/useAuth'
import { CookieConsent } from '@/components/cookie-consent'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: 'IslandInvest - Caribbean Property & Business Listings',
  description: 'Discover premium properties, businesses, and investment opportunities in the Caribbean. Find your dream beachfront property, Airbnb rental, or business venture in destinations like Punta Cana, Cap Cana, and more.',
  generator: 'v0.app',
  keywords: ['Caribbean real estate', 'Dominican Republic property', 'Punta Cana homes', 'Caribbean investment', 'beach property', 'Airbnb rental'],
  openGraph: {
    title: 'IslandInvest - Caribbean Property & Business Listings',
    description: 'Discover premium properties and investment opportunities in the Caribbean.',
    type: 'website',
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a7a7a',
  width: 'device-width',
  initialScale: 1,
}

import { GoogleAnalytics } from '@/components/analytics'

import { LanguageProvider } from '@/context/LanguageContext'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        {GA_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_ID} />}
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          <LanguageProvider>
            <AuthProvider>
              {children}
              <CookieConsent />
              <Analytics />
            </AuthProvider>
          </LanguageProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
