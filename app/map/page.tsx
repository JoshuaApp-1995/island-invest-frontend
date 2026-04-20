"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SEO } from "@/components/seo"
import { MapPin, Search, Filter, DollarSign, Home, Mountain, Building2, Store, Briefcase, Palmtree, SlidersHorizontal, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import useSWR from "swr"
import { fetcher } from "@/api/client"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const ListingsMap = dynamic(() => import("@/components/listings-map"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-3xl" />,
})

import { getImageUrl } from "@/utils/image"
import { CATEGORY_LABELS, type ListingCategory } from "@/lib/types"

export default function MapDiscoveryPage() {
  const { data: listingsData, isLoading } = useSWR('/listings', fetcher)
  const listings = listingsData?.listings || []

  // Filters State
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [showFilters, setShowFilters] = useState(false)

  const filteredListings = useMemo(() => {
    return listings.filter((item: any) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                            item.location.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === "all" || item.category === category
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1]
      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [listings, search, category, priceRange])

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <SEO 
        title="Map Discovery - Find Your Island Property"
        description="Explore Caribbean real estate opportunities on our interactive map. Filter by price, location, and property type."
      />
      <Header />
      
      <main className="flex-1 flex flex-col md:flex-row relative">
        {/* Left Sidebar: Filters & Results */}
        <div className={`absolute md:relative z-20 w-full md:w-[400px] bg-background/95 backdrop-blur-md border-r border-border h-full transition-transform duration-300 ${showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black tracking-tight">Discovery</h1>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowFilters(false)}>
                  <X />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search location or title..." 
                    className="pl-10 rounded-xl bg-muted/50 border-none h-12"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Property Type</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'terrain', 'house', 'airbnb', 'commercial', 'business', 'tourism'].map((cat) => (
                      <Badge 
                        key={cat}
                        variant={category === cat ? "default" : "outline"}
                        className={`cursor-pointer rounded-full px-4 py-1.5 transition-all ${category === cat ? 'bg-primary shadow-lg shadow-primary/20' : 'hover:bg-primary/5'}`}
                        onClick={() => setCategory(cat)}
                      >
                        {cat === 'all' ? 'All' : CATEGORY_LABELS[cat as ListingCategory]}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-5 pt-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price Range</label>
                    <span className="text-sm font-bold text-primary">${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}+</span>
                  </div>
                  <Slider 
                    defaultValue={[0, 5000000]} 
                    max={5000000} 
                    step={10000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="px-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground font-medium">{filteredListings.length} properties found</p>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              </div>

              {filteredListings.map((item: any) => {
                const imageUrl = getImageUrl(item.media?.[0]?.pathname || "")
                const isVideo = item.media?.[0]?.pathname?.match(/\.(mp4|webm|ogg|mov)$/i)

                return (
                  <Card key={item.id} className="group overflow-hidden border-none bg-muted/30 hover:bg-muted/50 transition-all rounded-2xl cursor-pointer" onClick={() => window.location.href = `/listings/${item.slug || item.id}`}>
                    <CardContent className="p-0 flex">
                      <div className="w-24 h-24 shrink-0 overflow-hidden bg-black relative">
                        {isVideo ? (
                          <video src={imageUrl} className="w-full h-full object-cover opacity-70" />
                        ) : (
                          <img src={imageUrl || "/placeholder.jpg"} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        )}
                      </div>
                      <div className="p-3 flex flex-col justify-center min-w-0">
                        <h3 className="font-bold text-sm truncate">{item.title}</h3>
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                          <MapPin size={10} /> {item.location}
                        </p>
                        <p className="text-sm font-black text-primary mt-1">${item.price.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {filteredListings.length === 0 && !isLoading && (
                <div className="text-center py-20 opacity-50">
                  <MapPin className="mx-auto h-12 w-12 mb-4" />
                  <p className="font-medium">No properties in this area</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Content: The Map */}
        <div className="flex-1 relative">
          <ListingsMap listings={filteredListings} />
          
          <Button 
            className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-30 bg-primary/95 backdrop-blur-sm shadow-2xl rounded-full px-8 py-6 text-lg font-bold"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="mr-2" /> Filters
          </Button>
        </div>
      </main>
    </div>
  )
}
