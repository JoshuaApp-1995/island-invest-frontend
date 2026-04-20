"use client"

import Head from "next/head"
import { usePathname } from "next/navigation"

interface SEOProps {
  title?: string
  description?: string
  image?: string
  keywords?: string
  type?: "website" | "article" | "property"
  jsonLd?: any
}

export function SEO({ 
  title, 
  description, 
  image, 
  keywords, 
  type = "website",
  jsonLd 
}: SEOProps) {
  const pathname = usePathname()
  const siteName = "IslandInvest"
  const defaultDescription = "Premium Caribbean real estate investment opportunities. Land, villas, and commercial properties in the Dominican Republic."
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://islandinvest.com"
  
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const fullDescription = description || defaultDescription
  const fullUrl = `${baseUrl}${pathname}`
  const ogImage = image || `${baseUrl}/og-image.jpg`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  )
}
