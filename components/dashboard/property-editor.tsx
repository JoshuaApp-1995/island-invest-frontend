"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  MapPin, 
  DollarSign, 
  Tag, 
  Info, 
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Phone,
  MessageSquare,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { PageHeader } from "./page-header"

interface PropertyEditorProps {
  initialData?: any
  onSave: (data: any) => Promise<void>
}

export function PropertyEditor({ initialData, onSave }: PropertyEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "land",
    price: initialData?.price || "",
    currency: initialData?.currency || "USD",
    location: initialData?.location || "",
    phone: initialData?.phone || "",
    whatsapp: initialData?.whatsapp || "",
    status: initialData?.status || "published",
    media: initialData?.media || [],
    slug: initialData?.slug || "",
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    keywords: initialData?.keywords || ""
  })

  const categories = [
    { value: "land", label: "Land/Lot" },
    { value: "house", label: "House" },
    { value: "apartment", label: "Apartment" },
    { value: "commercial", label: "Commercial" },
    { value: "villa", label: "Villa" }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleMediaAdd = () => {
    const url = prompt("Enter Image/Video URL from Media Library")
    if (url) {
      const pathname = url.split('/').pop() || "media"
      setFormData(prev => ({
        ...prev,
        media: [...prev.media, { url, pathname }]
      }))
    }
  }

  const handleMediaRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_: any, i: number) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
      toast({ title: "Success", description: `Property ${initialData ? "updated" : "created"} successfully!` })
      router.push("/dashboard")
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.response?.data?.error || "Failed to save property.", 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <PageHeader 
        title={initialData ? "Edit Property" : "New Property"} 
        description="Enter the details for your Caribbean investment opportunity."
        icon={Tag}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()} className="rounded-xl px-6 border-border/50">
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {initialData ? "Update Property" : "Publish Property"}
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-primary/5 pb-8">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>Tell us about the property and its unique selling points.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Property Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Luxury Beachfront Land in Punta Cana" 
                  value={formData.title}
                  onChange={handleChange}
                  className="rounded-xl h-12"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the land, amenities, views, and development potential..." 
                  className="rounded-2xl min-h-[200px]"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-primary/5 pb-8">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Media Gallery
              </CardTitle>
              <CardDescription>Add high-quality photos and videos to showcase the property.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.media.map((item: any, index: number) => (
                  <div key={index} className="group relative aspect-square bg-muted rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary transition-all">
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => handleMediaRemove(index)}
                      className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-primary/90 text-[10px] uppercase font-bold py-0 h-5">Cover</Badge>
                      </div>
                    )}
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={handleMediaAdd}
                  className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary group"
                >
                  <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                    <Plus size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Add Media</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-primary/5 pb-8">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Pricing & Category
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                >
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.price}
                    onChange={handleChange}
                    className="rounded-xl h-12 pl-8"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                >
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-primary/5 pb-8">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Location & Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="location">Location Name</Label>
                <Input 
                  id="location" 
                  placeholder="e.g. Bavaro, Punta Cana" 
                  value={formData.location}
                  onChange={handleChange}
                  className="rounded-xl h-12"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    placeholder="+1 (829) 000-0000" 
                    value={formData.phone}
                    onChange={handleChange}
                    className="rounded-xl h-12 pl-11"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="whatsapp" 
                    placeholder="+1 (829) 000-0000" 
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="rounded-xl h-12 pl-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-primary/5 pb-8">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                SEO Optimization
              </CardTitle>
              <CardDescription>Improve your visibility on Google and social media.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="slug">Custom Slug (URL)</Label>
                <Input 
                  id="slug" 
                  placeholder="e.g. luxury-beachfront-land" 
                  value={formData.slug}
                  onChange={handleChange}
                  className="rounded-xl h-12"
                />
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-1">Auto-generated if left blank</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaTitle">SEO Meta Title</Label>
                <Input 
                  id="metaTitle" 
                  placeholder="Focus keyword | Site Name" 
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaDescription">SEO Meta Description</Label>
                <Textarea 
                  id="metaDescription" 
                  placeholder="A compelling summary for search results (max 160 chars)..." 
                  value={formData.metaDescription}
                  onChange={handleChange}
                  className="rounded-2xl min-h-[100px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input 
                  id="keywords" 
                  placeholder="punta cana, investment, land, beach" 
                  value={formData.keywords}
                  onChange={handleChange}
                  className="rounded-xl h-12"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
