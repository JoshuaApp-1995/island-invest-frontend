"use client"

import { use } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SEO } from "@/components/seo"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Calendar, User } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { fetcher } from "@/api/client"
import { format } from "date-fns"

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { data: postData, isLoading } = useSWR(slug ? `/posts/slug/${slug}` : null, fetcher)
  const post = postData?.post

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="mx-auto max-w-3xl px-4 space-y-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Post not found</h1>
            <Button asChild className="mt-4"><Link href="/blog">Back to Blog</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SEO 
        title={post.metaTitle || post.title}
        description={post.metaDescription}
        keywords={post.keywords}
        type="article"
        image={post.image}
      />
      <Header />
      <main className="flex-1 bg-background py-16">
        <article className="mx-auto max-w-3xl px-4">
          <Button variant="ghost" asChild className="mb-8 rounded-xl">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
          </Button>

          <header className="space-y-6 mb-12">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-full px-4 py-1">
              {post.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {format(new Date(post.createdAt), "MMMM d, yyyy")}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                5 min read
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                IslandInvest Team
              </div>
            </div>
          </header>

          {post.image && (
            <div className="aspect-[16/9] mb-12 overflow-hidden rounded-[2rem] shadow-2xl">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed prose-a:text-primary">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="rounded-full px-3">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  )
}
