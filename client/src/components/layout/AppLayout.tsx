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

  const NavItem = ({ href, icon: Icon, label, filledIcon: FilledIcon }: { href: string, icon: any, label: string, filledIcon?: any }) => {
    const active = isActive(href);
    const IconToRender = active && FilledIcon ? FilledIcon : Icon;
    
    return (
      <Link href={href}>
        <div className={cn(
          "flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group cursor-pointer",
          active ? "font-bold text-foreground" : "text-foreground hover:bg-secondary/50"
        )}>
          <IconToRender className={cn("w-6 h-6 transition-transform group-hover:scale-105", active && "stroke-[2.5px]")} />
          <span className="hidden lg:block text-md">{label}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-[72px] lg:w-64 border-r border-border px-3 py-6 h-full fixed bg-background z-50">
        <div className="mb-8 px-3">
           <h1 className="hidden lg:block font-display font-bold text-2xl tracking-wide bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Pulse</h1>
           <div className="lg:hidden w-8 h-8 bg-gradient-to-tr from-primary to-purple-600 rounded-lg mx-auto" />
        </div>

        <nav className="space-y-2 flex-1">
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

        <div className="mt-auto space-y-2">
           <NavItem href="/settings" icon={Settings} label="Settings" />
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border z-50 px-3 flex items-center justify-between">
         <Link href="/">
            <Home className={cn("w-6 h-6", isActive('/') && "text-primary stroke-[2.5px]")} />
         </Link>
         <Link href="/search">
            <Search className={cn("w-6 h-6", isActive('/search') && "text-primary stroke-[2.5px]")} />
         </Link>
         <Link href="/discover">
            <Zap className={cn("w-6 h-6", isActive('/discover') && "text-primary stroke-[2.5px]")} />
         </Link>
         <Link href="/trends">
            <Flame className={cn("w-6 h-6", isActive('/trends') && "text-primary stroke-[2.5px]")} />
         </Link>
         <Link href="/chat">
            <MessageCircle className={cn("w-6 h-6", isActive('/chat') && "text-primary stroke-[2.5px]")} />
         </Link>
         <Link href="/profile">
            <Avatar className={cn("w-6 h-6 ring-2 ring-transparent transition-all", isActive('/profile') && "ring-primary")}>
               <AvatarImage src={CURRENT_USER.avatar} />
               <AvatarFallback>ME</AvatarFallback>
            </Avatar>
         </Link>
      </div>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 w-full min-h-screen md:pl-[72px] lg:pl-64 pb-16 md:pb-0",
        location === '/chat' ? "h-screen overflow-hidden" : "overflow-y-auto"
      )}>
        {children}
      </main>
    </div>
  );
}
