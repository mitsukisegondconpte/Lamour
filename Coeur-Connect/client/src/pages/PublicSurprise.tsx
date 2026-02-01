import { useEffect, useState, useRef } from "react";
import { usePublicSurprise, useRespondToSurprise } from "@/hooks/use-surprises";
import { useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, HeartCrack, MessageCircle, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function PublicSurprise() {
  const [, params] = useRoute("/s/:slug");
  const slug = params?.slug || "";
  const { data, isLoading, error } = usePublicSurprise(slug);
  const { mutate: respond } = useRespondToSurprise();
  
  const [step, setStep] = useState<"envelope" | "reveal" | "response">("envelope");
  const [replyMessage, setReplyMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play music when revealed
  useEffect(() => {
    if (step === "reveal" && data?.musicUrl) {
      audioRef.current = new Audio(data.musicUrl);
      audioRef.current.loop = true;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      
      return () => {
        audioRef.current?.pause();
      };
    }
  }, [step, data]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleAccept = () => {
    if (!data) return;
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#ff69b4', '#ffffff']
    });
    respond({ id: data.id, data: { responseType: 'accept' } });
    setStep('response');
  };

  const handleReject = () => {
    if (!data) return;
    respond({ id: data.id, data: { responseType: 'reject' } });
    setStep('response');
  };

  const sendReply = () => {
    if (!data) return;
    respond({ id: data.id, data: { responseType: 'reply', message: replyMessage } });
    setReplyMessage(""); // clear
    alert("Repons ou an voye!");
  };

  if (isLoading) return <div className="h-screen bg-pink-50 flex items-center justify-center animate-pulse">Chargement de l'amour...</div>;
  
  if (error || !data || data.status === 'cancelled') {
    return (
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <HeartCrack className="w-20 h-20 text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold text-gray-600">Sipriz sa a pa disponib</h1>
        <p className="text-muted-foreground mt-2">Lyen an ekspire oswa li te anile pa moun ki voye l la.</p>
      </div>
    );
  }

  // ENVELOPE OPENING ANIMATION
  if (step === "envelope") {
    return (
      <div className="h-screen bg-red-50 flex flex-col items-center justify-center p-4 cursor-pointer" onClick={() => setStep("reveal")}>
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
          className="relative bg-white w-full max-w-sm aspect-[4/3] shadow-2xl rounded-lg flex items-center justify-center border-4 border-primary/20"
        >
          <div className="absolute inset-0 bg-primary/5 pattern-dots" />
          <Heart className="w-24 h-24 text-primary fill-primary animate-pulse relative z-10" />
          <div className="absolute bottom-8 font-handwriting text-2xl text-primary font-bold">
            Pou: {data.receiverName}
          </div>
          <p className="absolute -bottom-12 text-muted-foreground animate-bounce">Tape pou ouvri 💌</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 pb-20 overflow-x-hidden">
      {data.musicUrl && (
        <button onClick={toggleMusic} className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur p-3 rounded-full shadow-lg">
          {isPlaying ? <Pause className="w-5 h-5 text-primary" /> : <Play className="w-5 h-5 text-primary" />}
        </button>
      )}

      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="absolute text-pink-200/40 text-4xl floating-hearts" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${5 + Math.random() * 5}s`
          }}>♥</div>
        ))}
      </div>

      <div className="max-w-md mx-auto pt-12 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-display font-bold text-center mb-8 text-foreground leading-tight">
            Yon mesaj espesyal pou <br/>
            <span className="text-primary">{data.receiverName}</span>
          </h1>

          {/* Carousel / Slideshow */}
          {data.media && data.media.length > 0 && (
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl mb-8 border-4 border-white bg-white">
              {/* Simple slideshow - just showing first image for MVP simplicity, assume user clicks through in real app */}
              <img src={data.media[0].url} alt="Love" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Message Card */}
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/60 relative mb-10">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6" />
            </div>
            <p className="font-handwriting text-xl md:text-2xl leading-relaxed text-center text-gray-800 mt-4">
              "{data.message}"
            </p>
            {!data.isAnonymous && (
              <p className="text-right mt-6 font-bold text-primary">— {data.senderId === 'anonymous' ? 'Admirateur Secret' : 'Yon moun ki renmen w'}</p>
            )}
          </div>

          {/* Actions */}
          {step !== 'response' ? (
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleAccept}
                className="h-16 text-lg rounded-2xl bg-green-500 hover:bg-green-600 shadow-green-200 shadow-xl"
              >
                Aksepte ❤️
              </Button>
              <Button 
                onClick={handleReject}
                variant="outline"
                className="h-16 text-lg rounded-2xl border-2 border-red-100 hover:bg-red-50 text-red-400"
              >
                Refize 💔
              </Button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="bg-white p-6 rounded-3xl shadow-lg"
            >
              <h3 className="font-bold text-lg mb-4 text-center">Voye yon ti repons? 💬</h3>
              <Textarea 
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Di yon ti mo..."
                className="mb-4 bg-gray-50 border-0 focus:ring-1 focus:ring-primary/20"
              />
              <Button onClick={sendReply} className="w-full rounded-xl">Voye Repons</Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
