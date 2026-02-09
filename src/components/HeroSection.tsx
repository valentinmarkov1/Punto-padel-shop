import heroBg from "@/assets/hero-padel.jpg";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative h-[95vh] min-h-[650px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Jugador de pádel en acción" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        {/* Diagonal accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-primary" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <Flame className="w-4 h-4 text-accent" />
            <span className="text-accent font-heading font-bold text-xs uppercase tracking-widest">
              Nueva Temporada 2026
            </span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            DOMINÁ
            <br />
            <span className="text-gradient">LA CANCHA</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-lg animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.3s" }}>
            Equipamiento de élite. Las mejores marcas, tecnología de punta, precios que rompen la cancha.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button size="lg" className="font-heading font-black text-base uppercase tracking-wider animate-pulse-glow px-8 h-14 text-lg">
              Ver catálogo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="font-heading font-black text-base uppercase tracking-wider border-accent/40 text-accent hover:bg-accent/10 hover:border-accent px-8 h-14 text-lg">
              🔥 Ofertas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
