import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MessageSquare } from 'lucide-react';
import { Chat, USERS } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';

interface SidebarProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  className?: string;
}

export function Sidebar({ chats, selectedChatId, onSelectChat, className }: SidebarProps) {
  return (
    <div className={cn("flex flex-col h-full bg-sidebar border-r border-sidebar-border", className)}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
               <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-xl">Pulse</h1>
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Plus className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search messages..." 
            className="pl-9 bg-background/50 border-none shadow-sm focus-visible:ring-1" 
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-1">
          {chats.map((chat) => {
            const otherUser = chat.participants[0];
            const lastMessage = chat.messages[chat.messages.length - 1];
            const isSelected = selectedChatId === chat.id;

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group",
                  isSelected 
                    ? "bg-primary/10 shadow-sm" 
                    : "hover:bg-sidebar-accent/50"
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-background">
                    <AvatarImage src={otherUser.avatar} />
                    <AvatarFallback>{otherUser.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  {otherUser.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className={cn(
                      "font-medium truncate",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {otherUser.name}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {lastMessage && formatDistanceToNow(lastMessage.timestamp, { addSuffix: false }).replace('about ', '')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className={cn(
                      "text-sm truncate max-w-[180px]",
                      isSelected ? "text-primary/80" : "text-muted-foreground group-hover:text-foreground/80"
                    )}>
                      {chat.isTyping ? (
                        <span className="text-primary animate-pulse">Typing...</span>
                      ) : (
                        lastMessage?.content || "No messages yet"
                      )}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full animate-in zoom-in">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">You</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
