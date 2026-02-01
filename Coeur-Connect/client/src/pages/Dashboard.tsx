import { useAuth } from "@/hooks/use-auth";
import { useSurprises, useCancelSurprise } from "@/hooks/use-surprises";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "wouter";
import { 
  Plus, 
  Eye, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  Trash2,
  ExternalLink,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: surprises, isLoading } = useSurprises();
  const { mutate: cancelSurprise } = useCancelSurprise();
  const { toast } = useToast();
  
  const [cancelId, setCancelId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'viewed': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Vu / Viewed</Badge>;
      case 'accepted': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Aksepte ❤️</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Rejte 💔</Badge>;
      case 'cancelled': return <Badge variant="outline" className="text-muted-foreground">Anile</Badge>;
      default: return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">En attente</Badge>;
    }
  };

  const handleCancel = () => {
    if (cancelId) {
      cancelSurprise(cancelId, {
        onSuccess: () => {
          toast({ title: "Surprise anile", description: "Lyen an p ap mache ankò." });
          setCancelId(null);
        },
        onError: () => {
          toast({ title: "Erreur", description: "Impossible d'annuler.", variant: "destructive" });
        }
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold">Bonjou, {user?.firstName || 'Cheri'} 👋</h1>
          <p className="text-muted-foreground">Jere tout sipriz ou voye yo isit la.</p>
        </div>
        <Link href="/create">
          <Button className="rounded-full shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nouvo Surprise
          </Button>
        </Link>
      </div>

      {surprises && surprises.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-primary/20">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-primary/50" />
          </div>
          <h3 className="text-xl font-bold mb-2">Pa gen sipriz toujou</h3>
          <p className="text-muted-foreground mb-6">Ou poko voye okenn mesaj lanmou. Kòmanse jodia!</p>
          <Link href="/create">
            <Button variant="outline" className="rounded-full">Kreye premye sipriz ou</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {surprises?.map((item) => (
            <div key={item.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg truncate pr-2">Pou: {item.receiverName}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    {item.createdAt && format(new Date(item.createdAt), "d MMM yyyy", { locale: fr })}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => window.open(`/s/${item.linkSlug}`, '_blank')}
                      className="cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Wè lyen an
                    </DropdownMenuItem>
                    {item.status !== 'cancelled' && (
                      <DropdownMenuItem 
                        onClick={() => setCancelId(item.id)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Anile / Cancel
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between mb-6">
                {getStatusBadge(item.status)}
                <div className="flex items-center gap-1 text-sm text-muted-foreground bg-primary/5 px-2 py-1 rounded-md">
                  <Eye className="w-3 h-3" />
                  <span>{item.views} vues</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2 italic border-l-2 border-primary/20 pl-3">
                  "{item.message}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary/80 hover:bg-primary/5 p-0 font-medium"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/s/${item.linkSlug}`);
                    toast({ title: "Lyen kopye!", description: "Ou ka voye l bay moun ou renmen an." });
                  }}
                >
                  Kopye Lyen
                </Button>
                {item.status === 'accepted' && (
                  <span className="text-xs font-bold text-green-600 animate-pulse flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Succès!
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!cancelId} onOpenChange={(open) => !open && setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Èske w sèten?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksyon sa a pral dezaktive lyen an. Moun nan p ap ka wè sipriz la ankò.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Retounen</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Wi, Anile l
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
