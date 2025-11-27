import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Video, MoreVertical, Paperclip, Send, Smile } from 'lucide-react';
import { Chat, Message, CURRENT_USER } from '@/lib/mock-data';
import { MessageBubble } from './MessageBubble';

interface ChatAreaProps {
  chat: Chat;
  onSendMessage: (content: string) => void;
}

export function ChatArea({ chat, onSendMessage }: ChatAreaProps) {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const otherUser = chat.participants[0];

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chat.messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm">
      {/* Chat Header */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={otherUser.avatar} />
            <AvatarFallback>{otherUser.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold leading-none">{otherUser.name}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {otherUser.status === 'online' ? (
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Online
                </span>
              ) : (
                'Offline'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
           <div className="flex flex-col justify-end min-h-[calc(100vh-200px)]">
            {/* Date Divider Example */}
            <div className="flex justify-center mb-6">
              <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                Today
              </span>
            </div>

            {chat.messages.map((msg, idx) => {
              const isMe = msg.senderId === CURRENT_USER.id;
              const showAvatar = !isMe && (idx === 0 || chat.messages[idx - 1].senderId !== msg.senderId);
              
              return (
                <MessageBubble 
                  key={msg.id} 
                  message={msg} 
                  isMe={isMe} 
                  showAvatar={showAvatar}
                  sender={isMe ? CURRENT_USER : otherUser}
                />
              );
            })}
            
            {/* Typing Indicator */}
            {chat.isTyping && (
              <div className="flex gap-3 mb-4 items-center">
                 <Avatar className="h-8 w-8">
                    <AvatarImage src={otherUser.avatar} />
                    <AvatarFallback>{otherUser.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                 <div className="bg-card px-4 py-3 rounded-2xl rounded-bl-sm border border-border/50 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                 </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-card border-t">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSend} className="flex items-end gap-2 bg-secondary/50 p-2 rounded-3xl border border-transparent focus-within:border-primary/20 focus-within:bg-background focus-within:shadow-lg transition-all duration-300">
            <Button type="button" variant="ghost" size="icon" className="rounded-full h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 shrink-0">
              <Paperclip className="w-5 h-5" />
            </Button>
            
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..." 
              className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 min-h-[44px] py-3"
            />
            
            <div className="flex items-center gap-1 pr-1">
              <Button type="button" variant="ghost" size="icon" className="rounded-full h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 shrink-0">
                <Smile className="w-5 h-5" />
              </Button>
              <Button 
                type="submit" 
                size="icon" 
                disabled={!inputValue.trim()}
                className={cn(
                  "rounded-full h-10 w-10 shrink-0 transition-all duration-300",
                  inputValue.trim() ? "bg-primary hover:bg-primary/90 scale-100" : "bg-muted text-muted-foreground scale-90 opacity-50"
                )}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
