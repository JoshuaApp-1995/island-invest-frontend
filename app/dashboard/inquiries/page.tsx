"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { Mail, Trash2, CheckCircle2, Clock, Loader2, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import useSWR from "swr"
import { fetcher } from "@/api/client"
import apiClient from "@/api/client"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"

export default function InquiriesPage() {
  const { data: inquiriesData, isLoading, mutate } = useSWR('/contact', fetcher)
  const inquiries = inquiriesData?.inquiries || []

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await apiClient.patch(`/contact/${id}/status`, { status })
      mutate()
      toast({ title: "Status Updated", description: "Inquiry status has been changed." })
    } catch (err) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return
    try {
      await apiClient.delete(`/contact/${id}`)
      mutate()
      toast({ title: "Inquiry Deleted", description: "The inquiry has been removed." })
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete inquiry.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Guest Inquiries" 
        description="Manage messages from potential investors and guests."
        icon={Mail}
      />

      <div className="flex gap-4 items-center justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inquiries..." className="pl-10 rounded-xl" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6">
          {inquiries.length > 0 ? inquiries.map((inquiry: any) => (
            <Card key={inquiry.id} className={`overflow-hidden border-none shadow-sm transition-all rounded-2xl ${inquiry.status === 'new' ? 'bg-primary/5 ring-1 ring-primary/20' : 'bg-card/50 backdrop-blur-sm'}`}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-border/50 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {inquiry.name[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold">{inquiry.name}</h3>
                        <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={14} />
                      {format(new Date(inquiry.createdAt), "PPP p")}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={inquiry.status === 'new' ? 'default' : 'secondary'} className="rounded-full">
                        {inquiry.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-lg mb-2">{inquiry.subject || "No Subject"}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex gap-3">
                        {inquiry.status === 'new' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-xl border-emerald-500/50 text-emerald-600 hover:bg-emerald-50"
                            onClick={() => handleStatusChange(inquiry.id, 'read')}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Read
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(inquiry.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </div>
                      <Button variant="link" className="text-primary font-bold" asChild>
                        <a href={`mailto:${inquiry.email}`}>Reply via Email</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-20 space-y-4 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-bold">No Inquiries Found</h3>
              <p className="text-muted-foreground">When guests send messages through the contact form, they will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
