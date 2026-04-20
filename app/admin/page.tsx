"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Check, X, Eye, Loader2, ShieldCheck, ExternalLink } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ListingWithImages } from "@/lib/types"

import { useAuth } from "../../hooks/useAuth"
import { fetcher } from "@/api/client"
import apiClient from "@/api/client"

export default function AdminPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useAuth()
  
  const { data: pendingData, isLoading: pendingLoading, mutate } = useSWR(
    user?.role === "ADMIN" ? "/admin/pending-payments" : null,
    fetcher
  )

  useEffect(() => {
    if (!userLoading && (!user || user.role !== "ADMIN")) {
      router.push("/dashboard")
    }
  }, [user, userLoading, router])

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      const res = await apiClient.post(`/admin/payments/${id}`, { action })
      if (res.status === 200) {
        mutate()
      }
    } catch (error) {
      console.error("Failed to process payment:", error)
    }
  }

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user?.role !== "ADMIN") return null

  const pendingListings: ListingWithImages[] = pendingData?.listings || []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pending Premium Approvals</CardTitle>
              <CardDescription>
                Review uploaded receipts and activate premium status for listings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : pendingListings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Listing</th>
                        <th className="px-4 py-3 font-semibold">User</th>
                        <th className="px-4 py-3 font-semibold">Receipt</th>
                        <th className="px-4 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {pendingListings.map((listing) => (
                        <tr key={listing.id} className="hover:bg-muted/30">
                          <td className="px-4 py-4">
                            <p className="font-medium">{listing.title}</p>
                            <p className="text-xs text-muted-foreground">{listing.location}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p>{listing.user_name || "Unknown"}</p>
                          </td>
                          <td className="px-4 py-4">
                            <Button variant="link" size="sm" asChild className="p-0 h-auto">
                              <a 
                                href={`/api/file?pathname=${encodeURIComponent(listing.payment_receipt || "")}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-1"
                              >
                                View Receipt <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </td>
                          <td className="px-4 py-4 text-right space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleAction(listing.id, "approve")}
                            >
                              <Check className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-destructive hover:bg-destructive/5"
                              onClick={() => handleAction(listing.id, "reject")}
                            >
                              <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  No pending payments to review.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
