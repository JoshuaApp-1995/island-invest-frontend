"use client"

import { useState, useEffect, Suspense } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Home, Plus, Search, Filter, Sparkles, MoreVertical, Edit, Trash2, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import useSWR from "swr"
import { fetcher } from "@/api/client"
import { toast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import apiClient from "@/api/client"

function PropertiesContent() {
  const searchParams = useSearchParams()
  const { data: listingsData, isLoading, mutate } = useSWR('/listings/me', fetcher)
  const listings = listingsData?.listings || []
  const [promoting, setPromoting] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('success')) {
      toast({ title: "Success!", description: "Your listing is now Premium!", className: "bg-green-600 text-white" })
    }
    if (searchParams.get('canceled')) {
      toast({ title: "Canceled", description: "Payment was not completed.", variant: "destructive" })
    }
  }, [searchParams])

  const handlePromote = async (id: string) => {
    setPromoting(id)
    try {
      const res = await apiClient.post('/payments/create-checkout-session', { 
        propertyId: id,
        type: 'premium_upgrade'
      })
      if (res.data.url) {
        window.location.href = res.data.url
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to initiate payment.", variant: "destructive" })
    } finally {
      setPromoting(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Properties" 
        description="Manage your real estate portfolio and track listing performance."
        icon={Home}
        actions={
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6">
            <Link href="/publish">
              <Plus className="mr-2 h-4 w-4" /> New Listing
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search your listings..." className="pl-10 rounded-xl" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="rounded-xl flex-1 sm:flex-none">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading your properties...</p>
          </div>
        ) : listings.length > 0 ? (
          listings.map((item: any) => (
            <Card key={item.id} className="rounded-2xl border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden group">
              <CardContent className="p-0 sm:p-4 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-full sm:w-32 h-32 shrink-0 bg-muted overflow-hidden sm:rounded-xl">
                  <img 
                    src={item.media?.[0]?.url || "/placeholder.jpg"} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                  />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1 p-4 sm:p-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold truncate">{item.title}</h3>
                    {item.isPremium && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-none gap-1 py-0.5">
                        <Sparkles size={10} /> Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Home size={12} /> {item.location}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <p className="text-lg font-black text-primary">${item.price.toLocaleString()}</p>
                    <Badge variant={item.status === 'published' ? 'default' : 'secondary'} className="rounded-md">
                      {item.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 sm:p-0 w-full sm:w-auto border-t sm:border-none">
                  {!item.isPremium && (
                    <Button 
                      onClick={() => handlePromote(item.id)}
                      disabled={promoting === item.id}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl shadow-lg shadow-yellow-500/20 px-6 flex-1 sm:flex-none"
                    >
                      {promoting === item.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                      Promote
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12">
                        <MoreVertical size={20} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl min-w-[160px]">
                      <DropdownMenuItem className="cursor-pointer gap-2 py-3">
                        <Edit size={16} /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 py-3" onClick={() => window.open(`/listings/${item.slug || item.id}`, '_blank')}>
                        <ExternalLink size={16} /> View Publicly
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer gap-2 py-3 text-destructive">
                        <Trash2 size={16} /> Delete Listing
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="rounded-2xl border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <Home size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">You haven't listed any property yet</h3>
              <p className="text-muted-foreground max-w-sm mb-8">
                Start monetizing your properties by publishing them on our platform.
              </p>
              <Button asChild className="rounded-xl px-8 h-12">
                <Link href="/publish">Publish My First Listing</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  )
}
