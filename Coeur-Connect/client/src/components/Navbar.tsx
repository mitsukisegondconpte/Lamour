import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  LogOut, 
  User as UserIcon, 
  LayoutDashboard, 
  Sparkles,
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  // Don't show navbar on public surprise pages
  if (location.startsWith("/s/")) return null;

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b-0 rounded-none px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
          <div className="relative">
            <Heart className="w-8 h-8 text-primary fill-primary/20 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-75" />
          </div>
          <span className="font-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-600">
            Lanmou
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="gap-2 font-medium hover:text-primary hover:bg-primary/5">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/create">
                <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-full px-6">
                  <Sparkles className="w-4 h-4" />
                  Créer Surprise
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-10 h-10 rounded-full p-0 border border-primary/20">
                    <img 
                      src={user.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = '/profile'}>
                    <UserIcon className="w-4 h-4 mr-2" />
                    Mon Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => logout()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/auth">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
              >
                Connexion / Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6 text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card border-white/50">
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer w-full p-3 font-medium">
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/create" className="cursor-pointer w-full p-3 font-medium text-primary">
                      <Sparkles className="w-4 h-4 mr-2" /> Nouvo Surprise
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer w-full p-3 font-medium">
                      <UserIcon className="w-4 h-4 mr-2" /> Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer w-full p-3 text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Déconnexion
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/auth" className="cursor-pointer w-full p-3 font-bold text-primary">
                    Se Connecter
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
