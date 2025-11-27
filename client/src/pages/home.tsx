import React from 'react';
import { POSTS, USERS } from '@/lib/mock-data';
import { PostCard } from '@/components/feed/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function HomePage() {
  return (
    <div className="flex max-w-5xl mx-auto pt-4 lg:pt-8 gap-10 justify-center">
      {/* Main Feed */}
      <div className="w-full max-w-[470px] space-y-4">
        {/* Stories Bar (Mobile/Desktop) */}
        <ScrollArea className="w-full whitespace-nowrap pb-4">
           <div className="flex gap-4 px-2">
              {USERS.map((user, i) => (
                <div key={user.id} className="flex flex-col items-center gap-1 cursor-pointer group">
                   <div className="p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 group-hover:scale-105 transition-transform">
                     <Avatar className="w-16 h-16 border-2 border-background">
                       <AvatarImage src={user.avatar} />
                       <AvatarFallback>{user.name[0]}</AvatarFallback>
                     </Avatar>
                   </div>
                   <span className="text-xs text-center w-16 truncate">{user.username}</span>
                </div>
              ))}
           </div>
        </ScrollArea>

        {/* Posts */}
        <div className="space-y-2 pb-20 md:pb-8">
          {POSTS.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Right Sidebar (Suggestions) */}
      <div className="hidden lg:block w-80 space-y-6 pt-2">
         {/* Current User Switch */}
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Avatar className="w-12 h-12">
                 <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" />
                 <AvatarFallback>ME</AvatarFallback>
               </Avatar>
               <div>
                  <p className="font-semibold text-sm">design_enthusiast</p>
                  <p className="text-muted-foreground text-sm">You</p>
               </div>
            </div>
            <button className="text-primary text-xs font-semibold hover:text-primary/80">Switch</button>
         </div>

         <div>
            <div className="flex items-center justify-between mb-4">
               <p className="text-sm font-semibold text-muted-foreground">Suggested for you</p>
               <button className="text-xs font-semibold hover:text-muted-foreground/80">See All</button>
            </div>
            
            <div className="space-y-3">
               {[1,2,3].map((_, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Avatar className="w-9 h-9">
                         <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                         <AvatarFallback>U</AvatarFallback>
                       </Avatar>
                       <div>
                          <p className="font-semibold text-sm hover:underline cursor-pointer">creative_mind_{i}</p>
                          <p className="text-muted-foreground text-xs">Followed by sarah_w + 2 more</p>
                       </div>
                    </div>
                    <button className="text-primary text-xs font-semibold hover:text-primary/80">Follow</button>
                 </div>
               ))}
            </div>
         </div>

         <div className="text-xs text-muted-foreground/50 leading-relaxed">
            <p>© 2025 PULSE FROM REPLIT</p>
         </div>
      </div>
    </div>
  );
}
