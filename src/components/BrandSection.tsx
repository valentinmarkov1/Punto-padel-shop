import brandVideo from "@/assets/brand-video.mp4";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BrandSection = () => {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "520px" }}>
      {/* Video de fondo */}
      <div className="absolute inset-0">
        <video
          src={brandVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
      </div>

      {/* Contenido alineado a la izquierda */}
      <div className="relative container mx-auto px-6 md:px-12 py-24 md:py-32 flex flex-col items-start justify-center h-full">

        {/* Titular */}
        <h2 className="font-heading font-black uppercase leading-[0.9] tracking-tight text-white"
          style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)", textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
          No vendemos<br />
          <span className="text-primary">palas.</span><br />
          Vendemos<br />
          <span style={{ color: "hsl(145,80%,42%)" }}>dominio.</span>
        </h2>

        {/* Separador */}
        <div className="w-16 h-px bg-white/20 my-8" />

        {/* Subtítulo */}
        <p className="text-white text-base md:text-lg max-w-xs leading-relaxed"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
          Elegí el producto que te hace ganar puntos, no solo jugar.
        </p>

        {/* CTA */}
        <Link
          to="/productos"
          className="mt-10 inline-flex items-center gap-2 text-white font-heading font-bold text-sm uppercase tracking-widest border-b border-white/40 pb-1 hover:border-primary hover:text-primary transition-colors duration-300"
        >
          Explorá la colección
          <ArrowRight className="w-4 h-4" />
        </Link>

      </div>
    </section>
  );
};

export default BrandSection;
