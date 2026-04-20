"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createListing } from "@/api/listings"
import apiClient from "@/api/client"
import { useAuth } from "@/hooks/useAuth"
import { Upload, X, Loader2, ImagePlus, MapPin } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import type { ListingCategory } from "@/lib/types"
import { CATEGORY_LABELS, CURRENCIES } from "@/lib/types"
import { DR_LOCATIONS } from "@/lib/locations"

const categories: ListingCategory[] = [
  "terrain",
  "house",
  "airbnb",
  "commercial",
  "business",
  "tourism",
]

interface UploadedImage {
  pathname: string
  previewUrl: string
}

export default function PublishPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useAuth()
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<ListingCategory>("house")
  const [price, setPrice] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [province, setProvince] = useState("")
  const [municipality, setMunicipality] = useState("")
  const [location, setLocation] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [images, setImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const municipalities = DR_LOCATIONS.find((p) => p.name === province)?.municipalities || []

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login")
    }
  }, [user, userLoading, router])

  useEffect(() => {
    // Sync the composite location field for the API
    if (province && municipality) {
      setLocation(`${municipality}, ${province}`)
    } else if (province) {
      setLocation(province)
    }
  }, [province, municipality])

  const handleImageUpload = useCallback(async (files: FileList) => {
    if (images.length + files.length > 15) {
      setError("Maximum 15 items (images or videos) allowed")
      return
    }

    setUploading(true)
    setError("")

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await apiClient.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })

        const previewUrl = URL.createObjectURL(file)
        
        setImages((prev) => [...prev, { pathname: res.data.pathname, previewUrl }])
      } catch (err: any) {
        setError(err.response?.data?.error || "Upload failed")
      }
    }

    setUploading(false)
  }, [images.length])

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].previewUrl)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title || !description || !category || !price || !province || !municipality) {
      setError("Please fill in all required fields including province and municipality")
      return
    }

    if (images.length === 0) {
      setError("Please upload at least one image or video")
      return
    }

    setSubmitting(true)

    try {
      const listingData = {
        title,
        description,
        category,
        price: parseFloat(price),
        currency,
        location: `${municipality}, ${province}`,
        phone,
        whatsapp,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        images: images.map((img) => ({ pathname: img.pathname })),
      }

      const listing = await createListing(listingData)
      router.push(`/listings/${listing.id}`)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create listing")
      setSubmitting(false)
    }
  }

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/50 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Publish a Listing</h1>
            <p className="mt-2 text-muted-foreground">
              Share your property or business opportunity with potential investors
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Images */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Photos</CardTitle>
                <CardDescription>
                  Upload up to 15 high-quality images or videos of your property
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-lg"
                    >
                      {image.previewUrl.startsWith("blob:") && image.pathname.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                        <video
                          src={image.previewUrl}
                          className="h-full w-full object-cover"
                          muted
                        />
                      ) : (
                        <Image
                          src={image.previewUrl}
                          alt={`Upload ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-card p-1 shadow-md transition hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                  {images.length < 15 && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition hover:border-primary hover:bg-muted">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                        disabled={uploading}
                      />
                      {uploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <ImagePlus className="h-8 w-8 text-muted-foreground" />
                          <span className="mt-2 text-xs text-muted-foreground text-center">Add Photos<br/>or Videos</span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="title">Title *</FieldLabel>
                    <Input
                      id="title"
                      placeholder="e.g., Stunning Beachfront Villa in Punta Cana"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="description">Description *</FieldLabel>
                    <Textarea
                      id="description"
                      placeholder="Describe your property in detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="category">Category *</FieldLabel>
                    <Select value={category} onValueChange={(v) => setCategory(v as ListingCategory)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {CATEGORY_LABELS[cat]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="price">Price *</FieldLabel>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="currency">Currency</FieldLabel>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((curr) => (
                            <SelectItem key={curr.value} value={curr.value}>
                              {curr.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <Field>
                      <FieldLabel htmlFor="phone">Contact Phone</FieldLabel>
                      <Input
                        id="phone"
                        placeholder="e.g., +1 809-000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="whatsapp">WhatsApp Number</FieldLabel>
                      <Input
                        id="whatsapp"
                        placeholder="e.g., +1 809-000-0000"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                      />
                    </Field>
                  </div>
                </FieldGroup>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="province">Province *</FieldLabel>
                      <Select value={province} onValueChange={(v) => {
                        setProvince(v)
                        setMunicipality("") // Reset municipality when province changes
                      }}>
                        <SelectTrigger>
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {DR_LOCATIONS.map((p) => (
                            <SelectItem key={p.name} value={p.name}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="municipality">Municipality *</FieldLabel>
                      <Select 
                        value={municipality} 
                        onValueChange={setMunicipality}
                        disabled={!province}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={province ? "Select municipality" : "First select a province"} />
                        </SelectTrigger>
                        <SelectContent>
                          {municipalities.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="latitude">Latitude (optional)</FieldLabel>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 18.5601"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="longitude">Longitude (optional)</FieldLabel>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        placeholder="e.g., -68.3725"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                      />
                    </Field>
                  </div>
                </FieldGroup>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90"
                disabled={submitting}
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publish Listing
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
