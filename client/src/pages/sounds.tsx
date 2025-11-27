import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Music2, Zap, TrendingUp, Plus } from 'lucide-react';
import { USERS } from '@/lib/mock-data';

const mockSounds = [
  {
    id: 's1',
    title: 'Summer Vibes',
    artist: 'Lo-Fi Beats',
    uses: 45200,
    isTrending: true,
    creator: USERS[0],
  },
  {
    id: 's2',
    title: 'Midnight Drive',
    artist: 'Synthwave Dreams',
    uses: 32100,
    isTrending: true,
    creator: USERS[1],
  },
  {
    id: 's3',
    title: 'Coffee Shop Jazz',
    artist: 'Café Moods',
    uses: 28900,
    isTrending: false,
    creator: USERS[2],
  },
  {
    id: 's4',
    title: 'Energetic Pop',
    artist: 'Pop Stars',
    uses: 52300,
    isTrending: true,
    creator: USERS[3],
  },
];

export default function SoundsPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Music2 className="w-8 h-8 text-primary" />
          Sounds
        </h1>
        <p className="text-muted-foreground">Discover and use trending sounds in your videos</p>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <Zap className="w-4 h-4" /> Trending
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Popular
          </TabsTrigger>
          <TabsTrigger value="creator">Creator Sounds</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-3">
          {mockSounds.filter(s => s.isTrending).map((sound, idx) => (
            <div
              key={sound.id}
              className="bg-card rounded-lg border border-border p-4 flex items-center justify-between hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-2xl font-bold text-muted-foreground">#{idx + 1}</div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <Music2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{sound.title}</p>
                  <p className="text-sm text-muted-foreground">{sound.artist}</p>
                  <p className="text-xs text-muted-foreground mt-1">{sound.uses.toLocaleString()} videos</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {sound.isTrending && (
                  <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Trending
                  </span>
                )}
                <Button size="sm">Use Sound</Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="popular" className="space-y-3">
          {mockSounds
            .sort((a, b) => b.uses - a.uses)
            .map((sound, idx) => (
              <div
                key={sound.id}
                className="bg-card rounded-lg border border-border p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl font-bold text-muted-foreground">#{idx + 1}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Music2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{sound.title}</p>
                    <p className="text-sm text-muted-foreground">{sound.artist}</p>
                    <p className="text-xs text-muted-foreground mt-1">{sound.uses.toLocaleString()} videos</p>
                  </div>
                </div>
                <Button size="sm">Use Sound</Button>
              </div>
            ))}
        </TabsContent>

        <TabsContent value="creator" className="space-y-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center mb-6">
            <Plus className="w-12 h-12 mx-auto text-primary mb-3" />
            <h3 className="font-semibold mb-2">Upload Your Own Sound</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Share your music and let creators use it in their videos
            </p>
            <Button className="w-full">Upload Sound</Button>
          </div>

          <div className="space-y-3">
            {mockSounds.map((sound) => (
              <div
                key={sound.id}
                className="bg-card rounded-lg border border-border p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={sound.creator.avatar} />
                    <AvatarFallback>{sound.creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{sound.title}</p>
                    <p className="text-xs text-muted-foreground">by {sound.creator.name}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold">{sound.uses.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">uses</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
