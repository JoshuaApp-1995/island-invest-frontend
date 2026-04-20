"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react"
import apiClient from "@/api/client"
import { toast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiClient.post("/contact", formData)
      setSuccess(true)
      toast({ title: "Message Sent", description: "We've received your message and will get back to you soon." })
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (err) {
      toast({ title: "Error", description: "Failed to send message. Please try again later.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold">Contact Us</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We&apos;re here to help you find your next big investment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 rounded-3xl border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-primary/5 pb-8">
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                {success ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-bold">Message Received!</h3>
                    <p className="text-muted-foreground">Thank you for reaching out. Our team will contact you shortly.</p>
                    <Button variant="outline" onClick={() => setSuccess(false)} className="rounded-xl">Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required className="rounded-xl h-12" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required className="rounded-xl h-12" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Input id="subject" placeholder="Investment Inquiry" value={formData.subject} onChange={handleChange} className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <Textarea id="message" placeholder="How can we help you?" rows={6} value={formData.message} onChange={handleChange} required className="rounded-2xl" />
                    </div>
                    <Button disabled={loading} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary/10 p-3">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">Call Us</p>
                      <p className="text-sm text-muted-foreground">+1 (809) 555-0123</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary/10 p-3">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">Email Us</p>
                      <p className="text-sm text-muted-foreground">info@islandinvest.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary/10 p-3">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">Office</p>
                      <p className="text-sm text-muted-foreground">Punta Cana Village, Suite 402<br />Dominican Republic</p>
                    </div>
                  </div>
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

