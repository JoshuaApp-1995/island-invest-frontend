"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { SEO } from "@/components/seo"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageSquare, Send, Loader2 } from "lucide-react"
import useSWR from "swr"
import apiClient, { fetcher } from "@/api/client"
import { useAuth } from "@/hooks/useAuth"

interface Conversation {
  id: string
  user1: { id: string, name: string, avatarUrl: string | null }
  user2: { id: string, name: string, avatarUrl: string | null }
  property: { id: string, title: string, slug: string } | null
  updatedAt: string
  messages: Message[]
}

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  isRead: boolean
  createdAt: string
  sender: { id: string, name: string, avatarUrl: string | null }
}

export default function MessagesDashboardPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const { data: conversationsData, mutate: mutateConversations } = useSWR('/messages/conversations', fetcher, { refreshInterval: 5000 })
  const conversations: Conversation[] = conversationsData?.conversations || []

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  const { data: activeConversationData, mutate: mutateActiveChat } = useSWR(
    activeConversationId ? `/messages/conversations/${activeConversationId}` : null,
    fetcher,
    { refreshInterval: 2000 }
  )

  const activeChatMessages: Message[] = activeConversationData?.messages || []
  const activeConversationDetails: Conversation | null = activeConversationData?.conversation || null

  // Auto-start conversation from listing "Message Owner" redirect
  useEffect(() => {
    const receiverId = searchParams.get('receiverId')
    const propertyId = searchParams.get('propertyId')
    if (!receiverId || !user) return

    setIsStarting(true)
    apiClient.post('/messages/start-conversation', { receiverId, propertyId })
      .then((res) => {
        setActiveConversationId(res.data.conversationId)
        mutateConversations()
        // Clean URL without re-render
        window.history.replaceState({}, '', '/dashboard/messages')
      })
      .catch((err) => console.error('Failed to start conversation', err))
      .finally(() => setIsStarting(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Auto-select first conversation if none selected and no redirect pending
  useEffect(() => {
    if (!activeConversationId && !searchParams.get('receiverId') && conversations.length > 0) {
      setActiveConversationId(conversations[0].id)
    }
  }, [conversations, activeConversationId, searchParams])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConversationId) return

    setIsSending(true)
    try {
      await apiClient.post('/messages/send', {
        conversationId: activeConversationId,
        content: newMessage
      })
      setNewMessage("")
      mutateActiveChat()
      mutateConversations()
    } catch (error) {
      console.error("Failed to send message", error)
    } finally {
      setIsSending(false)
    }
  }

  const getOtherUser = (conv: Conversation) => {
    return conv.user1.id === user?.id ? conv.user2 : conv.user1
  }

  return (
    <div className="flex flex-col h-screen bg-muted/10">
      <SEO title="Messages | IslandInvest" />
      <Header />
      
      <main className="flex-1 overflow-hidden pt-20 px-4 pb-4 md:px-8 max-w-[1600px] w-full mx-auto">
        {isStarting ? (
          <div className="h-full flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="font-medium">Opening conversation...</span>
          </div>
        ) : (
        <Card className="h-full border-none shadow-xl flex flex-col md:flex-row overflow-hidden bg-background rounded-3xl">
          
          {/* Left Sidebar: Conversations List */}
          <div className={`w-full md:w-80 lg:w-96 border-r flex flex-col ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b bg-muted/5">
              <h2 className="text-xl font-black">Messages</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="mx-auto h-8 w-8 opacity-20 mb-3" />
                  <p>No active conversations.</p>
                </div>
              ) : (
                conversations.map(conv => {
                  const otherUser = getOtherUser(conv)
                  const lastMessage = conv.messages[0]
                  const isActive = activeConversationId === conv.id
                  
                  return (
                    <div 
                      key={conv.id}
                      onClick={() => setActiveConversationId(conv.id)}
                      className={`p-4 border-b cursor-pointer transition-colors hover:bg-muted/30 flex gap-3 ${isActive ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                    >
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={otherUser.avatarUrl || undefined} />
                        <AvatarFallback>{otherUser.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="font-bold text-sm truncate">{otherUser.name}</h4>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {new Date(conv.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {conv.property && (
                          <p className="text-[10px] font-bold text-primary truncate mb-1">
                            Regarding: {conv.property.title}
                          </p>
                        )}
                        <p className={`text-xs truncate ${lastMessage?.isRead === false && lastMessage?.senderId !== user?.id ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                          {lastMessage ? lastMessage.content : "No messages yet."}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Panel: Chat Thread */}
          <div className={`flex-1 flex flex-col ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
            {activeConversationId ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3 bg-background shadow-sm z-10">
                  <Button variant="ghost" size="icon" className="md:hidden mr-1" onClick={() => setActiveConversationId(null)}>
                    ←
                  </Button>
                  {activeConversationDetails && (
                    <>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={getOtherUser(activeConversationDetails).avatarUrl || undefined} />
                        <AvatarFallback>{getOtherUser(activeConversationDetails).name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-sm">{getOtherUser(activeConversationDetails).name}</h3>
                        {activeConversationDetails.property && (
                          <a href={`/listings/${activeConversationDetails.property.slug}`} className="text-xs text-primary hover:underline">
                            View Property: {activeConversationDetails.property.title}
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5 custom-scrollbar">
                  {activeChatMessages.map(msg => {
                    const isMe = msg.senderId === user?.id
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )
                  })}
                  {activeChatMessages.length === 0 && (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <p>Send a message to start the conversation.</p>
                    </div>
                  )}
                </div>

                {/* Message Input Form */}
                <div className="p-4 bg-background border-t">
                  <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <Input 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-xl bg-muted/50 border-none h-12"
                    />
                    <Button type="submit" disabled={!newMessage.trim() || isSending} className="rounded-xl h-12 px-6">
                      {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                <MessageSquare className="h-16 w-16 opacity-10 mb-4" />
                <p className="font-medium">Select a conversation to start messaging</p>
              </div>
            )}
          </div>

        </Card>
        )}
      </main>
    </div>
  )
}
