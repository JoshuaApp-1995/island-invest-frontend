'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { Rss, Plus, Search, Filter, Edit, Trash2, Loader2, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useSWR from 'swr';
import { fetcher } from '@/api/client';
import apiClient from '@/api/client';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

export default function BlogPage() {
  const { data: postsData, error, mutate, isLoading } = useSWR('/posts', fetcher);
  const posts = postsData?.posts || [];

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await apiClient.delete(`/posts/${id}`);
      mutate();
      toast({ title: "Success", description: "Post deleted successfully" });
    } catch (err) {
      console.error('Delete error:', err);
      toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Blog Posts" 
        description="Manage your articles, news, and updates for the IslandInvest blog."
        icon={Rss}
        actions={
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl">
            <Link href="/dashboard/blog/create">
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search posts..." className="pl-10 rounded-xl" />
        </div>
        <Button variant="outline" className="rounded-xl w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : posts.length > 0 ? (
        <div className="grid gap-6">
          {posts.map((post: any) => (
            <Card key={post.id} className="group overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-md transition-all bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0 flex flex-col md:flex-row">
                <div className="w-full md:w-64 h-48 bg-muted relative shrink-0">
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Rss size={48} className="text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-primary/90 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag size={14} />
                        {post.tags?.join(', ') || 'No tags'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{post.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {post.metaDescription || "No description provided."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${post.published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-xs font-medium uppercase tracking-wider">{post.published ? 'Published' : 'Draft'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary">
                        <Link href={`/dashboard/blog/edit/${post.id}`}>
                          <Edit size={18} />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 size={18} />
                      </Button>
                    </div>
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
              <Rss size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No posts found</h3>
            <p className="text-muted-foreground max-w-sm mb-8">
              You haven&apos;t created any blog posts yet. Start sharing updates and property news with your audience.
            </p>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/dashboard/blog/create">Create your first post</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

