"use client"

import { PageHeader } from "@/components/dashboard/page-header"
import { Users, Shield, Trash2, Mail, Calendar, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useSWR from "swr"
import { fetcher } from "@/api/client"
import { updateUserRole, deleteUser } from "@/api/admin"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const { data: usersData, isLoading, mutate } = useSWR('/admin/users', fetcher)
  const users = usersData?.users || []

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateUserRole(userId, role)
      mutate()
      toast({ title: "Role Updated", description: "User permissions have been changed." })
    } catch (err) {
      toast({ title: "Error", description: "Failed to update user role.", variant: "destructive" })
    }
  }

  const handleDelete = async (userId: string) => {
    if (userId === currentUser?.id) {
      toast({ title: "Error", description: "You cannot delete yourself.", variant: "destructive" })
      return
    }
    if (!confirm("Are you sure you want to delete this user? This action is permanent.")) return
    try {
      await deleteUser(userId)
      mutate()
      toast({ title: "User Deleted", description: "The user account has been removed." })
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="User Management" 
        description="Monitor activity, manage roles, and maintain platform security."
        icon={Users}
      />

      <div className="flex gap-4 items-center justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users by name or email..." className="pl-10 rounded-xl" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((u: any) => (
            <Card key={u.id} className="overflow-hidden border-none shadow-sm bg-card/50 backdrop-blur-sm hover:shadow-md transition-all rounded-2xl">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0 overflow-hidden">
                    {u.avatarUrl ? <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" /> : u.name?.[0] || u.email[0].toUpperCase()}
                  </div>
                  
                  <div className="flex-1 space-y-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <h3 className="text-lg font-bold">{u.name || "Unnamed User"}</h3>
                      {u.role === 'ADMIN' && <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase font-black"><Shield className="mr-1 h-3 w-3" /> Admin</Badge>}
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Mail size={14} /> {u.email}</div>
                      <div className="flex items-center gap-1.5"><Calendar size={14} /> Joined {format(new Date(u.createdAt), "MMM yyyy")}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                    <Select defaultValue={u.role} onValueChange={(val) => handleRoleChange(u.id, val)}>
                      <SelectTrigger className="w-32 rounded-xl h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="EDITOR">Editor</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(u.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
