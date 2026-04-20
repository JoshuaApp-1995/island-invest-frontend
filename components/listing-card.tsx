"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Home, Mountain, Building2, Store, Briefcase, Palmtree, Sparkles, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ListingWithImages, ListingCategory } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"

const categoryIcons: Record<ListingCategory, React.ReactNode> = {
  terrain: <Mountain className="h-3.5 w-3.5" />,
  house: <Home className="h-3.5 w-3.5" />,
  airbnb: <Building2 className="h-3.5 w-3.5" />,
  commercial: <Store className="h-3.5 w-3.5" />,
  business: <Briefcase className="h-3.5 w-3.5" />,
  tourism: <Palmtree className="h-3.5 w-3.5" />,
}

interface ListingCardProps {
  listing: ListingWithImages
}

import { getImageUrl } from "@/utils/image"

export function ListingCard({ listing }: ListingCardProps) {
  const primaryImage = listing.images?.[0]
  const imageUrl = getImageUrl(primaryImage?.pathname || "")

  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    return formatter.format(price)
  }

  return (
    <Link href={`/listings/${listing.slug || listing.id}`}>
      <Card className={`group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 ${listing.is_premium ? 'border-yellow-400 ring-1 ring-yellow-400' : ''}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          {primaryImage?.pathname?.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video
              src={imageUrl}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              muted
              playsInline
              onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
              onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
            />
          ) : (
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
          <Badge
            className="absolute left-3 top-3 flex items-center gap-1.5 bg-card/90 text-foreground backdrop-blur-sm"
          >
            {categoryIcons[listing.category]}
            {CATEGORY_LABELS[listing.category]}
          </Badge>
          {listing.is_premium && (
            <Badge
              className="absolute right-3 top-3 flex items-center gap-1 bg-yellow-500 text-white shadow-md"
            >
              <Sparkles className="h-3 w-3" />
              Premium
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{listing.location}</span>
          </div>
          <div className="flex items-start justify-between gap-2 mt-2">
            <h3 className="line-clamp-2 text-base font-semibold leading-tight text-foreground group-hover:text-primary">
              {listing.title}
            </h3>
            {listing.reviews && listing.reviews.length > 0 && (
              <div className="flex items-center gap-1 shrink-0 bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs font-bold">
                <Star className="h-3 w-3 fill-primary" />
                {(listing.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / listing.reviews.length).toFixed(1)}
              </div>
            )}
          </div>
          <p className="mt-2 text-lg font-bold text-accent">
            {formatPrice(listing.price, listing.currency)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
