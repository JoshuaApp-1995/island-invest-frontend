"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, Eye, Loader2, Globe, Lock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPages, deletePage } from "@/api/pages"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PageHeader } from "@/components/dashboard/page-header"

export default function PagesManagement() {
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPages = async () => {
    try {
      const data = await getPages()
      setPages(data)
    } catch (error) {
      console.error("Failed to fetch pages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deletePage(id)
      fetchPages()
    } catch (error) {
      console.error("Failed to delete page:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Custom Pages" 
        description="Build and organize your website's content with our drag-and-drop page builder."
        icon={FileText}
        actions={
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6">
            <Link href="/dashboard/pages/create">
              <Plus className="mr-2 h-4 w-4" /> New Page
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4">
        {pages.length > 0 ? (
          pages.map((page) => (
            <Card key={page.id} className="group overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${page.published ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {page.published ? <Globe size={24} /> : <Lock size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{page.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">/{page.slug}</p>
                  </div>
                  <Badge variant={page.published ? "default" : "secondary"} className="ml-2 rounded-full px-3 text-[10px] font-bold uppercase tracking-wider">
                    {page.published ? "Live" : "Draft"}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl h-9 border-border/50 hover:bg-primary/5 hover:text-primary transition-all" asChild>
                    <Link href={`/page/${page.slug}`} target="_blank">
                      <Eye className="mr-1.5 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl h-9 border-border/50 hover:bg-primary/5 hover:text-primary transition-all" asChild>
                    <Link href={`/dashboard/pages/edit/${page.id}`}>
                      <Edit className="mr-1.5 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-xl h-9 text-destructive border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all">
                        <Trash2 className="mr-1.5 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">Delete this page?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          This will permanently remove the page content and URL from your live site. This action cannot be reversed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="rounded-xl">Keep it</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(page.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl px-6"
                        >
                          Confirm Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="rounded-3xl border-2 border-dashed border-border bg-transparent">
            <CardContent className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">No pages found</h3>
              <p className="text-muted-foreground max-w-xs mb-8">
                Create landing pages, about us, or contact pages for your platform.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-8 h-12 text-lg">
                <Link href="/dashboard/pages/create">
                  <Plus className="mr-2 h-5 w-5" /> Build First Page
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

