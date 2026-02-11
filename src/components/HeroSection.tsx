import heroBg from "@/assets/hero-padel.jpg";
import { ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.4 + 0.1,
}));

const HeroSection = () => {
  return (
    <section className="relative h-[95vh] min-h-[650px] flex items-center overflow-hidden">
      {/* Background with zoom animation */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Jugador profesional de pádel en acción" className="w-full h-full object-cover animate-hero-zoom" />
        {/* Darker overlays for drama */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
        {/* Green/yellow spotlight effect */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,hsl(145_80%_42%_/_0.12)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-[radial-gradient(circle,hsl(48_96%_53%_/_0.1)_0%,transparent_70%)] blur-3xl" />
      </div>

      {/* Dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-primary/60 animate-particle"
            style={{
              left: p.left,
              bottom: '-10px',
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Diagonal accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[hsl(145,80%,42%)] via-primary to-[hsl(145,80%,42%)]" />

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 bg-[hsl(145,80%,42%)]/15 border border-[hsl(145,80%,42%)]/30 rounded-full px-5 py-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Trophy className="w-4 h-4 text-[hsl(145,80%,42%)]" />
            <span className="text-[hsl(145,80%,42%)] font-heading font-bold text-xs uppercase tracking-[0.2em]">
              Equipamiento de élite 2026
            </span>
          </div>
          <h1 className="font-heading text-6xl sm:text-7xl md:text-[7rem] font-black leading-[0.85] tracking-[-0.04em] text-white animate-slide-up" style={{ animationDelay: "0.2s" }}>
            POTENCIA.
            <br />
            <span className="text-primary">PRECISIÓN.</span>
            <br />
            <span className="text-[hsl(145,80%,42%)]">DOMINIO.</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-lg animate-slide-up leading-relaxed" style={{ animationDelay: "0.3s" }}>
            Armas para jugadores que no vinieron a participar. Vinieron a ganar.
          </p>
          <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Button size="lg" className="font-heading font-black text-base uppercase tracking-wider animate-pulse-glow px-10 h-16 text-lg rounded-xl">
              <Trophy className="mr-2 w-5 h-5" />
              Ver Productos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" className="font-heading font-bold text-sm uppercase tracking-wider bg-[hsl(145,80%,42%)] text-white hover:bg-[hsl(145,80%,42%)]/90 px-7 h-14 rounded-xl border border-[hsl(145,80%,42%)]/50">
              Ofertas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
