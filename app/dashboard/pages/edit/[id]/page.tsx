"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Loader2, Image as ImageIcon, Type, Video, Link as LinkIcon, Home as HomeIcon, LayoutGrid, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { getPages, updatePage } from "@/api/pages"
import Link from "next/link"

interface Section {
  id: string
  type: "text" | "image" | "video" | "button" | "gallery" | "properties"
  content: any
  order: number
}

const BLOCK_TYPES = [
  { id: "text", label: "Text Block", icon: Type },
  { id: "image", label: "Single Image", icon: ImageIcon },
  { id: "video", label: "Video Embed", icon: Video },
  { id: "button", label: "Call to Action Button", icon: LinkIcon },
  { id: "gallery", label: "Image Gallery", icon: LayoutGrid },
  { id: "properties", label: "Property Grid", icon: HomeIcon },
] as const

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [published, setPublished] = useState(true)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [showBlockMenu, setShowBlockMenu] = useState(false)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const pages = await getPages()
        const page = pages.find((p: any) => p.id === id)
        if (page) {
          setTitle(page.title)
          setSlug(page.slug)
          setPublished(page.published)
          setSections(page.content || [])
        }
      } catch (err) {
        console.error("Failed to fetch page:", err)
        setError("Failed to load page data")
      } finally {
        setLoading(false)
      }
    }
    fetchPage()
  }, [id])

  const handleAddSection = (type: Section['type']) => {
    const defaultContent = {
      text: { text: "<h2>New Section</h2><p>Start typing here...</p>" },
      image: { url: "", alt: "" },
      video: { url: "", platform: "youtube" },
      button: { text: "Click Here", link: "/", style: "primary" },
      gallery: { urls: ["", "", ""] },
      properties: { limit: 6, category: "" }
    }

    const newSection: Section = {
      id: Math.random().toString(),
      type,
      content: defaultContent[type],
      order: sections.length
    }
    setSections([...sections, newSection])
    setShowBlockMenu(false)
  }

  const handleRemoveSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId))
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) return;
    const newSections = [...sections];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];
    setSections(newSections);
  }

  const handleSectionChange = (sectionId: string, field: string, value: any) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, content: { ...s.content, [field]: value } }
      }
      return s
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      await updatePage(id, {
        title,
        slug,
        published,
        content: sections.map((s, idx) => ({ ...s, order: idx }))
      })
      router.push("/dashboard/pages")
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update page")
      setSaving(false)
    }
  }

  const renderSectionEditor = (section: Section, index: number) => {
    return (
      <div key={section.id} className="relative group p-6 border rounded-xl bg-white shadow-sm hover:border-primary/50 transition-colors">
        <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => moveSection(index, 'up')} disabled={index === 0} className="h-8 w-8">
            <ChevronUp size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1} className="h-8 w-8">
            <ChevronDown size={16} />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleRemoveSection(section.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-primary/10 text-primary rounded-md">
            {(() => {
              const Icon = BLOCK_TYPES.find(b => b.id === section.type)?.icon || Type;
              return <Icon size={18} />
            })()}
          </div>
          <span className="font-semibold capitalize text-foreground">{section.type} Block</span>
        </div>

        <div className="space-y-4">
          {section.type === 'text' && (
            <Textarea
              placeholder="Enter text (HTML supported)..."
              value={section.content.text}
              onChange={(e) => handleSectionChange(section.id, "text", e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          )}
          {section.type === 'image' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={section.content.url} onChange={(e) => handleSectionChange(section.id, "url", e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input value={section.content.alt} onChange={(e) => handleSectionChange(section.id, "alt", e.target.value)} placeholder="Description for SEO" />
              </div>
              {section.content.url && (
                <div className="sm:col-span-2 rounded-lg border overflow-hidden mt-2">
                  <img src={section.content.url} alt="Preview" className="w-full h-48 object-cover" />
                </div>
              )}
            </div>
          )}
          {section.type === 'video' && (
            <div className="space-y-2">
              <Label>YouTube / Video URL</Label>
              <Input value={section.content.url} onChange={(e) => handleSectionChange(section.id, "url", e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            </div>
          )}
          {section.type === 'button' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input value={section.content.text} onChange={(e) => handleSectionChange(section.id, "text", e.target.value)} placeholder="Click Here" />
              </div>
              <div className="space-y-2">
                <Label>Link URL</Label>
                <Input value={section.content.link} onChange={(e) => handleSectionChange(section.id, "link", e.target.value)} placeholder="/properties" />
              </div>
            </div>
          )}
          {section.type === 'gallery' && (
            <div className="space-y-4">
              <Label>Image URLs</Label>
              {section.content.urls.map((url: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <Input value={url} onChange={(e) => {
                    const newUrls = [...section.content.urls];
                    newUrls[i] = e.target.value;
                    handleSectionChange(section.id, "urls", newUrls);
                  }} placeholder={`Image URL ${i + 1}`} />
                  <Button variant="ghost" size="icon" onClick={() => {
                    const newUrls = section.content.urls.filter((_: any, idx: number) => idx !== i);
                    handleSectionChange(section.id, "urls", newUrls);
                  }}><Trash2 size={16}/></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => handleSectionChange(section.id, "urls", [...section.content.urls, ""])}>
                <Plus className="mr-2 h-4 w-4" /> Add Image Field
              </Button>
            </div>
          )}
          {section.type === 'properties' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Number of Listings to Show</Label>
                <Input type="number" value={section.content.limit} onChange={(e) => handleSectionChange(section.id, "limit", parseInt(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Filter by Category (optional)</Label>
                <Input value={section.content.category} onChange={(e) => handleSectionChange(section.id, "category", e.target.value)} placeholder="e.g. terrain, house" />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-100/80 backdrop-blur-md pt-4 pb-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/pages">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Visual Page Builder</h1>
            <p className="text-sm text-muted-foreground">Editing: {title}</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving} className="bg-primary hover:bg-primary/90 px-6">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Publish Changes
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-2">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Main Editor Canvas */}
        <div className="space-y-6">
          {sections.map((section, idx) => renderSectionEditor(section, idx))}
          
          {/* Add Block Menu */}
          <div className="pt-4">
            {showBlockMenu ? (
              <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Add New Block</CardTitle>
                  <CardDescription>Select a content block to add to your page.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {BLOCK_TYPES.map((block) => (
                    <button
                      key={block.id}
                      onClick={() => handleAddSection(block.id as any)}
                      className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border bg-white hover:border-primary hover:shadow-md transition-all group"
                    >
                      <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <block.icon size={24} />
                      </div>
                      <span className="text-sm font-medium">{block.label}</span>
                    </button>
                  ))}
                  <div className="col-span-full mt-2">
                    <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => setShowBlockMenu(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button 
                variant="outline" 
                className="w-full h-24 border-dashed border-2 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all text-lg rounded-xl" 
                onClick={() => setShowBlockMenu(true)}
              >
                <Plus className="mr-2 h-6 w-6" />
                Add Content Block
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card className="sticky top-28">
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. About Us"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground bg-muted px-3 py-2 rounded-md text-sm border border-input">/</span>
                  <Input 
                    id="slug" 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)} 
                    placeholder="about-us"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Visibility</Label>
                  <p className="text-xs text-muted-foreground">Make page public</p>
                </div>
                <Switch 
                  id="published" 
                  checked={published} 
                  onCheckedChange={setPublished}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
