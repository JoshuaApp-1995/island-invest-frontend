"use client"

import { use, useEffect, useState } from "react"
import { PropertyEditor } from "@/components/dashboard/property-editor"
import { getListingById, updateListing } from "@/api/listings"
import { Loader2 } from "lucide-react"

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getListingById(id)
        setProperty(data)
      } catch (err) {
        console.error("Failed to fetch property:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [id])

  const handleSave = async (data: any) => {
    await updateListing(id, data)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!property) {
    return <div className="text-center py-20 text-muted-foreground">Property not found</div>
  }

  return <PropertyEditor initialData={property} onSave={handleSave} />
}
