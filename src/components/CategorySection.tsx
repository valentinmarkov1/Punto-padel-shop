import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import productPaleta from "@/assets/product-paleta.jpg";
import productPelotas from "@/assets/product-pelotas.jpg";
import productBolso from "@/assets/product-bolso.jpg";
import productIndumentaria from "@/assets/product-indumentaria.jpg";
import { useAdmin } from "@/context/AdminContext";

const categoryMetadata = [
  { name: "Palas",        path: "/productos?categoria=palas",        image: productPaleta },
  { name: "Pelotas",      path: "/productos?categoria=pelotas",      image: productPelotas },
  { name: "Bolsos",       path: "/productos?categoria=bolsos",       image: productBolso },
  { name: "Indumentaria", path: "/productos?categoria=indumentaria", image: productIndumentaria },
];

const CategorySection = () => {
  const { products, loading } = useAdmin();

  if (loading) return null;

  const categories = categoryMetadata.map(cat => ({
    ...cat,
    count: products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length,
  }));

  return (
    <section className="py-14 bg-white border-t border-border">
      <div className="container mx-auto px-4">

        {/* Título */}
        <div className="mb-8">
          <h2 className="font-heading font-black text-2xl md:text-3xl uppercase tracking-tight text-foreground">
            Explorá por <span className="text-primary">categoría</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Todo lo que necesitás para dominar la cancha
          </p>
        </div>

        {/* Grid 2x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const available = cat.count > 0;
            return (
              <div key={cat.name} className="group border border-border rounded-lg overflow-hidden bg-white hover:border-primary/40 transition-colors duration-300">

                {/* Foto */}
                <div className="relative aspect-video overflow-hidden bg-secondary">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!available ? "grayscale opacity-60" : ""}`}
                  />
                  {!available && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-black/60 text-white text-xs font-heading font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        Próximamente
                      </span>
                    </div>
                  )}
                </div>

                {/* Texto + CTA */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div>
                    <h3 className="font-heading font-black text-base uppercase tracking-tight text-foreground">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {available ? `${cat.count} producto${cat.count !== 1 ? "s" : ""}` : "Próximamente"}
                    </p>
                  </div>

                  {available ? (
                    <Link
                      to={cat.path}
                      className="inline-flex items-center gap-1.5 border border-border rounded px-4 py-1.5 text-xs font-heading font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors duration-200"
                    >
                      Ver más
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground font-heading font-bold uppercase tracking-wider">
                      Próximamente
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
