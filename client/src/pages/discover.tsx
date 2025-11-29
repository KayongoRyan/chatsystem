import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Zap } from 'lucide-react';
import { REELS, USERS } from '@/lib/mock-data';

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState('for-you');

  const trendingReels = REELS.slice().sort((a, b) => b.likes - a.likes);
  const viralReels = REELS.filter(r => r.likes > 5000);

  return (
    <div className="w-full h-screen bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        <TabsList className="w-full justify-center gap-4 bg-card border-b rounded-none p-4 sticky top-0 z-10">
          <TabsTrigger value="for-you" className="text-base font-semibold">
            For You
          </TabsTrigger>
          <TabsTrigger value="trending" className="text-base font-semibold">
            Trending
          </TabsTrigger>
          <TabsTrigger value="viral" className="text-base font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4" /> Viral
          </TabsTrigger>
        </TabsList>

        <TabsContent value="for-you" className="h-full overflow-y-auto p-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REELS.map((reel) => {
              const creator = USERS.find(u => u.id === reel.userId) || USERS[0];
              return (
                <div
                  key={reel.id}
                  className="bg-card rounded-xl border border-border overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    <video
                      src={reel.videoUrl}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="flex items-center gap-4 text-white text-sm">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" /> {reel.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" /> {reel.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm mb-2 line-clamp-2">{reel.caption}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={creator.avatar} />
                          <AvatarFallback>{creator.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{creator.username}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                        Follow
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="h-full overflow-y-auto p-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingReels.map((reel) => {
              const creator = USERS.find(u => u.id === reel.userId) || USERS[0];
              return (
                <div key={reel.id} className="bg-card rounded-xl border border-border overflow-hidden group">
                  <div className="relative aspect-video bg-muted">
                    <video src={reel.videoUrl} className="w-full h-full object-cover" muted />
                    <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm text-primary-foreground px-2 py-1 rounded-lg text-xs font-bold">
                      🔥 Trending
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm mb-2 line-clamp-2">{reel.caption}</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback>{creator.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium flex-1">{creator.username}</span>
                      <span className="text-xs text-muted-foreground">{reel.likes.toLocaleString()} likes</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="viral" className="h-full overflow-y-auto p-6 pb-20">
          <div className="max-w-2xl mx-auto space-y-4">
            {viralReels.map((reel, idx) => {
              const creator = USERS.find(u => u.id === reel.userId) || USERS[0];
              return (
                <div key={reel.id} className="bg-card rounded-lg border border-border overflow-hidden p-4 flex gap-4">
                  <div className="text-2xl font-bold text-primary min-w-fit">#{idx + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback>{creator.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{creator.username}</p>
                        <p className="text-xs text-muted-foreground">{creator.followers.toLocaleString()} followers</p>
                      </div>
                    </div>
                    <p className="text-sm mb-3 line-clamp-2">{reel.caption}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" /> {reel.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" /> {reel.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" /> {reel.shares}
                      </span>
                    </div>
                    <Button size="sm" className="w-full">
                      Watch Now
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
