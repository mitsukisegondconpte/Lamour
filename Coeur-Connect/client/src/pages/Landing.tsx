import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Send, ShieldCheck, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:pt-48 md:pb-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-primary/20 text-primary text-sm font-semibold shadow-sm">
              <Heart className="w-4 h-4 fill-primary animate-pulse" />
              <span>Platfòm Lanmou #1 an Ayiti</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display leading-[1.1] text-foreground">
              Voye sipriz <br/>
              <span className="text-gradient">plen lanmou</span> <br/>
              pou moun ou renmen
            </h1>

            <p className="text-xl text-muted-foreground md:max-w-lg leading-relaxed font-light">
              Crée des moments inoubliables avec des messages animés, photos et musique. 
              Senp, rapid, e 100% amoure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/create">
                <Button size="lg" className="rounded-full text-lg px-8 py-6 shadow-xl shadow-primary/25 bg-primary hover:bg-primary/90 hover:scale-105 transition-all">
                  Kòmanse Kounye a
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full text-lg px-8 py-6 border-2 hover:bg-white/50"
                >
                  Se Connecter
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Abstract Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pink-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse" />
            
            {/* Phone Mockup or Visual */}
            <div className="relative glass-card rounded-[2.5rem] p-6 rotate-[-6deg] hover:rotate-0 transition-transform duration-500 shadow-2xl border-4 border-white/50">
              {/* Couple Image Placeholder */}
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100">
                {/* romantic couple laughing sunset */}
                <img 
                  src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=60" 
                  alt="Couple Happy" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                  <p className="font-handwriting text-2xl font-bold">Mwen renmen w cheri ❤️</p>
                </div>
              </div>

              {/* Floating Element */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 top-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-2xl">😍</div>
                <div>
                  <p className="font-bold text-sm">Li aksepte!</p>
                  <p className="text-xs text-muted-foreground">Sa fè 2 minit</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Poukisa Lanmou?</h2>
            <p className="text-muted-foreground text-lg">Tout sa ou bezwen pou eksprime santiman w</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Sparkles, 
                title: "Animasyon Majik", 
                desc: "Des effets visuels époustouflants qui font battre le cœur plus vite." 
              },
              { 
                icon: ShieldCheck, 
                title: "100% Prive", 
                desc: "Mesaj ou yo an sekirite. Se sèlman moun ki gen lyen an ki ka wè l." 
              },
              { 
                icon: Send, 
                title: "Partage Facile", 
                desc: "Voye lyen an sou WhatsApp, Messenger, oswa Instagram nan yon klik." 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/60 p-8 rounded-3xl border border-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
