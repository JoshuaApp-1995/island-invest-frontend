"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import useSWR from "swr"
import { fetcher } from "@/api/client"
import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { ListingWithImages } from "@/lib/types"

export function FeaturedListings() {
  const { data, isLoading } = useSWR<{ listings: ListingWithImages[] }>(
    "/listings?limit=6",
    fetcher
  )

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Featured Listings
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Explore our handpicked selection of premium investment opportunities
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:inline-flex">
            <Link href="/listings">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
              ))}
            </>
          ) : data?.listings && data.listings.length > 0 ? (
            data.listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground">
                No listings available yet. Be the first to publish one!
              </p>
              <Button asChild className="mt-4 bg-accent hover:bg-accent/90">
                <Link href="/publish">Publish a Listing</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/listings">
              View All Listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
