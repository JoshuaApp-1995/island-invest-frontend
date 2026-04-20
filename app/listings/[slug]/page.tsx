"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"
import { MapPin, ArrowLeft, ChevronLeft, ChevronRight, User, Calendar, Share2, Mail, Phone, MessageCircle, ArrowRight, MessageSquare } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { SEO } from "@/components/seo"
import type { ListingWithImages, ListingCategory } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"
import dynamic from "next/dynamic"
import apiClient from "@/api/client"
import { getImageUrl } from "@/utils/image"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import type { OnApproveData } from "@paypal/paypal-js"

const ListingMap = dynamic(() => import("@/components/listing-map"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full rounded-lg" />,
})
import { ReviewSection } from "@/components/reviews/review-section"

const fetchListingBySlug = async (slug: string) => {
  const response = await apiClient.get(`/listings/slug/${slug}`)
  return response.data.listing
}

export default function ListingDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const { data: listing, isLoading } = useSWR(
    slug ? ["listing", slug] : null,
    ([_, s]) => fetchListingBySlug(s)
  )

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date))
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="mb-6 h-8 w-32" />
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Listing not found</h1>
            <p className="mt-2 text-muted-foreground">
              The listing you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button asChild className="mt-4">
              <Link href="/listings">Browse Listings</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": listing.title,
    "description": listing.description,
    "url": `https://islandinvest.com/listings/${listing.slug}`,
    "image": listing.images?.[0]?.url,
    "datePosted": listing.created_at,
    "offers": {
      "@type": "Offer",
      "price": listing.price,
      "priceCurrency": listing.currency,
      "availability": "https://schema.org/InStock"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": listing.location,
      "addressCountry": "DO"
    }
  }

  const nextImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length)
    }
  }

  const prevImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length)
    }
  }

  const currentImage = listing?.images?.[currentImageIndex]
  const imageUrl = getImageUrl(currentImage?.pathname || "")

  return (
    <div className="flex min-h-screen flex-col">
      <SEO 
        title={listing.metaTitle || listing.title}
        description={listing.metaDescription || listing.description.substring(0, 160)}
        keywords={listing.keywords}
        type="property"
        image={listing.images?.[0]?.url}
        jsonLd={jsonLd}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/listings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listings
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image/Video Gallery */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                {currentImage?.pathname?.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                  <video
                    src={imageUrl}
                    className="h-full w-full object-contain bg-black"
                    controls
                    playsInline
                  />
                ) : (
                  <Image
                    src={imageUrl}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                {listing.images && listing.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-card/80 p-2 backdrop-blur-sm transition hover:bg-card z-10"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-card/80 p-2 backdrop-blur-sm transition hover:bg-card z-10"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 z-10">
                      {listing.images.map((_: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`h-2 w-2 rounded-full transition ${
                            idx === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <Badge className="absolute right-3 top-3 bg-card/90 text-foreground backdrop-blur-sm z-10">
                  {CATEGORY_LABELS[listing.category as ListingCategory]}
                </Badge>
              </div>

              {/* Thumbnail Strip */}
              {listing.images && listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {listing.images.map((image: any, idx: number) => {
                    const thumbUrl = getImageUrl(image.pathname || "")
                    const isVideo = image.pathname?.match(/\.(mp4|webm|ogg|mov)$/i)
                    
                    return (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg ${
                          idx === currentImageIndex
                            ? "ring-2 ring-primary ring-offset-2"
                            : "opacity-70 hover:opacity-100"
                        }`}
                      >
                        {isVideo ? (
                          <div className="relative h-full w-full bg-black flex items-center justify-center">
                            <video src={thumbUrl} className="h-full w-full object-cover opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="rounded-full bg-white/20 p-1 backdrop-blur-sm">
                                <ChevronRight className="h-4 w-4 text-white fill-white" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={thumbUrl}
                            alt={`${listing.title} - Image ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Title and Location */}
              <div>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                  {listing.title}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.location}</span>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {listing.description}
                  </p>
                </CardContent>
              </Card>

              {/* Map */}
              {listing.latitude && listing.longitude && (
                <Card>
                  <CardHeader>
                    <CardTitle>Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ListingMap
                      latitude={listing.latitude}
                      longitude={listing.longitude}
                      title={listing.title}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              <ReviewSection propertyId={listing.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <Card className="rounded-3xl border-none shadow-xl bg-card overflow-hidden ring-1 ring-primary/10">
                <CardHeader className="bg-primary/5 pb-4">
                  <CardTitle className="text-xl font-black">Reserve Your Stay</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Check-in</label>
                      <input 
                        type="date" 
                        id="checkIn"
                        className="w-full bg-muted/50 border-none rounded-xl h-12 px-3 text-sm focus:ring-2 ring-primary transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Check-out</label>
                      <input 
                        type="date" 
                        id="checkOut"
                        className="w-full bg-muted/50 border-none rounded-xl h-12 px-3 text-sm focus:ring-2 ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-dashed space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">$${listing.price.toLocaleString()} x night</span>
                      <span className="font-bold">$${listing.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cleaning fee</span>
                      <span className="font-bold">$25.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-bold">Total</span>
                      <span className="text-2xl font-black text-primary">$${(listing.price + 25).toLocaleString()}</span>
                    </div>
                  </div>

                  <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test" }}>
                    <div className="space-y-4">
                      <Button 
                        className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-lg shadow-primary/20 group"
                        onClick={async () => {
                          const checkIn = (document.getElementById('checkIn') as HTMLInputElement).value;
                          const checkOut = (document.getElementById('checkOut') as HTMLInputElement).value;
                          if (!checkIn || !checkOut) return alert("Please select dates");
                          
                          try {
                            const res = await apiClient.post('/payments/create-checkout-session', {
                              propertyId: listing.id,
                              type: 'booking',
                              checkIn,
                              checkOut
                            });
                            if (res.data.url) window.location.href = res.data.url;
                          } catch (e) {
                            alert("Failed to start reservation. Are you logged in?");
                          }
                        }}
                      >
                        Pay with Card (Stripe)
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-dashed" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or pay with PayPal</span></div>
                      </div>

                      <PayPalButtons 
                        style={{ layout: "vertical", shape: "pill", label: "pay" }}
                        createOrder={async () => {
                          const checkIn = (document.getElementById('checkIn') as HTMLInputElement).value;
                          const checkOut = (document.getElementById('checkOut') as HTMLInputElement).value;
                          if (!checkIn || !checkOut) {
                            alert("Please select dates first");
                            throw new Error("Dates missing");
                          }
                          const res = await apiClient.post('/payments/paypal/create-order', {
                            propertyId: listing.id,
                            checkIn,
                            checkOut
                          });
                          return res.data.id;
                        }}
                        onApprove={async (data: OnApproveData) => {
                          try {
                            await apiClient.post('/payments/paypal/capture-order', {
                              orderID: data.orderID
                            });
                            alert("Booking successful! Redirecting...");
                            window.location.href = `/listings/${listing.slug}?booking_success=true`;
                          } catch (e) {
                            alert("Payment capture failed. Please contact support.");
                          }
                        }}
                      />
                    </div>
                  </PayPalScriptProvider>
                  <p className="text-[10px] text-center text-muted-foreground">You won't be charged yet if it's a request.</p>
                </CardContent>
              </Card>

              {/* Price Card */}
              <Card>
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-accent">
                    {formatPrice(listing.price, listing.currency)}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Listed on {formatDate(listing.created_at)}</span>
                  </div>
                  <div className="mt-6 space-y-3">
                    {listing.whatsapp && (
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                        <a href={`https://wa.me/${listing.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp
                        </a>
                      </Button>
                    )}
                    {listing.phone && (
                      <Button className="w-full bg-accent hover:bg-accent/90" asChild>
                        <a href={`tel:${listing.phone}`}>
                          <Phone className="mr-2 h-4 w-4" />
                          Call {listing.phone}
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Social Share Card */}
              <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-primary/5 pb-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Share2 size={20} className="text-primary" />
                    Share This Property
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="rounded-xl h-12 gap-2 border-[#1877F2]/20 hover:bg-[#1877F2]/5 hover:text-[#1877F2]"
                      onClick={async () => {
                        try {
                          await apiClient.post('/plugins/social-poster/share', {
                            title: listing.title,
                            url: window.location.href,
                            platform: 'facebook',
                            image: listing.images?.[0]?.url
                          })
                          alert("Shared to Facebook!")
                        } catch (e) {
                          alert("Failed to share. Make sure the plugin is enabled.")
                        }
                      }}
                    >
                      Facebook
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-xl h-12 gap-2 border-black/10 hover:bg-black/5"
                      onClick={async () => {
                        try {
                          await apiClient.post('/plugins/social-poster/share', {
                            title: listing.title,
                            url: window.location.href,
                            platform: 'twitter',
                            image: listing.images?.[0]?.url
                          })
                          alert("Shared to Twitter!")
                        } catch (e) {
                          alert("Failed to share. Make sure the plugin is enabled.")
                        }
                      }}
                    >
                      Twitter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Listed By</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={listing.owner?.avatarUrl || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {listing.owner?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{listing.owner?.name || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground">Property Owner</p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-bold shadow-none border-none"
                    onClick={() => {
                      if (!listing.owner?.id) return;
                      window.location.href = `/dashboard/messages?receiverId=${listing.owner.id}&propertyId=${listing.id}`;
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" /> 
                    Message Owner
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
