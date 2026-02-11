import { ArrowRight } from "lucide-react";
import productPaleta from "@/assets/product-paleta.jpg";
import productPelotas from "@/assets/product-pelotas.jpg";
import productBolso from "@/assets/product-bolso.jpg";
import productIndumentaria from "@/assets/product-indumentaria.jpg";

const categories = [
  { name: "Palas", image: productPaleta, count: 48, tag: "MÁS VENDIDO" },
  { name: "Pelotas", image: productPelotas, count: 12, tag: null },
  { name: "Bolsos", image: productBolso, count: 24, tag: null },
  { name: "Indumentaria", image: productIndumentaria, count: 36, tag: "NUEVO" },
];

const CategorySection = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Court lines background */}
      <div className="absolute inset-0 court-lines opacity-50" />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tighter uppercase">
            Explorá por <span className="text-gradient">categoría</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Todo lo que necesitás para dominar la cancha
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <a
              key={cat.name}
              href="#"
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden animate-fade-in-up border border-border hover:border-primary/50 hover:shadow-[0_8px_40px_hsl(48_96%_53%_/_0.15)] transition-all duration-500"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              
              {cat.tag && (
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-[hsl(145,80%,42%)] text-white rounded-full shadow-[0_0_12px_hsl(145_80%_42%_/_0.4)]">
                    {cat.tag}
                  </span>
                </div>
              )}
              
              {/* Neon bottom line on hover */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary via-[hsl(145,80%,42%)] to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <p className="text-xs text-primary font-bold mb-1 uppercase tracking-wider">{cat.count} productos</p>
                <h3 className="font-heading text-xl md:text-2xl font-black text-white uppercase tracking-tight">{cat.name}</h3>
                <div className="flex items-center gap-1 mt-3 text-sm text-[hsl(145,80%,42%)] font-bold opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 uppercase tracking-wider">
                  Ver todo <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
