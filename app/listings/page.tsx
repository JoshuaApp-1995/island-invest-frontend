"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { Search, SlidersHorizontal, X, Map as MapIcon, LayoutGrid } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { ListingCategory } from "@/lib/types"
import { CATEGORY_LABELS, CARIBBEAN_LOCATIONS } from "@/lib/types"
import dynamic from "next/dynamic"

const ListingsMap = dynamic(() => import("@/components/listings-map"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
})

import { getListings } from "@/api/listings"

const categories = Object.keys(CATEGORY_LABELS) as ListingCategory[];
const fetcher = (params: any) => getListings(params)

function ListingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [view, setView] = useState<"grid" | "map">("grid")

  const queryParams = {
    search: search || undefined,
    category: category || undefined,
    location: location || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined
  }

  const { data: listings, isLoading } = useSWR(
    ["listings", queryParams],
    ([_, params]) => fetcher(params)
  )

  const updateUrl = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category) params.set("category", category)
    if (location) params.set("location", location)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    router.push(`/listings?${params.toString()}`)
  }

  useEffect(() => {
    const timer = setTimeout(updateUrl, 300)
    return () => clearTimeout(timer)
  }, [search, category, location, minPrice, maxPrice])

  const clearFilters = () => {
    setSearch("")
    setCategory("")
    setLocation("")
    setMinPrice("")
    setMaxPrice("")
    router.push("/listings")
  }

  const activeFiltersCount = [category, location, minPrice, maxPrice].filter(Boolean).length

  const FilterControls = () => (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Category</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Location</label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {CARIBBEAN_LOCATIONS.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Price Range</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Browse Listings</h1>
              <p className="mt-2 text-muted-foreground">
                Find your perfect Caribbean investment opportunity
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1">
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("grid")}
                className="h-8 px-3"
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Grid
              </Button>
              <Button
                variant={view === "map" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("map")}
                className="h-8 px-3"
              >
                <MapIcon className="mr-2 h-4 w-4" />
                Map
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 rounded-lg border border-border bg-card p-4">
                <h3 className="mb-4 font-semibold">Filters</h3>
                <FilterControls />
              </div>
            </aside>

            <div className="flex-1">
              <div className="mb-6 flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search listings..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2" variant="secondary">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterControls />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {activeFiltersCount > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {category && (
                    <Badge variant="secondary" className="gap-1">
                      {CATEGORY_LABELS[category as ListingCategory]}
                      <button onClick={() => setCategory("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {location && (
                    <Badge variant="secondary" className="gap-1">
                      {location}
                      <button onClick={() => setLocation("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {(minPrice || maxPrice) && (
                    <Badge variant="secondary" className="gap-1">
                      ${minPrice || "0"} - ${maxPrice || "∞"}
                      <button onClick={() => { setMinPrice(""); setMaxPrice("") }}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}

              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-5 w-4/5" />
                      <Skeleton className="h-6 w-1/4" />
                    </div>
                  ))}
                </div>
              ) : listings && listings.length > 0 ? (
                <>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {listings.length} listing{listings.length !== 1 && "s"} found
                  </p>
                  
                  {view === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {listings.map((listing: any) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>
                  ) : (
                    <div className="h-[calc(100vh-250px)] min-h-[500px]">
                      <ListingsMap listings={listings} />
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-lg text-muted-foreground">
                    No listings found matching your criteria.
                  </p>
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <Skeleton className="h-12 w-12 rounded-full" />
        </main>
      </div>
    }>
      <ListingsContent />
    </Suspense>
  )
}
