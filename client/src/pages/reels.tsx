import React, { useState } from 'react';
import { REELS, USERS } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Send, MoreHorizontal, Music2, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReelsPage() {
  const [muted, setMuted] = useState(true);

  return (
    <div className="h-screen w-full snap-y snap-mandatory overflow-y-scroll bg-black">
      {REELS.map((reel) => {
        const user = USERS.find(u => u.id === reel.userId) || USERS[0];
        
        return (
          <div key={reel.id} className="h-screen w-full snap-start relative flex items-center justify-center bg-zinc-900">
             {/* Video Container - Constrained Width for Desktop */}
             <div className="relative h-full w-full md:max-w-[400px] aspect-[9/16] bg-black">
                <video 
                  src={reel.videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted={muted}
                  playsInline
                />
                
                {/* Overlay UI */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

                {/* Controls */}
                <div className="absolute top-4 right-4 z-20">
                    <button 
                      onClick={() => setMuted(!muted)} 
                      className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white"
                    >
                       {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                </div>

                {/* Right Action Bar */}
                <div className="absolute bottom-20 right-4 flex flex-col items-center gap-6 z-20">
                   <div className="flex flex-col items-center gap-1">
                      <button className="p-2 hover:bg-black/10 rounded-full transition-colors">
                         <Heart className="w-7 h-7 text-white stroke-[2px]" />
                      </button>
                      <span className="text-white text-xs font-medium">{reel.likes}</span>
                   </div>
                   
                   <div className="flex flex-col items-center gap-1">
                      <button className="p-2 hover:bg-black/10 rounded-full transition-colors">
                         <MessageCircle className="w-7 h-7 text-white -rotate-90 stroke-[2px]" />
                      </button>
                      <span className="text-white text-xs font-medium">{reel.comments}</span>
                   </div>

                   <div className="flex flex-col items-center gap-1">
                      <button className="p-2 hover:bg-black/10 rounded-full transition-colors">
                         <Send className="w-7 h-7 text-white stroke-[2px]" />
                      </button>
                      <span className="text-white text-xs font-medium">{reel.shares}</span>
                   </div>

                   <button className="p-2 hover:bg-black/10 rounded-full transition-colors">
                      <MoreHorizontal className="w-7 h-7 text-white stroke-[2px]" />
                   </button>

                   <div className="w-8 h-8 border-2 border-white rounded-lg overflow-hidden">
                      <img src={user.avatar} className="w-full h-full object-cover" />
                   </div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 md:pb-4 z-10 text-white">
                   <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-8 h-8 border border-white/50">
                         <AvatarImage src={user.avatar} />
                         <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-sm">{user.username}</span>
                      <button className="text-xs border border-white/50 px-2 py-1 rounded-md backdrop-blur-sm hover:bg-white/20 transition-colors">Follow</button>
                   </div>
                   
                   <p className="text-sm mb-3 line-clamp-2">{reel.caption}</p>
                   
                   <div className="flex items-center gap-2 text-xs opacity-90">
                      <Music2 className="w-3 h-3" />
                      <div className="overflow-hidden w-32">
                         <div className="animate-marquee whitespace-nowrap">
                            {reel.musicTrack || 'Original Audio'} • {user.name}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
      })}
    </div>
  );
}
