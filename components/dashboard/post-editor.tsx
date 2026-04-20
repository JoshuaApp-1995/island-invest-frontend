"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Type, Settings, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

interface PostEditorProps {
  initialData?: any
  onSave: (data: any) => Promise<void>
}

export function PostEditor({ initialData, onSave }: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [category, setCategory] = useState(initialData?.category || "General")
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "")
  const [image, setImage] = useState(initialData?.image || "")
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "")
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "")
  const [keywords, setKeywords] = useState(initialData?.keywords || "")
  const [published, setPublished] = useState(initialData?.published ?? true)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug || !content) {
      toast({ title: "Error", description: "Title, Slug and Content are required", variant: "destructive" })
      return
    }

    setSaving(true)
    try {
      await onSave({
        title,
        slug,
        content,
        category,
        tags: tags.split(",").map(t => t.trim()).filter(t => t),
        image,
        metaTitle,
        metaDescription,
        keywords,
        published
      })
      toast({ title: "Success", description: "Post saved successfully" })
      router.push("/dashboard/blog")
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.error || "Failed to save post", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl">
            <Link href="/dashboard/blog">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{initialData ? 'Edit Post' : 'Create New Post'}</h1>
            <p className="text-sm text-muted-foreground">{title || "Untitled Post"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => window.open(`/blog/${slug}`, '_blank')}>
            <Eye className="mr-2 h-4 w-4" /> Preview
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="bg-primary hover:bg-primary/90 px-6 rounded-xl shadow-lg shadow-primary/20">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Post
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="bg-muted/50 p-1 rounded-xl mb-6">
              <TabsTrigger value="content" className="rounded-lg gap-2"><Type size={16} /> Content</TabsTrigger>
              <TabsTrigger value="seo" className="rounded-lg gap-2"><Settings size={16} /> SEO & Metadata</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
                <CardHeader>
                  <CardTitle>Article Details</CardTitle>
                  <CardDescription>Write your post content using HTML or plain text.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Post Title</Label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={(e) => {
                        setTitle(e.target.value)
                        if (!initialData && (!slug || slug === title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '').slice(0, -1))) {
                          setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))
                        }
                      }} 
                      placeholder="e.g. 5 Reasons to Invest in Punta Cana"
                      className="rounded-xl h-12 text-lg font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground bg-muted px-3 py-2 rounded-xl text-sm border">/blog/</span>
                      <Input 
                        id="slug" 
                        value={slug} 
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))} 
                        placeholder="punta-cana-investment"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content (HTML Support)</Label>
                    <Textarea 
                      id="content" 
                      value={content} 
                      onChange={(e) => setContent(e.target.value)} 
                      placeholder="Write your amazing post here..."
                      className="min-h-[400px] rounded-xl font-mono text-sm leading-relaxed"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>Optimize how this post appears in search engines.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">SEO Title</Label>
                    <Input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Keep it under 60 characters" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDesc">Meta Description</Label>
                    <Textarea id="metaDesc" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Brief summary for search results" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="investing, punta cana, guide" className="rounded-xl" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Status</Label>
                  <p className="text-xs text-muted-foreground">{published ? 'Visible to public' : 'Saved as draft'}</p>
                </div>
                <Switch checked={published} onCheckedChange={setPublished} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Investment" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="realestate, dominicanrepublic" className="rounded-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-xl flex flex-col items-center justify-center border-2 border-dashed relative overflow-hidden group">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon size={32} className="text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground text-center px-4">No image selected</span>
                  </>
                )}
                {image && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" variant="secondary" onClick={() => setImage("")}>Remove</Button>
                  </div>
                )}
              </div>
              <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" className="rounded-xl" />
              <p className="text-[10px] text-muted-foreground">Tip: Copy image URL from your Media Library</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
