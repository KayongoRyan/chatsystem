import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-6rem)] w-full flex flex-col items-center justify-center px-4 py-16 mesh-bg">
      <div className="relative w-full max-w-lg text-center">
        <div className="absolute inset-0 -z-10 mx-auto h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary mb-4">404</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          This page drifted away
        </h1>
        <p className="mt-4 text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
          The link might be broken, or the page hasn&apos;t been built yet. Head back home or search for what you need — Pulse is still here.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="rounded-full px-8 shadow-lg shadow-primary/20">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-primary/30 bg-card/50 backdrop-blur-sm">
            <Link href="/search">
              <Search className="w-4 h-4 mr-2" />
              Search Pulse
            </Link>
          </Button>
        </div>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to previous page
        </button>
      </div>
    </div>
  );
}
