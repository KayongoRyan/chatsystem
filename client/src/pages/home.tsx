import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { USERS, getPreviewFeedPosts, type Post } from '@/lib/mock-data';
import { PostCard } from '@/components/feed/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Sparkles, Compass, MessageCircle, Images } from 'lucide-react';

function normalizeApiPost(raw: Record<string, unknown>): Post {
  const created = raw.createdAt ?? raw.timestamp;
  const ts =
    created instanceof Date
      ? created
      : typeof created === 'string' || typeof created === 'number'
        ? new Date(created)
        : new Date();

  return {
    id: String(raw.id ?? ''),
    userId: String(raw.userId ?? ''),
    imageUrl: String(raw.imageUrl ?? ''),
    caption: raw.caption != null ? String(raw.caption) : '',
    likes: typeof raw.likes === 'number' ? raw.likes : Number(raw.likes) || 0,
    comments: Array.isArray(raw.comments) ? (raw.comments as Post['comments']) : [],
    timestamp: ts,
    location: raw.location != null ? String(raw.location) : undefined,
  };
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  /** True when showing Unsplash demo posts because the API returned no rows (or failed). */
  const [showingPhotoPreview, setShowingPhotoPreview] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts?limit=10', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const list = Array.isArray(data) ? data : [];
          const normalized = list.map((row: Record<string, unknown>) => normalizeApiPost(row));
          const withImages = normalized.filter((p) => p.imageUrl.trim().length > 0);

          if (withImages.length === 0) {
            setPosts(getPreviewFeedPosts());
            setShowingPhotoPreview(true);
          } else {
            setPosts(withImages);
            setShowingPhotoPreview(false);
          }
        } else {
          setPosts(getPreviewFeedPosts());
          setShowingPhotoPreview(true);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setPosts(getPreviewFeedPosts());
        setShowingPhotoPreview(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex max-w-6xl mx-auto pt-4 lg:pt-8 gap-8 lg:gap-12 justify-center px-3 sm:px-4">
      {/* Main Feed */}
      <div className="w-full max-w-[470px] space-y-5">
        {/* Welcome strip — desktop only subtle */}
        <div className="hidden sm:flex items-start gap-3 p-4 rounded-2xl glass-panel mesh-bg overflow-hidden relative">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-primary-foreground shadow-lg shadow-primary/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="relative min-w-0 flex-1">
            <h2 className="font-display text-lg font-semibold text-foreground tracking-tight">
              Good to see you
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
              Catch up on stories, then scroll the feed — your corner of Pulse updates in real time.
            </p>
          </div>
        </div>

        {/* Sample feed banner — real photos, shows layout before your DB has posts */}
        {showingPhotoPreview && !loading && (
          <div className="flex items-start gap-3 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/[0.08] via-purple-500/[0.06] to-fuchsia-500/[0.05] px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/80 text-primary shadow-inner">
              <Images className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Photo feed preview</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                You&apos;re seeing high-quality sample images so you can preview how posts look in the feed. When real posts are added to Pulse, they&apos;ll appear here automatically.
              </p>
            </div>
          </div>
        )}

        {/* Stories */}
        <section aria-label="Stories">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stories</span>
            <span className="text-[11px] text-primary/80 font-medium">Tap to view</span>
          </div>
          <ScrollArea className="w-full whitespace-nowrap pb-2 -mx-1 px-1">
            <div className="flex gap-3">
              {USERS.map((user) => (
                <div key={user.id} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                  <div className="p-[3px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-600 group-hover:scale-[1.04] transition-transform duration-300 shadow-md shadow-rose-500/20">
                    <Avatar className="w-[68px] h-[68px] border-[3px] border-background">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="text-[11px] text-center w-[72px] truncate text-muted-foreground group-hover:text-foreground transition-colors">
                    {user.username}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </section>

        {/* Posts */}
        <div className="space-y-4 pb-24 md:pb-10">
          {loading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-2xl border border-border/80 overflow-hidden bg-card/50 ring-brand-soft">
                  <div className="flex items-center gap-3 p-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-2 w-20" />
                    </div>
                  </div>
                  <Skeleton className="aspect-square w-full rounded-none" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-full max-w-[90%]" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-3xl border border-dashed border-primary/25 bg-gradient-to-b from-primary/[0.04] to-transparent">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">Your feed is quiet</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
                When people you follow share photos and updates, they&apos;ll show up here. Start by exploring or saying hi in chat.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                <Button asChild size="sm" className="rounded-full shadow-md shadow-primary/20">
                  <Link href="/discover">Explore Discover</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="rounded-full border-primary/30">
                  <Link href="/chat">
                    <MessageCircle className="w-4 h-4 mr-1.5" />
                    Open messages
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="hidden lg:block w-80 shrink-0 space-y-6 pt-1">
        <div className="rounded-2xl glass-panel p-4 ring-brand-soft">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="w-12 h-12 ring-2 ring-primary/15">
                <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=85" alt="" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">design_enthusiast</p>
                <p className="text-muted-foreground text-xs">You · Pulse member</p>
              </div>
            </div>
            <button type="button" className="text-primary text-xs font-bold hover:underline shrink-0">
              Switch
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/50 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Suggested for you</p>
            <button type="button" className="text-xs font-semibold text-primary hover:underline">
              See all
            </button>
          </div>
          <ul className="space-y-3">
            {USERS.slice(0, 4).map((user) => (
              <li key={user.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt="" />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate hover:text-primary cursor-pointer transition-colors">
                      {user.username}
                    </p>
                    <p className="text-muted-foreground text-[11px] leading-tight">Popular on Pulse</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary" className="h-8 text-xs font-semibold rounded-full px-3 shrink-0">
                  Follow
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-1 text-[11px] text-muted-foreground/70 leading-relaxed space-y-2">
          <p className="font-medium text-muted-foreground/90">About Pulse</p>
          <p>
            Share moments, message friends, and discover reels — all in one calm, fast experience.
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2 border-t border-border/50">
            <span>© {new Date().getFullYear()} Pulse</span>
            <Link href="/settings" className="hover:text-foreground">Help</Link>
            <Link href="/search" className="hover:text-foreground">Search</Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
