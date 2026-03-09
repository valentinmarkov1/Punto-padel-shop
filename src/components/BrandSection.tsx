import brandBg from "@/assets/brand-emotional.jpg";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BrandSection = () => {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={brandBg} alt="Pádel profesional en acción" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        {/* Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,hsl(145_80%_42%_/_0.15)_0%,transparent_70%)]" />
      </div>

      {/* Diagonal lines */}
      <div className="absolute inset-0 diagonal-accent opacity-30" />

      {/* Content */}
      <div className="relative container mx-auto px-4 text-center">
        <p className="text-[hsl(145,80%,42%)] font-heading font-bold text-sm uppercase tracking-[0.3em] mb-6 animate-slide-up">
          Filosofía Punto Pádel
        </p>
        <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-[-0.03em] max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
          NO VENDEMOS
          <br />
          <span className="text-primary">PALAS</span>
          <br />
          VENDEMOS
          <br />
          <span className="text-gradient-neon">DOMINIO</span>
        </h2>
        <p className="mt-8 text-white/50 text-lg md:text-xl max-w-lg mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Cada producto fue pensado para jugadores que buscan rendimiento real. No excusas.
        </p>
      </div>
    </section>
  );
};

export default BrandSection;
