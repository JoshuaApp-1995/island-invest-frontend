"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createBooking } from "@/api/bookings"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface BookingFormProps {
  propertyId: string
  propertyName: string
}

export function BookingForm({ propertyId, propertyName }: BookingFormProps) {
  const { user } = useAuth()
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({ title: "Auth Required", description: "Please login to book a property.", variant: "destructive" })
      return
    }

    if (!checkIn || !checkOut) {
      toast({ title: "Dates Required", description: "Please select check-in and check-out dates.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      await createBooking({
        propertyId,
        userId: user.id,
        checkIn,
        checkOut
      })
      setSuccess(true)
      toast({ title: "Request Sent", description: "Your booking request has been sent to the owner." })
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.error || "Failed to send booking request.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-emerald-100 bg-emerald-50/30 overflow-hidden rounded-2xl border-none shadow-sm animate-in fade-in zoom-in duration-300">
        <CardContent className="pt-10 pb-10 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle2 size={32} />
          </div>
          <CardTitle className="text-xl">Request Sent!</CardTitle>
          <CardDescription className="max-w-xs mx-auto">
            We&apos;ve sent your booking request for <strong>{propertyName}</strong>. The owner will review it shortly.
          </CardDescription>
          <Button variant="outline" className="rounded-xl mt-4" onClick={() => setSuccess(false)}>
            Send Another Request
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-xl bg-card overflow-hidden rounded-2xl">
      <CardHeader className="bg-primary/5 pb-6">
        <CardTitle className="text-xl flex items-center gap-2">
          <CalendarIcon className="text-primary h-5 w-5" />
          Request Booking
        </CardTitle>
        <CardDescription>Select your desired dates to check availability.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check-in</Label>
              <Input 
                id="checkIn" 
                type="date" 
                value={checkIn} 
                onChange={(e) => setCheckIn(e.target.value)} 
                className="rounded-xl focus:ring-primary"
                min={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOut">Check-out</Label>
              <Input 
                id="checkOut" 
                type="date" 
                value={checkOut} 
                onChange={(e) => setCheckOut(e.target.value)} 
                className="rounded-xl focus:ring-primary"
                min={checkIn || format(new Date(), "yyyy-MM-dd")}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/20 rounded-xl transition-all hover:scale-[1.02]"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Request to Book"
              )}
            </Button>
            {!user && (
              <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-wider font-bold">
                Please login to request a booking
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
