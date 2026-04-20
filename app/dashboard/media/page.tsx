'use client';

import { useState, useRef } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { Image as ImageIcon, Upload, Search, Grid, List, Trash2, Eye, Loader2, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSWR from 'swr';
import { fetcher } from '@/api/client';
import apiClient from '@/api/client';
import { toast } from '@/hooks/use-toast';

export default function MediaPage() {
  const { data: media, error, mutate, isLoading } = useSWR('/media', fetcher);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      mutate();
      toast({ title: "Success", description: "File uploaded successfully" });
    } catch (err) {
      console.error('Upload error:', err);
      toast({ title: "Error", description: "Failed to upload file", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await apiClient.delete(`/media/${id}`);
      mutate();
      toast({ title: "Success", description: "File deleted successfully" });
    } catch (err) {
      console.error('Delete error:', err);
      toast({ title: "Error", description: "Failed to delete file", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Media Library" 
        description="Organize and manage your images and videos used across the platform."
        icon={ImageIcon}
        actions={
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload} 
              accept="image/*,video/*"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl"
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search media..." className="pl-10 rounded-xl" />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="rounded-xl p-1 bg-muted/50 w-full sm:w-auto">
              <TabsTrigger value="grid" className="rounded-lg"><Grid className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="list" className="rounded-lg"><List className="h-4 w-4" /></TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media?.map((item: any, i: number) => (
            <Card key={item.id} className="group relative aspect-square overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-muted/50 animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col items-center justify-center gap-2">
                <div className="flex gap-2">
                  <Button size="icon" variant="secondary" className="rounded-xl h-8 w-8" onClick={() => window.open(`${apiClient.defaults.baseURL?.replace('/api', '')}${item.url}`, '_blank')}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="rounded-xl h-8 w-8" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="h-full w-full flex items-center justify-center bg-muted">
                {item.type === 'image' ? (
                  <img 
                    src={`${apiClient.defaults.baseURL?.replace('/api', '')}${item.url}`} 
                    alt={item.pathname} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Film size={32} />
                    <span className="text-[10px] uppercase font-bold">Video</span>
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-[10px] text-white truncate font-medium">{item.pathname}</p>
              </div>
            </Card>
          ))}

          {(!media || media.length === 0) && (
            <div className="col-span-full py-20 text-center flex flex-col items-center border-2 border-dashed rounded-3xl border-muted">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-bold">Your media library is empty</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Upload your first image or video to see it here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

