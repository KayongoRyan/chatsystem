import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";

import ChatPage from "@/pages/chat";
import HomePage from "@/pages/home";
import ReelsPage from "@/pages/reels";
import ProfilePage from "@/pages/profile";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/reels" component={ReelsPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/search" component={HomePage} /> {/* Placeholder reuse */}
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
