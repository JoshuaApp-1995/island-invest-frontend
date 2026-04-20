"use client"

import { PropertyEditor } from "@/components/dashboard/property-editor"
import { createListing } from "@/api/listings"

export default function CreatePropertyPage() {
  const handleSave = async (data: any) => {
    await createListing(data)
  }

  return <PropertyEditor onSave={handleSave} />
}
