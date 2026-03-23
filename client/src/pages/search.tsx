import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, X, Sparkles, Users, ImageIcon, Clock, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const RECENT_KEY = "pulse-search-recent";
const TRENDING_TAGS = ["#pulse", "#design", "#travel", "#music", "#coding", "#photography"];

type ApiUser = {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string | null;
  followers?: number;
};

type ApiPost = {
  id: string;
  userId: string;
  imageUrl: string;
  caption?: string | null;
  location?: string | null;
  likes?: number;
  user?: ApiUser;
};

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, 8) : [];
  } catch {
    return [];
  }
}

function saveRecent(term: string) {
  const t = term.trim();
  if (t.length < 2) return;
  const prev = readRecent().filter((x) => x.toLowerCase() !== t.toLowerCase());
  const next = [t, ...prev].slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

function readQueryFromUrl(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
}

export default function SearchPage() {
  const [, navigate] = useLocation();
  const [input, setInput] = useState(readQueryFromUrl);
  const [debounced, setDebounced] = useState(readQueryFromUrl);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(readRecent());
  }, []);

  useEffect(() => {
    const onPop = () => {
      const q = readQueryFromUrl();
      setInput(q);
      setDebounced(q);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(input.trim()), 320);
    return () => clearTimeout(t);
  }, [input]);

  const runSearch = useCallback(async (q: string) => {
    if (!q) {
      setUsers([]);
      setPosts([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setUsers(data.users ?? []);
      setPosts(data.posts ?? []);
    } catch {
      setUsers([]);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Shareable URL + fetch when debounced query changes
  useEffect(() => {
    const path = debounced ? `/search?q=${encodeURIComponent(debounced)}` : "/search";
    if (window.location.pathname + window.location.search !== path) {
      window.history.replaceState(null, "", path);
    }
    runSearch(debounced);
  }, [debounced, runSearch]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    setDebounced(q);
    if (q) {
      saveRecent(q);
      setRecent(readRecent());
    }
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  const clearQuery = () => {
    setInput("");
    setDebounced("");
    setUsers([]);
    setPosts([]);
    navigate("/search");
    window.history.replaceState(null, "", "/search");
  };

  const applyTag = (tag: string) => {
    const withoutHash = tag.replace(/^#/, "");
    setInput(withoutHash);
    setDebounced(withoutHash);
    saveRecent(withoutHash);
    setRecent(readRecent());
    navigate(`/search?q=${encodeURIComponent(withoutHash)}`);
  };

  const hasQuery = debounced.length > 0;
  const totalResults = users.length + posts.length;

  const tabDefault = useMemo(() => {
    if (!hasQuery) return "all";
    if (users.length && !posts.length) return "people";
    if (posts.length && !users.length) return "posts";
    return "all";
  }, [hasQuery, users.length, posts.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-24 md:pb-10">
        {/* Header — distinct from Home (no feed layout) */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Explore</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            Search Pulse
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-lg">
            Find people, posts, and places — different from your home feed, built for discovery.
          </p>
        </header>

        {/* Search bar */}
        <form onSubmit={onSubmit} className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search users, captions, locations…"
            className="pl-11 pr-24 h-12 text-base rounded-2xl border-border/80 bg-card shadow-sm focus-visible:ring-primary"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {input && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={clearQuery}
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button type="submit" size="sm" className="rounded-full px-4">
              Search
            </Button>
          </div>
        </form>

        {/* Empty state: recents + trending */}
        {!hasQuery && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <section>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                <Clock className="w-4 h-4" />
                Recent
              </div>
              {recent.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 border border-dashed rounded-2xl text-center">
                  Your recent searches will appear here.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setInput(r);
                        setDebounced(r);
                      }}
                      className="px-4 py-2 rounded-full bg-secondary/80 hover:bg-secondary text-sm transition-colors"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                <Hash className="w-4 h-4" />
                Try a topic
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => applyTag(tag)}
                    className="px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Results */}
        {hasQuery && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {loading
                  ? "Searching…"
                  : totalResults === 0
                    ? `No results for “${debounced}”`
                    : `${totalResults} result${totalResults === 1 ? "" : "s"} for “${debounced}”`}
              </span>
            </div>

            <Tabs defaultValue={tabDefault} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md rounded-2xl bg-secondary/50 p-1">
                <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-card">
                  All
                </TabsTrigger>
                <TabsTrigger value="people" className="rounded-xl data-[state=active]:bg-card gap-1.5">
                  <Users className="w-4 h-4" />
                  People
                </TabsTrigger>
                <TabsTrigger value="posts" className="rounded-xl data-[state=active]:bg-card gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  Posts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6 space-y-8">
                {users.length > 0 && (
                  <section>
                    <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" /> People
                    </h2>
                    <ScrollArea className="h-[min(280px,40vh)] pr-3">
                      <div className="space-y-2">
                        {users.map((u) => (
                          <UserRow key={u.id} user={u} />
                        ))}
                      </div>
                    </ScrollArea>
                  </section>
                )}
                {posts.length > 0 && (
                  <section>
                    <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Posts
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                      {posts.map((p) => (
                        <PostThumb key={p.id} post={p} />
                      ))}
                    </div>
                  </section>
                )}
              </TabsContent>

              <TabsContent value="people" className="mt-6">
                {users.length === 0 ? (
                  <Empty label="No people match your search." />
                ) : (
                  <div className="space-y-2">
                    {users.map((u) => (
                      <UserRow key={u.id} user={u} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="posts" className="mt-6">
                {posts.length === 0 ? (
                  <Empty label="No posts match your search." />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                    {posts.map((p) => (
                      <PostThumb key={p.id} post={p} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

function UserRow({ user }: { user: ApiUser }) {
  return (
    <Link href={`/profile`}>
      <div
        className={cn(
          "flex items-center gap-4 p-3 rounded-2xl border border-transparent",
          "hover:bg-secondary/80 hover:border-border transition-colors cursor-pointer",
        )}
      >
        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
          <AvatarImage src={user.avatar} alt="" />
          <AvatarFallback>{user.name?.slice(0, 2) ?? user.username.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{user.username}</p>
          <p className="text-sm text-muted-foreground truncate">{user.name}</p>
          {user.bio && (
            <p className="text-xs text-muted-foreground/80 truncate mt-0.5">{user.bio}</p>
          )}
        </div>
        {user.followers != null && (
          <span className="text-xs text-muted-foreground hidden sm:block">
            {user.followers.toLocaleString()} followers
          </span>
        )}
      </div>
    </Link>
  );
}

function PostThumb({ post }: { post: ApiPost }) {
  const author = post.user;
  const label = post.caption?.slice(0, 80) || post.location || "Post";

  return (
    <Link href="/">
      <article className="group relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border/60 shadow-sm hover:ring-2 hover:ring-primary/40 transition-all">
        <img
          src={post.imageUrl}
          alt=""
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
          {author && (
            <p className="text-xs font-medium truncate">@{author.username}</p>
          )}
          <p className="text-[11px] line-clamp-2 opacity-90">{label}</p>
        </div>
      </article>
    </Link>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="text-center py-16 text-muted-foreground border border-dashed rounded-3xl">
      {label}
    </div>
  );
}
