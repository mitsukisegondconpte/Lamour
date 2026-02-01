import { useAuth } from "@/hooks/use-auth";
import { Loader2, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Profile() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-8">Mon Profil</h1>
      
      <Card className="p-8 rounded-3xl bg-white/60 backdrop-blur-md shadow-lg border-white/50">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-4 border-white shadow-sm overflow-hidden">
             <img 
              src={user.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        <div className="space-y-4 text-sm mb-8">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-muted-foreground">Manm depi</span>
            <span className="font-medium">{user.createdAt ? format(new Date(user.createdAt), "d MMMM yyyy", { locale: fr }) : '-'}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-muted-foreground">ID itilizatè</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{user.id.slice(0, 8)}...</span>
          </div>
        </div>

        <Button 
          variant="destructive" 
          className="w-full h-12 rounded-xl"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </Card>
    </div>
  );
}
