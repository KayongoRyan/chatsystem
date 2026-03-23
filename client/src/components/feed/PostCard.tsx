import React, { useState } from 'react';
import { Post, USERS } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

function postTimestamp(post: Post): Date {
  const p = post as Post & { createdAt?: Date | string };
  if (post.timestamp) return post.timestamp instanceof Date ? post.timestamp : new Date(post.timestamp);
  if (p.createdAt) return p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt);
  return new Date();
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const user = USERS.find(u => u.id === post.userId) || USERS[0];
  const at = postTimestamp(post);

  return (
    <article className="w-full max-w-[470px] mx-auto border-b border-border/80 pb-4 mb-4 md:border md:border-border/70 md:rounded-2xl md:shadow-md md:shadow-primary/[0.04] md:bg-card/80 md:backdrop-blur-sm md:pb-0 md:overflow-hidden ring-brand-soft">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:px-4">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
          <div className={cn("p-[2px] rounded-full", user.status === 'online' && "bg-gradient-to-tr from-yellow-400 to-purple-600")}>
             <Avatar className="w-8 h-8 border-2 border-background">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <div>
             <p className="font-semibold text-sm leading-none">{user.username}</p>
             {post.location && <p className="text-xs text-muted-foreground mt-0.5">{post.location}</p>}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden group/img">
        <img 
          src={post.imageUrl} 
          alt={post.caption || 'Post image'} 
          className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover/img:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.06] via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
      </div>

      {/* Actions */}
      <div className="p-3 pb-1 md:px-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="transition-transform active:scale-75 hover:opacity-70"
            >
              <Heart 
                className={cn("w-6 h-6", isLiked ? "fill-red-500 text-red-500" : "text-foreground")} 
              />
            </button>
            <button className="hover:opacity-70">
              <MessageCircle className="w-6 h-6 -rotate-90" />
            </button>
            <button className="hover:opacity-70">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className="hover:opacity-70"
          >
            <Bookmark className={cn("w-6 h-6", isSaved ? "fill-foreground text-foreground" : "text-foreground")} />
          </button>
        </div>

        <p className="font-semibold text-sm mb-1">{post.likes + (isLiked ? 1 : 0)} likes</p>
        
        <div className="space-y-1">
           <p className="text-sm">
             <span className="font-semibold mr-2">{user.username}</span>
             {post.caption ?? ''}
           </p>
        </div>

        <p className="text-xs text-muted-foreground uppercase mt-2">
          {formatDistanceToNow(at)} ago
        </p>
      </div>
      
      {/* Add Comment */}
      <div className="px-3 md:px-4 py-3 border-t border-border/50 flex items-center gap-3 bg-muted/20">
         <input 
           type="text" 
           placeholder="Add a comment..." 
           className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
         />
         <button className="text-primary text-sm font-semibold hover:text-primary/80">Post</button>
      </div>
    </article>
  );
}
