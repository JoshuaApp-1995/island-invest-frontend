"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createPage } from "@/api/pages"
import Link from "next/link"

export default function CreatePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug) {
      setError("Title and Slug are required")
      return
    }
    setLoading(true)
    setError("")

    try {
      const res = await createPage({
        title,
        slug,
        published,
        content: [] // Empty to start, edit in the Visual Builder
      })
      // Redirect to the visual builder
      router.push(`/dashboard/pages/edit/${res.id}`)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create page")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/pages">
            <ArrowLeft size={20} />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Page</h1>
          <p className="text-muted-foreground">Setup the basic details, then design it in the Visual Builder.</p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg font-medium">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
          <CardDescription>Enter the title and URL slug for your new page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => {
                setTitle(e.target.value)
                if (!slug || slug === title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '').slice(0, -1)) {
                  setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))
                }
              }} 
              placeholder="e.g. Services"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground bg-muted px-3 py-2 rounded-md border text-sm">/</span>
              <Input 
                id="slug" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))} 
                placeholder="services"
              />
            </div>
            <p className="text-xs text-muted-foreground">This will be the URL of the page (e.g. islandinvest.com/services)</p>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-0.5">
              <Label htmlFor="published">Start Published?</Label>
              <p className="text-xs text-muted-foreground">You can change this later.</p>
            </div>
            <Switch 
              id="published" 
              checked={published} 
              onCheckedChange={setPublished}
            />
          </div>

          <div className="pt-6">
            <Button onClick={handleSubmit} disabled={loading || !title || !slug} className="w-full bg-primary hover:bg-primary/90">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Create & Proceed to Visual Builder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
