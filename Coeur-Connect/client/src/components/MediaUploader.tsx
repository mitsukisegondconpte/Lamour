import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useUploadMedia } from "@/hooks/use-surprises";
import { Button } from "@/components/ui/button";

interface MediaUploaderProps {
  onUploadComplete: (url: string) => void;
  className?: string;
}

export function MediaUploader({ onUploadComplete, className }: MediaUploaderProps) {
  const { mutate: upload, isPending } = useUploadMedia();
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("Fichier trop volumineux (Max 5MB)");
      return;
    }

    setError(null);
    upload(file, {
      onSuccess: (data) => {
        onUploadComplete(data.url);
      },
      onError: () => {
        setError("Erreur lors de l'upload. Essayez encore.");
      }
    });
  }, [upload, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
        ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-white/50'}
        ${error ? 'border-destructive bg-destructive/5' : ''}
        ${className}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center gap-3">
        {isPending ? (
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
        )}
        
        <div className="space-y-1">
          <p className="font-medium text-foreground">
            {isPending ? "Upload an kout..." : "Klike oswa depoze foto"}
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, MP4 (Max 5MB)
          </p>
        </div>

        {error && (
          <p className="text-xs text-destructive font-medium mt-2 bg-destructive/10 px-3 py-1 rounded-full">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
