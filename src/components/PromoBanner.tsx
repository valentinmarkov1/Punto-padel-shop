import { Truck, Shield, RefreshCw, Headphones } from "lucide-react";

const features = [
  { icon: Truck,       title: "Envío gratis",      desc: "En compras +$350.000" },
  { icon: Shield,      title: "Garantía oficial",  desc: "En todos los productos" },
  { icon: RefreshCw,   title: "Cambios gratis",    desc: "Hasta 30 días" },
  { icon: Headphones,  title: "Soporte 24/7",      desc: "Te asesoramos siempre" },
];

const PromoBanner = () => {
  return (
    <section className="py-6 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-4 border border-border rounded-lg px-4 py-4">
              <f.icon className="w-6 h-6 text-muted-foreground shrink-0" strokeWidth={1.5} />
              <div>
                <p className="font-heading font-black text-xs uppercase tracking-wide text-foreground leading-tight">
                  {f.title}
                </p>
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
