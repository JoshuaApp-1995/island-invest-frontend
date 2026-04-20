"use client"

import { useAuth } from "../../hooks/useAuth"
import { deleteListing } from "@/api/listings"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Loader2, 
  MapPin, 
  Sparkles, 
  LayoutDashboard,
  TrendingUp,
  Users,
  Home,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { ListingWithImages, ListingCategory } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"
import { getImageUrl } from "@/utils/image"
import Image from "next/image"
import { PageHeader } from "@/components/dashboard/page-header"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useAuth()
  const { data: listingsData, isLoading: listingsLoading, mutate } = useSWR(
    user ? `/api/listings?userId=${user.id}` : null,
    fetcher
  )

  const handleDelete = async (id: string) => {
    try {
      await deleteListing(id)
      mutate()
    } catch (error) {
      console.error("Failed to delete listing:", error)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const { data: statsData } = useSWR(
    user?.role === 'ADMIN' ? '/admin/stats' : null,
    fetcher
  )

  const stats = statsData || {
    properties: listings.length,
    users: 0,
    posts: 0,
    bookings: 0
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  const listings: ListingWithImages[] = listingsData?.listings || []

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Overview" 
        description={`Welcome back to your command center, ${user.name?.split(' ')[0]}. Here's what's happening today.`}
        icon={LayoutDashboard}
        actions={
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6">
            <Link href="/dashboard/properties/create">
              <Plus className="mr-2 h-4 w-4" /> New Listing
            </Link>
          </Button>
        }
      />

      {/* Modern Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Properties" 
          value={stats.properties.toString()} 
          change="+12.5%" 
          isUp={true} 
          icon={Home} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Users" 
          value={user.role === 'ADMIN' ? stats.users.toString() : "N/A"} 
          change="+18.2%" 
          isUp={true} 
          icon={Users} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Total Posts" 
          value={user.role === 'ADMIN' ? stats.posts.toString() : "N/A"} 
          change="-4.3%" 
          isUp={false} 
          icon={FileText} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Bookings" 
          value={stats.bookings.toString()} 
          change="+24.1%" 
          isUp={true} 
          icon={Sparkles} 
          color="bg-violet-500" 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Listing Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Recent Listings</h2>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-primary/5 rounded-lg">
              <Link href="/dashboard/properties">View all properties</Link>
            </Button>
          </div>

          {listingsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-2xl" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid gap-4">
              {listings.slice(0, 5).map((listing) => {
                const primaryImage = listing.images?.[0]
                const imageUrl = getImageUrl(primaryImage?.pathname || "")

                return (
                  <Card key={listing.id} className="group overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative h-40 w-full sm:w-48 shrink-0 overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={listing.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-2 left-2 flex gap-1">
                            {listing.is_premium && (
                              <Badge className="bg-yellow-500/90 border-none backdrop-blur-md">
                                <Sparkles className="mr-1 h-3 w-3" />
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">{listing.title}</h3>
                                <Badge variant={listing.status === "published" ? "default" : "secondary"} className="rounded-full text-[10px] uppercase font-bold py-0 h-5">
                                  {listing.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MapPin size={12} className="text-primary" />
                                {listing.location}
                              </div>
                            </div>
                            <p className="font-bold text-lg text-primary">
                              {formatPrice(listing.price, listing.currency)}
                            </p>
                          </div>

                          <div className="mt-auto pt-4 flex items-center justify-between">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs font-medium border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all" asChild>
                                <Link href={`/dashboard/properties/edit/${listing.id}`}>Edit</Link>
                              </Button>
                              <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs font-medium border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all" asChild>
                                <Link href={`/listings/${listing.id}`}>View</Link>
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 size={16} />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-2xl font-bold">Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-muted-foreground">
                                      This will permanently delete your listing and remove all data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="mt-6">
                                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(listing.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl px-6"
                                    >
                                      Delete Forever
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="rounded-3xl border-2 border-dashed border-border bg-transparent">
              <CardContent className="py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Home className="text-muted-foreground" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Start your journey</h3>
                <p className="text-muted-foreground max-w-xs mb-8">
                  You haven&apos;t published any listings yet. Create your first property listing to reach thousands of investors.
                </p>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-8 h-12 text-lg">
                  <Link href="/dashboard/properties/create">
                    <Plus className="mr-2 h-5 w-5" /> Create Your First Listing
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Performance</h2>
          <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Inquiries Activity</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical size={16} /></Button>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-end justify-between gap-1 mt-4 px-2">
                {[45, 67, 43, 89, 56, 78, 92].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                      className="w-full bg-primary/20 rounded-t-lg transition-all duration-500 group-hover:bg-primary relative" 
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {height} reqs
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={120} />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Go Premium</CardTitle>
              <CardDescription className="text-primary-foreground/70">
                Unlock 10x more visibility and advanced analytics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full rounded-xl font-bold">Upgrade Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, isUp, icon: Icon, color }: { title: string, value: string, change: string, isUp: boolean, icon: any, color: string }) {
  return (
    <Card className="rounded-3xl border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm group overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-transform duration-300 group-hover:scale-110`}>
            <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
            {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-extrabold mt-1 tracking-tight">{value}</h3>
        </div>
      </CardContent>
    </Card>
  )
}

