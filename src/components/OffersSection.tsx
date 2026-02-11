import { useState, useEffect } from "react";
import { Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import productPaleta from "@/assets/product-paleta.jpg";
import productPelotas from "@/assets/product-pelotas.jpg";
import productBolso from "@/assets/product-bolso.jpg";

const offerProducts = [
  {
    name: "Paleta Pro Carbon Elite 2026",
    price: "$189.990",
    originalPrice: "$229.990",
    image: productPaleta,
    category: "Palas",
    discount: "-17%",
    type: "Potencia",
    level: "Avanzado",
  },
  {
    name: "Tubo de Pelotas Championship x3",
    price: "$9.990",
    originalPrice: "$12.990",
    image: productPelotas,
    category: "Pelotas",
    discount: "-23%",
  },
  {
    name: "Mochila Paletero Tour Pro",
    price: "$69.990",
    originalPrice: "$109.990",
    image: productBolso,
    category: "Bolsos",
    discount: "-36%",
  },
];

const getTimeLeft = () => {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const diff = endOfDay.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
};

const OffersSection = () => {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Court texture background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(145,80%,42%)]/5 to-background" />
      <div className="absolute inset-0 court-texture" />

      <div className="relative container mx-auto px-4">
        {/* Header with countdown */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-6 h-6 text-destructive" />
              <span className="text-destructive font-heading font-black text-sm uppercase tracking-widest">
                Ofertas flash
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tighter">
              PRECIOS QUE{" "}
              <span className="text-gradient-hot animate-text-flicker inline-block text-4xl md:text-6xl">
                EXPLOTAN
              </span>
            </h2>
          </div>

          {/* Modern Countdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Termina en:</span>
            <div className="flex gap-2">
              {[
                { val: pad(time.hours), label: "HS" },
                { val: pad(time.minutes), label: "MIN" },
                { val: pad(time.seconds), label: "SEG" },
              ].map((t, i) => (
                <div key={t.label} className="relative bg-foreground rounded-xl px-4 py-3 text-center min-w-[64px] shadow-lg overflow-hidden">
                  {/* Neon border */}
                  <div className="absolute inset-0 rounded-xl border border-primary/30" />
                  <span className="font-heading font-black text-3xl text-primary animate-countdown inline-block">
                    {t.val}
                  </span>
                  <p className="text-[10px] font-bold text-background/50 tracking-wider mt-0.5">{t.label}</p>
                  {i < 2 && (
                    <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 text-primary font-black text-xl z-10">:</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerProducts.map((product, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" className="font-heading font-bold text-base uppercase tracking-wider border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive rounded-xl">
            Ver todas las ofertas
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
