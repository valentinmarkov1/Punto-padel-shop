import { Truck, Shield, RefreshCw, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Envío gratis", desc: "En compras +$200.000" },
  { icon: Shield, title: "Garantía oficial", desc: "En todos los productos" },
  { icon: RefreshCw, title: "Cambios gratis", desc: "Hasta 30 días" },
  { icon: Headphones, title: "Soporte 24/7", desc: "Te asesoramos siempre" },
];

const PromoBanner = () => {
  return (
    <section className="py-10 border-y border-border bg-secondary/50 relative overflow-hidden">
      {/* Subtle court lines */}
      <div className="absolute inset-0 court-lines opacity-30" />
      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center gap-3 group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_hsl(48_96%_53%_/_0.2)] transition-all duration-300">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-heading font-bold text-sm text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
