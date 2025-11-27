import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Message, User, CURRENT_USER } from '@/lib/mock-data';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  showAvatar?: boolean;
  sender?: User;
}

export function MessageBubble({ message, isMe, showAvatar, sender }: MessageBubbleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 mb-4 max-w-[80%]",
        isMe ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {!isMe && (
        <div className="flex-shrink-0 w-8 pt-1">
          {showAvatar && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={sender?.avatar} />
              <AvatarFallback>{sender?.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      <div className={cn(
        "group relative px-4 py-2.5 rounded-2xl shadow-sm",
        isMe 
          ? "bg-primary text-primary-foreground rounded-br-sm" 
          : "bg-card text-card-foreground border border-border/50 rounded-bl-sm"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span className={cn(
          "text-[10px] absolute bottom-1 right-3 opacity-0 group-hover:opacity-70 transition-opacity",
          isMe ? "text-primary-foreground/80" : "text-muted-foreground"
        )}>
          {format(message.timestamp, 'HH:mm')}
        </span>
      </div>
    </motion.div>
  );
}
