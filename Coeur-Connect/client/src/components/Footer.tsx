import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-8 mt-auto bg-white/50 backdrop-blur-sm border-t border-primary/10">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-primary/80">
          <span>Fait avec</span>
          <Heart className="w-4 h-4 fill-current animate-pulse" />
          <span>lanmou pou ayisyen</span>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1 font-medium">
          <p>CEO: Mitsuki</p>
          <p className="text-xs opacity-75">In collaboration with: Sport-Dev</p>
        </div>

        <div className="text-xs text-muted-foreground/50 pt-4 border-t border-dashed border-primary/10 w-48 mx-auto">
          &copy; {new Date().getFullYear()} Lanmou Surprise
        </div>
      </div>
    </footer>
  );
}
