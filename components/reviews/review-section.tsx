"use client"

import { useState } from "react"
import useSWR from "swr"
import { Star, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import apiClient from "@/api/client"
import { useAuth } from "@/hooks/useAuth"

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    id: string
    name: string
    avatarUrl: string | null
  }
}

interface ReviewSectionProps {
  propertyId: string
}

export function ReviewSection({ propertyId }: ReviewSectionProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false) // Optimistic state

  const { data, isLoading, mutate } = useSWR<{reviews: Review[], averageRating: number, totalReviews: number}>(
    `/listings/${propertyId}/reviews`,
    async (url) => {
      const res = await apiClient.get(url)
      return res.data
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return alert("You must be logged in to leave a review")
    if (!comment.trim()) return alert("Please enter a comment")
    
    setIsSubmitting(true)
    try {
      await apiClient.post(`/listings/${propertyId}/reviews`, { rating, comment })
      setComment("")
      setRating(5)
      setHasReviewed(true)
      mutate() // Refresh reviews
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const userAlreadyReviewed = data?.reviews.some(r => r.user.id === user?.id) || hasReviewed

  return (
    <div className="space-y-8 mt-12">
      <div className="flex items-center gap-4 border-b pb-4">
        <h2 className="text-2xl font-black">Guest Reviews</h2>
        {data && data.totalReviews > 0 && (
          <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
            <Star className="h-4 w-4 fill-primary" />
            {data.averageRating.toFixed(1)} ({data.totalReviews})
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.reviews.map((review) => (
            <Card key={review.id} className="border-none bg-muted/30 shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                    <AvatarImage src={review.user.avatarUrl || undefined} />
                    <AvatarFallback>{review.user.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold">{review.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < review.rating ? "fill-yellow-500 text-yellow-500" : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              </CardContent>
            </Card>
          ))}
          {data?.reviews.length === 0 && (
             <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed">
               <MessageSquare className="mx-auto h-8 w-8 opacity-20 mb-3" />
               <p>No reviews yet. Be the first to share your experience!</p>
             </div>
          )}
        </div>
      )}

      {/* Review Form */}
      {user ? (
        !userAlreadyReviewed ? (
          <Card className="mt-8 shadow-md border-primary/10">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-lg">Leave a Review</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating ? "fill-yellow-500 text-yellow-500" : "fill-muted text-muted hover:fill-yellow-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Your Experience</label>
                  <Textarea
                    placeholder="Tell us about your stay or visit..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[120px] resize-y rounded-xl"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="rounded-full px-8 font-bold"
                >
                  {isSubmitting ? "Submitting..." : "Post Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 p-4 bg-green-500/10 text-green-700 rounded-xl text-center font-medium border border-green-500/20">
            Thank you for reviewing this property!
          </div>
        )
      ) : (
        <div className="mt-8 p-6 text-center bg-muted/30 rounded-2xl">
          <p className="text-muted-foreground mb-4">Please log in to leave a review.</p>
          <Button variant="outline" className="rounded-full" onClick={() => window.location.href='/login'}>
            Log In
          </Button>
        </div>
      )}
    </div>
  )
}
