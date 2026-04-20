"use client"

import { use, useEffect, useState } from "react"
import { PostEditor } from "@/components/dashboard/post-editor"
import { getPosts, updatePost } from "@/api/posts"
import { Loader2 } from "lucide-react"

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const posts = await getPosts()
        const found = posts.find((p: any) => p.id === id)
        if (found) {
          setPost(found)
        }
      } catch (err) {
        console.error("Failed to fetch post:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  const handleSave = async (data: any) => {
    await updatePost(id, data)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!post) {
    return <div className="text-center py-20 text-muted-foreground">Post not found</div>
  }

  return <PostEditor initialData={post} onSave={handleSave} />
}
