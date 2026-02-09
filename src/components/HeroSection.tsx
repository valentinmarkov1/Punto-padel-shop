import heroBg from "@/assets/hero-padel.jpg";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Jugador de pádel en acción" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl space-y-6">
          <p className="text-primary font-heading font-semibold text-sm md:text-base tracking-widest uppercase animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Nueva Temporada 2026
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] tracking-tight animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Elevá tu
            <br />
            <span className="text-gradient">juego</span> al
            <br />
            máximo nivel
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            Equipamiento premium de pádel. Las mejores marcas, la mejor tecnología, al mejor precio.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button size="lg" className="font-heading font-bold text-base glow">
              Ver catálogo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="font-heading font-bold text-base border-foreground/20 hover:border-primary hover:text-primary">
              Ofertas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
