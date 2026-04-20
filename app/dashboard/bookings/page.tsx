"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Calendar, CheckCircle2, XCircle, Clock, Search, Filter, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"
import { fetcher } from "@/api/client"
import { updateBookingStatus, deleteBooking } from "@/api/bookings"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"

export default function BookingsPage() {
  const { data: bookingsData, error, mutate, isLoading } = useSWR('/bookings', fetcher)
  const bookings = bookingsData?.bookings || []

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateBookingStatus(id, status)
      mutate()
      toast({ title: "Status Updated", description: `Booking has been ${status}.` })
    } catch (err) {
      toast({ title: "Error", description: "Failed to update booking status.", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking record?")) return
    try {
      await deleteBooking(id)
      mutate()
      toast({ title: "Deleted", description: "Booking record has been removed." })
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete booking.", variant: "destructive" })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 rounded-full"><CheckCircle2 className="mr-1 h-3 w-3" /> Accepted</Badge>
      case 'rejected':
        return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none px-3 py-1 rounded-full"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none px-3 py-1 rounded-full">Cancelled</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-3 py-1 rounded-full"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Bookings & Reservations" 
        description="Manage guest requests and track property availability across your platform."
        icon={Calendar}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search guest or property..." className="pl-10 rounded-xl" />
        </div>
        <Button variant="outline" className="rounded-xl w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" /> Filter Status
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <Card key={booking.id} className="overflow-hidden border-none shadow-sm bg-card/50 backdrop-blur-sm hover:shadow-md transition-all rounded-2xl">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                  <div className="w-full md:w-48 h-32 bg-muted rounded-xl overflow-hidden shrink-0">
                    {booking.property?.media?.[0]?.url ? (
                      <img src={booking.property.media[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <Calendar className="text-primary/20 h-10 w-10" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">{booking.property?.title}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground pt-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Guest:</span> {booking.user?.name || booking.user?.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Check-in:</span> {format(new Date(booking.checkIn), "MMM dd, yyyy")}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Check-out:</span> {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6">
                    {booking.status === 'pending' && (
                      <>
                        <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl" onClick={() => handleStatusUpdate(booking.id, 'accepted')}>
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl" onClick={() => handleStatusUpdate(booking.id, 'rejected')}>
                          Reject
                        </Button>
                      </>
                    )}
                    {(booking.status !== 'pending') && (
                      <Button size="sm" variant="ghost" className="flex-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl" onClick={() => handleDelete(booking.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Calendar size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground max-w-sm">
              All reservation requests from your properties will appear here for you to manage.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
