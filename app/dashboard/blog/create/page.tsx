"use client"

import { PostEditor } from "@/components/dashboard/post-editor"
import { createPost } from "@/api/posts"

export default function CreateBlogPost() {
  const handleSave = async (data: any) => {
    await createPost(data)
  }

  return <PostEditor onSave={handleSave} />
}
