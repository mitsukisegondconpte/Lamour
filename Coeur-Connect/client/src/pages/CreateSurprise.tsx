import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSurpriseSchema } from "@shared/schema";
import { useCreateSurprise } from "@/hooks/use-surprises";
import { useLocation } from "wouter";
import { Loader2, Music, Sparkles, X } from "lucide-react";
import { z } from "zod";
import { MediaUploader } from "@/components/MediaUploader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertSurpriseSchema.extend({
  media: z.array(z.object({
    type: z.enum(['photo', 'video']),
    url: z.string()
  })).optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateSurprise() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { mutate: createSurprise, isPending } = useCreateSurprise();
  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiverName: "",
      message: "",
      musicUrl: "",
      isAnonymous: false,
    }
  });

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      media: uploadedMedia.map(url => ({ type: 'photo' as const, url }))
    };

    createSurprise(payload, {
      onSuccess: () => {
        toast({
          title: "Sipriz kreye! 🎉",
          description: "Kounye a ou ka pataje lyen an.",
        });
        setLocation("/dashboard");
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Yon bagay pase mal. Tcheke enfòmasyon yo.",
          variant: "destructive"
        });
      }
    });
  };

  const removeMedia = (indexToRemove: number) => {
    setUploadedMedia(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Kreye yon moman majik ✨</h1>
        <p className="text-muted-foreground">Ranpli fòm nan pou prepare sipriz la.</p>
      </div>

      <Card className="p-6 md:p-8 bg-white/80 backdrop-blur-md shadow-xl border-white/50 rounded-3xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="space-y-2">
            <Label htmlFor="receiverName" className="text-base font-semibold">Pou kimoun sipriz la ye?</Label>
            <Input 
              {...form.register("receiverName")}
              id="receiverName" 
              placeholder="Eg. Cheri, Mon Amour, Crush mwen..." 
              className="bg-white/50 border-primary/20 focus:border-primary focus:ring-primary/20 h-12 text-lg rounded-xl"
            />
            {form.formState.errors.receiverName && (
              <p className="text-sm text-destructive">{form.formState.errors.receiverName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-base font-semibold">Mesaj ou a (Kreyòl/Français)</Label>
            <Textarea 
              {...form.register("message")}
              id="message" 
              placeholder="Ekri tout sa ou gen nan kè w..." 
              className="bg-white/50 border-primary/20 focus:border-primary focus:ring-primary/20 min-h-[150px] text-lg rounded-xl p-4 font-handwriting leading-relaxed"
            />
            {form.formState.errors.message && (
              <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Ajoute Foto (Opsyonèl)</Label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {uploadedMedia.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeMedia(idx)}
                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {uploadedMedia.length < 5 && (
                <MediaUploader 
                  onUploadComplete={(url) => setUploadedMedia(prev => [...prev, url])}
                  className="aspect-square flex flex-col items-center justify-center p-2 text-xs" 
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">Maximum 5 photos. (Rekòmande: 1-3)</p>
          </div>

          <div className="p-4 bg-secondary/30 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 font-semibold">
              <Music className="w-5 h-5 text-primary" />
              <span>Mizik Fond (Background Music)</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Chwazi yon mizik romantique:</p>
            <select 
              {...form.register("musicUrl")}
              className="w-full p-3 rounded-xl border border-border bg-white"
            >
              <option value="">(Silans) - Pa gen mizik</option>
              <option value="/music/kompa-love.mp3">Kompa Love Dou</option>
              <option value="/music/piano-romantic.mp3">Piano Romantique</option>
              <option value="/music/zouk-soft.mp3">Zouk Soft</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-xl">
            <div className="space-y-0.5">
              <Label htmlFor="anonymous" className="font-semibold">Mòd Anonim 🕵️</Label>
              <p className="text-sm text-muted-foreground">Kache idantite w (Secret Admirer)</p>
            </div>
            <Switch 
              id="anonymous"
              onCheckedChange={(checked) => form.setValue("isAnonymous", checked)} 
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-primary to-rose-600 shadow-xl shadow-primary/30 hover:shadow-2xl hover:scale-[1.01] transition-all"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Kreye Sipriz la...
              </>
            ) : (
              <>
                Kreye & Jenere Lyen <Sparkles className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

        </form>
      </Card>
    </div>
  );
}
