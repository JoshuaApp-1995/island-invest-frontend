"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useSWR from "swr"

import { useAuth } from "../../../../hooks/useAuth"
import { fetcher } from "@/api/client"
import apiClient from "@/api/client"

export default function PromotePage() {
  const router = useRouter()
  const { id } = useParams()
  const { user, loading: userLoading } = useAuth()
  const { data: listingData, isLoading: listingLoading } = useSWR(id ? `/listings/${id}` : null, fetcher)
  
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login")
    }
  }, [user, userLoading, router])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    setError("")

    try {
      // 1. Upload receipt image
      const formData = new FormData()
      formData.append("file", file)
      
      const uploadRes = await apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      
      const uploadData = uploadRes.data

      // 2. Update listing status
      const res = await apiClient.patch(`/listings/${id}`, {
        paymentStatus: "pending",
        paymentReceipt: uploadData.pathname,
      })

      if (res.status !== 200) throw new Error("Failed to update listing")

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setUploading(false)
    }
  }

  if (userLoading || listingLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/50 p-4">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-10 pb-10">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl mb-2">Receipt Uploaded!</CardTitle>
              <CardDescription className="text-base mb-6">
                Your payment receipt has been received. Our team will verify it shortly and activate your Premium listing.
              </CardDescription>
              <Button asChild className="w-full">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/50 py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <Button variant="ghost" asChild className="mb-6 -ml-2">
            <Link href="/dashboard">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold">Promote Your Listing</h1>
            <p className="mt-2 text-muted-foreground">
              Highlight your property at the top of the search results for better visibility.
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bank Transfer Details</CardTitle>
                <CardDescription>
                  Please transfer the amount to one of our accounts and upload the receipt below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <p className="font-bold text-primary">Banco Popular</p>
                  <p className="text-sm">Account: 000-000000-0</p>
                  <p className="text-sm text-muted-foreground italic">Current Account - IslandInvest SRL</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="font-bold text-primary">Banreservas</p>
                  <p className="text-sm">Account: 999-999999-9</p>
                  <p className="text-sm text-muted-foreground italic">Savings Account - IslandInvest SRL</p>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-medium">Amount to Pay:</p>
                  <p className="text-2xl font-bold text-accent">RD$ 1,000.00 <span className="text-sm font-normal text-muted-foreground">/ 30 days</span></p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Receipt</CardTitle>
                <CardDescription>
                  Upload a screenshot or photo of your transfer confirmation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition hover:border-primary">
                    <input
                      type="file"
                      id="receipt"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <label htmlFor="receipt" className="cursor-pointer">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium">
                        {file ? file.name : "Click to select or drag and drop"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        PNG, JPG or PDF up to 5MB
                      </p>
                    </label>
                  </div>

                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={!file || uploading}>
                    {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
