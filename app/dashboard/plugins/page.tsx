"use client"

import { useState, useEffect } from "react"
import { Puzzle, Loader2, Power, PowerOff, Settings, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { getPlugins, togglePlugin } from "@/api/plugins"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  const fetchPlugins = async () => {
    try {
      const data = await getPlugins()
      setPlugins(data)
    } catch (error) {
      console.error("Failed to fetch plugins:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlugins()
  }, [])

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await togglePlugin(id, !currentStatus)
      setMessage(res.message)
      fetchPlugins()
    } catch (error) {
      console.error("Failed to toggle plugin:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Plugin Manager</h1>
        <p className="mt-1 text-muted-foreground">Extend your platform functionality with modular plugins.</p>
      </div>

      {message && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Action Required</AlertTitle>
          <AlertDescription className="text-blue-700">
            {message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {plugins.length > 0 ? (
          plugins.map((plugin) => (
            <Card key={plugin.id} className={plugin.enabled ? "border-primary/20" : "opacity-75"}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${plugin.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Puzzle size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-xl capitalize">{plugin.name.replace(/-/g, ' ')}</CardTitle>
                    <CardDescription>Version 1.0.0</CardDescription>
                  </div>
                </div>
                <Switch 
                  checked={plugin.enabled} 
                  onCheckedChange={() => handleToggle(plugin.id, plugin.enabled)}
                />
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-6">
                  {plugin.name === 'contact-form' 
                    ? 'Adds a customizable contact form with email notifications and submission tracking.' 
                    : 'No description provided for this plugin.'}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {plugin.enabled ? (
                      <span className="flex items-center text-xs font-medium text-green-600">
                        <Power className="mr-1 h-3 w-3" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-medium text-muted-foreground">
                        <PowerOff className="mr-1 h-3 w-3" /> Inactive
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Settings className="mr-1.5 h-3.5 w-3.5" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl">
            <Puzzle className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-lg font-medium">No plugins detected</h3>
            <p className="text-muted-foreground">Drop plugin folders into the backend/src/plugins directory to see them here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
