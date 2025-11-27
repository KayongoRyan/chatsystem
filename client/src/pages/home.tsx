import React, { useEffect, useState } from 'react';
import { USERS } from '@/lib/mock-data';
import { PostCard } from '@/components/feed/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Post } from '@/lib/mock-data';

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch posts from API
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts?limit=10');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          // Fallback to mock data if API fails
          const mockPosts: any[] = [
            {
              id: 'p1',
              userId: 'u1',
              imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&auto=format&fit=crop&q=60',
              caption: 'Chasing sunsets in Bali 🌅 #travel #wanderlust',
              likes: 1243,
              comments: [],
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
              location: 'Bali, Indonesia'
            },
            {
              id: 'p2',
              userId: 'u3',
              imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=60',
              caption: 'New piece in progress. Acrylic on canvas. 🎨',
              likes: 892,
              comments: [],
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
              location: 'Brooklyn Art Studio'
            },
            {
              id: 'p3',
              userId: 'u2',
              imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
              caption: 'Late night coding session. The flow is real. 💻',
              likes: 456,
              comments: [],
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
            },
            {
              id: 'p4',
              userId: 'u1',
              imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=60',
              caption: 'Cinque Terre vibes 🇮🇹',
              likes: 2341,
              comments: [],
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
              location: 'Cinque Terre, Italy'
            }
          ];
          setPosts(mockPosts);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        // Use mock data on error
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No posts yet</div>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
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
               {USERS.slice(0, 3).map((user, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Avatar className="w-9 h-9">
                         <AvatarImage src={user.avatar} />
                         <AvatarFallback>U</AvatarFallback>
                       </Avatar>
                       <div>
                          <p className="font-semibold text-sm hover:underline cursor-pointer">{user.username}</p>
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
