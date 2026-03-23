import React from 'react';
import { Link, useLocation } from "wouter";
import { cn } from '@/lib/utils';
import { Home, Search, PlusSquare, Heart, MessageCircle, Film, User, Settings, Zap, Music2, Flame } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CURRENT_USER } from '@/lib/mock-data';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const NavItem = ({ href, icon: Icon, label, filledIcon: FilledIcon }: { href: string, icon: React.ComponentType<{ className?: string }>, label: string, filledIcon?: React.ComponentType<{ className?: string }> }) => {
    const active = isActive(href);
    const IconToRender = active && FilledIcon ? FilledIcon : Icon;
    
    return (
      <Link href={href}>
        <div
          className={cn(
            "flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer",
            active
              ? "bg-gradient-to-r from-primary/15 to-purple-500/10 text-primary font-semibold shadow-sm shadow-primary/10 ring-1 ring-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
          )}
        >
          <IconToRender className={cn(
            "w-[22px] h-[22px] shrink-0 transition-transform group-hover:scale-105",
            active && "stroke-[2.5px] text-primary"
          )} />
          <span className="hidden lg:block text-[15px]">{label}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[72px] lg:w-64 border-r border-border/80 h-full fixed z-50 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-[4px_0_24px_-12px_hsl(var(--primary)/0.08)]">
        <div className="px-3 py-6 flex flex-col h-full">
          <div className="mb-8 px-2 lg:px-3">
            <h1 className="hidden lg:block font-display font-bold text-2xl tracking-tight">
              <span className="bg-gradient-to-br from-primary via-purple-500 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-sm">
                Pulse
              </span>
            </h1>
            <div
              className="lg:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-fuchsia-500 shadow-lg shadow-primary/25 mx-auto ring-2 ring-background"
              aria-hidden
            />
            <p className="hidden lg:block text-[11px] text-muted-foreground mt-1.5 font-medium tracking-wide uppercase">
              Connect · Share · Live
            </p>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
            <NavItem href="/" icon={Home} label="Home" />
            <NavItem href="/search" icon={Search} label="Search" />
            <NavItem href="/reels" icon={Film} label="Reels" />
            <NavItem href="/discover" icon={Zap} label="Discover" />
            <NavItem href="/sounds" icon={Music2} label="Sounds" />
            <NavItem href="/trends" icon={Flame} label="Trends" />
            <NavItem href="/chat" icon={MessageCircle} label="Messages" />
            <NavItem href="/create" icon={PlusSquare} label="Create" />
            <NavItem href="/notifications" icon={Heart} label="Notifications" />
            <NavItem href="/profile" icon={User} label="Profile" />
          </nav>

          <div className="mt-auto pt-4 border-t border-border/60 space-y-1">
            <NavItem href="/settings" icon={Settings} label="Settings" />
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 pointer-events-none">
        <nav className="pointer-events-auto mx-auto max-w-md flex items-center justify-between gap-1 px-2 py-2 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/80 shadow-xl shadow-black/5 ring-brand-soft">
          <Link href="/" className="p-2.5 rounded-xl transition-colors active:scale-95">
            <Home className={cn("w-6 h-6", isActive('/') ? "text-primary stroke-[2.5px]" : "text-muted-foreground")} />
          </Link>
          <Link href="/search" className="p-2.5 rounded-xl transition-colors active:scale-95">
            <Search className={cn("w-6 h-6", isActive('/search') ? "text-primary stroke-[2.5px]" : "text-muted-foreground")} />
          </Link>
          <Link href="/discover" className="p-2.5 rounded-xl transition-colors active:scale-95">
            <Zap className={cn("w-6 h-6", isActive('/discover') ? "text-primary stroke-[2.5px]" : "text-muted-foreground")} />
          </Link>
          <Link href="/trends" className="p-2.5 rounded-xl transition-colors active:scale-95">
            <Flame className={cn("w-6 h-6", isActive('/trends') ? "text-primary stroke-[2.5px]" : "text-muted-foreground")} />
          </Link>
          <Link href="/chat" className="p-2.5 rounded-xl transition-colors active:scale-95">
            <MessageCircle className={cn("w-6 h-6", isActive('/chat') ? "text-primary stroke-[2.5px]" : "text-muted-foreground")} />
          </Link>
          <Link href="/profile" className="p-1 rounded-xl transition-colors active:scale-95">
            <Avatar className={cn("w-8 h-8 ring-2 ring-transparent transition-all", isActive('/profile') && "ring-primary ring-offset-2 ring-offset-card")}>
              <AvatarImage src={CURRENT_USER.avatar} />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 w-full min-h-screen md:pl-[72px] lg:pl-64 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0",
        location === '/chat' ? "h-screen overflow-hidden" : "overflow-y-auto"
      )}>
        {children}
      </main>
    </div>
  );
}
