import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Flame, TrendingUp, Users2, Video } from 'lucide-react';
import { USERS } from '@/lib/mock-data';

const mockChallenges = [
  {
    id: 'c1',
    title: 'Dance Challenge 2025',
    hashtag: '#DanceChallenge2025',
    participants: 125400,
    videos: 892000,
    views: '2.4B',
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1535016120754-fd58615ccbfd?w=400&h=600&fit=crop',
  },
  {
    id: 'c2',
    title: 'Lip Sync Battle',
    hashtag: '#LipSyncBattle',
    participants: 89200,
    videos: 456000,
    views: '1.8B',
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
  },
  {
    id: 'c3',
    title: 'Cooking Challenge',
    hashtag: '#CookingChallenge',
    participants: 54300,
    videos: 234000,
    views: '980M',
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=600&fit=crop',
  },
  {
    id: 'c4',
    title: 'Fitness Transformation',
    hashtag: '#FitnessTransform',
    participants: 76800,
    videos: 567000,
    views: '1.2B',
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop',
  },
];

export default function TrendsPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Flame className="w-8 h-8 text-orange-500" />
          Trending Challenges
        </h1>
        <p className="text-muted-foreground">Join the hottest challenges and show your creativity</p>
      </div>

      {/* Featured Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" /> Featured
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockChallenges.filter(c => c.isFeatured).map((challenge) => (
            <div
              key={challenge.id}
              className="group relative rounded-xl overflow-hidden bg-card border border-border hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={challenge.coverImage}
                  alt={challenge.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <Badge variant="secondary" className="mb-2">
                  Trending
                </Badge>
                <h3 className="text-lg font-bold mb-2">{challenge.title}</h3>
                <p className="text-sm text-gray-200 mb-3">{challenge.hashtag}</p>

                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div>
                    <p className="font-semibold">{challenge.participants.toLocaleString()}</p>
                    <p className="text-gray-300">Participants</p>
                  </div>
                  <div>
                    <p className="font-semibold">{challenge.videos.toLocaleString()}</p>
                    <p className="text-gray-300">Videos</p>
                  </div>
                  <div>
                    <p className="font-semibold">{challenge.views}</p>
                    <p className="text-gray-300">Views</p>
                  </div>
                </div>

                <Button size="sm" className="w-full">
                  Join Challenge
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Challenges */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> All Challenges
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {mockChallenges.map((challenge, idx) => (
            <div
              key={challenge.id}
              className="bg-card rounded-lg border border-border p-4 flex items-center justify-between hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-lg font-bold text-muted-foreground">#{idx + 1}</div>

                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img
                    src={challenge.coverImage}
                    alt={challenge.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-semibold mb-1">{challenge.title}</p>
                  <p className="text-sm text-muted-foreground mb-2">{challenge.hashtag}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users2 className="w-3 h-3" /> {challenge.participants.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-3 h-3" /> {challenge.videos.toLocaleString()}
                    </span>
                    <span>{challenge.views} views</span>
                  </div>
                </div>
              </div>

              <Button size="sm" variant="secondary">
                Join
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
