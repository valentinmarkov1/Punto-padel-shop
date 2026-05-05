import { useState, useEffect } from "react";
import { Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
// Import removal
import { useAdmin } from "@/context/AdminContext";
import { getTimeLeft } from "@/lib/offer-utils";

const OffersSection = () => {
  const { products, settings, loading } = useAdmin();
  const [time, setTime] = useState(() => getTimeLeft(settings.offerCountdownEnd));
  const offerProducts = products.filter(p => p.isOffer).slice(0, 3);

  useEffect(() => {
    setTime(getTimeLeft(settings.offerCountdownEnd));
    const interval = setInterval(() => setTime(getTimeLeft(settings.offerCountdownEnd)), 10000); // Mantenemos una actualización más frecuente (10s)
    return () => clearInterval(interval);
  }, [settings.offerCountdownEnd]);

  if (loading || !settings.offerCountdownEnabled) {
    return null;
  }

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Fondo de textura de cancha */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(145,80%,42%)]/5 to-background" />
      <div className="absolute inset-0 court-texture" />

      <div className="relative container mx-auto px-4">
        {/* Encabezado con cuenta regresiva */}
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

          {/* Cuenta regresiva moderna */}
          <div className="flex items-center gap-3">
            {time.isExpired ? (
              <div className="bg-foreground rounded-xl px-6 py-3 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 rounded-xl border border-primary/30" />
                <span className="font-heading font-black text-2xl md:text-3xl text-primary relative z-10">
                  OFERTAS FINALIZADAS
                </span>
              </div>
            ) : (
              <>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Termina en:</span>
                <div className="flex gap-2">
                  {[
                    { val: pad(time.days), label: "DÍAS" },
                    { val: pad(time.hours), label: "HORAS" },
                    { val: pad(time.minutes), label: "MINUTOS" },
                  ].map((t, i) => (
                    <div key={t.label} className="relative bg-foreground rounded-xl px-4 py-3 text-center min-w-[64px] shadow-lg overflow-hidden">
                      {/* Borde neón */}
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
              </>
            )}
          </div>
        </div>

        {!time.isExpired && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerProducts.map((product, i) => (
                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ProductCard {...product} />
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button asChild variant="outline" size="lg" className="font-heading font-bold text-base uppercase tracking-wider border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive rounded-xl">
                <Link to="/productos?ofertas=true">
                  Ver todas las ofertas
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default OffersSection;
