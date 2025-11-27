import React, { useEffect, useState } from 'react';
import { CURRENT_USER, Post } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Settings, Grid, Bookmark, UserSquare2, Heart, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function ProfilePage() {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's posts from API
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`/api/users/${CURRENT_USER.id}/posts`);
        if (response.ok) {
          const data = await response.json();
          setUserPosts(data);
        } else {
          // Fallback to mock data
          setUserPosts([
            {
              id: 'p1',
              userId: CURRENT_USER.id,
              imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&auto=format&fit=crop&q=60',
              caption: 'Chasing sunsets 🌅',
              likes: 1243,
              timestamp: new Date(),
            },
            {
              id: 'p2',
              userId: CURRENT_USER.id,
              imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=60',
              caption: 'Travel vibes ✈️',
              likes: 892,
              timestamp: new Date(),
            }
          ] as any);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pb-20">
      {/* Profile Header */}
      <header className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <div className="shrink-0">
           <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
              <Avatar className="w-24 h-24 md:w-36 md:h-36 border-4 border-background">
                <AvatarImage src={CURRENT_USER.avatar} />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
           </div>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
           <div className="flex flex-col md:flex-row items-center gap-4">
              <h1 className="text-xl font-normal">{CURRENT_USER.username}</h1>
              <div className="flex gap-2">
                 <Button variant="secondary" size="sm" className="font-semibold">Edit Profile</Button>
                 <Button variant="secondary" size="sm" className="font-semibold">View Archive</Button>
                 <Button variant="ghost" size="icon"><Settings className="w-5 h-5" /></Button>
              </div>
           </div>

           <div className="flex justify-center md:justify-start gap-8 text-sm">
              <span><strong>{CURRENT_USER.postsCount}</strong> posts</span>
              <span><strong>{CURRENT_USER.followers}</strong> followers</span>
              <span><strong>{CURRENT_USER.following}</strong> following</span>
           </div>

           <div className="space-y-1">
              <p className="font-semibold text-sm">{CURRENT_USER.name}</p>
              <p className="text-sm whitespace-pre-wrap">{CURRENT_USER.bio}</p>
           </div>
        </div>
      </header>

      {/* Story Highlights Mock */}
      <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 mb-8 scrollbar-hide justify-start md:justify-start px-2">
         {[1,2,3,4].map(i => (
            <div key={i} className="flex flex-col items-center gap-2 cursor-pointer">
               <div className="w-16 h-16 bg-muted rounded-full border border-border p-1">
                  <div className="w-full h-full bg-secondary rounded-full" />
               </div>
               <span className="text-xs font-medium">Highlight {i}</span>
            </div>
         ))}
      </div>

      <div className="border-t border-border">
         <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full justify-center bg-transparent h-12 gap-12 rounded-none p-0">
               <TabsTrigger value="posts" className="rounded-none border-t border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground uppercase text-xs tracking-widest h-full px-1 bg-transparent shadow-none">
                  <Grid className="w-3 h-3 mr-2" /> Posts
               </TabsTrigger>
               <TabsTrigger value="saved" className="rounded-none border-t border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground uppercase text-xs tracking-widest h-full px-1 bg-transparent shadow-none">
                  <Bookmark className="w-3 h-3 mr-2" /> Saved
               </TabsTrigger>
               <TabsTrigger value="tagged" className="rounded-none border-t border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground uppercase text-xs tracking-widest h-full px-1 bg-transparent shadow-none">
                  <UserSquare2 className="w-3 h-3 mr-2" /> Tagged
               </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-4">
               {loading ? (
                 <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
               ) : (
                 <div className="grid grid-cols-3 gap-1 md:gap-8">
                    {userPosts.length === 0 ? (
                      <div className="col-span-3 text-center py-8 text-muted-foreground">No posts yet</div>
                    ) : (
                      userPosts.map(post => (
                         <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden bg-muted">
                            <img src={post.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                               <div className="flex items-center gap-1">
                                  <Heart className="w-5 h-5 fill-white" /> {post.likes}
                               </div>
                               <div className="flex items-center gap-1">
                                  <MessageCircle className="w-5 h-5 fill-white" /> 0
                               </div>
                            </div>
                         </div>
                      ))
                    )}
                 </div>
               )}
            </TabsContent>
         </Tabs>
      </div>
    </div>
  );
}
