"use client"

import { use, useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Loader2 } from "lucide-react"
import { getPageBySlug } from "@/api/pages"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await getPageBySlug(slug)
        if (!data.published) {
          setError(true)
        } else {
          setPage(data)
        }
      } catch (err) {
        console.error("Failed to fetch page:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchPage()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground">404 - Page Not Found</h1>
            <p className="mt-4 text-muted-foreground text-lg">
              The page you are looking for doesn&apos;t exist or has been unpublished.
            </p>
            <Button asChild className="mt-8 bg-primary hover:bg-primary/90">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {page.title}
            </h1>
          </header>

          <div className="prose prose-lg prose-slate max-w-none dark:prose-invert">
            {page.sections?.map((section: any) => {
              switch (section.type) {
                case 'text':
                  return (
                    <div 
                      key={section.id} 
                      className="mb-8 prose-p:leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: section.content.text }}
                    />
                  )
                case 'image':
                  return section.content.url ? (
                    <div key={section.id} className="mb-8 rounded-xl overflow-hidden shadow-md">
                      <img src={section.content.url} alt={section.content.alt || ''} className="w-full h-auto" />
                    </div>
                  ) : null
                case 'video':
                  return section.content.url ? (
                    <div key={section.id} className="mb-8 aspect-video rounded-xl overflow-hidden shadow-md">
                      <iframe 
                        src={section.content.url.replace('watch?v=', 'embed/')} 
                        className="w-full h-full" 
                        allowFullScreen 
                        title="Video"
                      />
                    </div>
                  ) : null
                case 'button':
                  return (
                    <div key={section.id} className="mb-8 flex justify-center py-4">
                      <Button asChild size="lg" className="text-lg px-8 shadow-lg">
                        <Link href={section.content.link || '#'}>{section.content.text}</Link>
                      </Button>
                    </div>
                  )
                case 'gallery':
                  return section.content.urls?.length > 0 ? (
                    <div key={section.id} className="mb-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {section.content.urls.map((url: string, i: number) => url && (
                        <div key={i} className="rounded-lg overflow-hidden aspect-square shadow-sm">
                          <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                        </div>
                      ))}
                    </div>
                  ) : null
                case 'properties':
                  return (
                    <div key={section.id} className="mb-12 py-8 bg-muted/30 rounded-2xl -mx-4 px-4 sm:mx-0 sm:px-8">
                      <h3 className="text-2xl font-bold mb-6 text-center">Featured Listings</h3>
                      {/* Placeholder for dynamic properties fetching - in a real implementation we'd fetch these server-side or via SWR */}
                      <div className="text-center text-muted-foreground p-8 bg-card rounded-xl border border-dashed">
                        [ Dynamic Property Grid: Showing up to {section.content.limit} {section.content.category ? `"${section.content.category}"` : 'latest'} properties ]
                        <br/>
                        <Button variant="outline" asChild className="mt-4"><Link href={`/listings${section.content.category ? `?category=${section.content.category}` : ''}`}>Browse Them All</Link></Button>
                      </div>
                    </div>
                  )
                default:
                  return null
              }
            })}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
