"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Settings, Save, Bell, Shield, Palette, Globe, Loader2, Mail, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSettings, updateSettings } from "@/api/settings"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("IslandInvest")
  const [logo, setLogo] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings()
        if (data) {
          setSiteName(data.siteName || "")
          setLogo(data.logo || "")
          setContactEmail(data.contactEmail || "")
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSettings({ siteName, logo, contactEmail })
      toast({ title: "Success", description: "Settings updated successfully" })
    } catch (err) {
      toast({ title: "Error", description: "Failed to update settings", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      <PageHeader 
        title="Settings" 
        description="Configure your platform preferences, branding, and system integration."
        icon={Settings}
        actions={
          <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        }
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-2xl mb-8 flex-wrap h-auto">
          <TabsTrigger value="general" className="rounded-xl px-6 py-2.5 flex gap-2">
            <Globe className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="branding" className="rounded-xl px-6 py-2.5 flex gap-2">
            <Palette className="h-4 w-4" /> Branding
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl px-6 py-2.5 flex gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-6 py-2.5 flex gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
          <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Platform Information</CardTitle>
              <CardDescription>Update your site name and global contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input 
                  id="siteName" 
                  value={siteName} 
                  onChange={(e) => setSiteName(e.target.value)} 
                  className="rounded-xl" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="contactEmail" 
                    value={contactEmail} 
                    onChange={(e) => setContactEmail(e.target.value)} 
                    className="rounded-xl pl-10" 
                    placeholder="contact@islandinvest.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
          <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Logo & Brand</CardTitle>
              <CardDescription>Update your platform logo used in headers and emails.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="w-32 h-32 bg-muted rounded-2xl flex items-center justify-center border-2 border-dashed relative overflow-hidden group">
                  {logo ? (
                    <img src={logo} alt="Site Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid gap-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input 
                      id="logo" 
                      value={logo} 
                      onChange={(e) => setLogo(e.target.value)} 
                      className="rounded-xl" 
                      placeholder="https://..."
                    />
                    <p className="text-[10px] text-muted-foreground">Tip: Upload your logo to the Media Library and paste the link here.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="animate-in fade-in slide-in-from-bottom-2 duration-400">
           <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="py-20 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Notification preferences</h3>
              <p className="text-muted-foreground">Configure email alerts and push notifications for new inquiries.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="animate-in fade-in slide-in-from-bottom-2 duration-400">
          <Card className="rounded-3xl border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="py-20 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Security settings</h3>
              <p className="text-muted-foreground">Two-factor authentication, session management and API keys.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


