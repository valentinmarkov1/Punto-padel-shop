import { Truck, Shield, RefreshCw, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Envío gratis", desc: "En compras +$50.000" },
  { icon: Shield, title: "Garantía oficial", desc: "En todos los productos" },
  { icon: RefreshCw, title: "Cambios gratis", desc: "Hasta 30 días" },
  { icon: Headphones, title: "Soporte 24/7", desc: "Te asesoramos siempre" },
];

const PromoBanner = () => {
  return (
    <section className="py-12 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
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
