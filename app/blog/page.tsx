"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SEO } from "@/components/seo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import useSWR from "swr"
import { fetcher } from "@/api/client"
import { format } from "date-fns"

export default function BlogPage() {
  const { data: postsData, isLoading } = useSWR('/posts', fetcher)
  const posts = postsData?.posts || []

  return (
    <div className="flex min-h-screen flex-col">
      <SEO 
        title="Real Estate Blog - Investment Tips & News"
        description="Stay informed about the Caribbean real estate market. Expert tips, investment guides, and news from IslandInvest."
      />
      <Header />
      <main className="flex-1 bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight">Our Blog</h1>
            <p className="mt-4 text-lg text-muted-foreground">Insights, trends, and guides for Caribbean real estate investors.</p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-96 rounded-3xl" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Card key={post.id} className="group overflow-hidden rounded-3xl border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  {post.image && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none rounded-full px-3">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                      {post.metaDescription || "Read our latest insights on this topic..."}
                    </p>
                    <Button variant="link" className="p-0 h-auto font-bold text-primary" asChild>
                      <Link href={`/blog/${post.slug}`}>Read More →</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
