import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import productPaleta from "@/assets/product-paleta.jpg";
import productPelotas from "@/assets/product-pelotas.jpg";
import productBolso from "@/assets/product-bolso.jpg";
import productIndumentaria from "@/assets/product-indumentaria.jpg";

const products = [
  {
    name: "Paleta Pro Carbon Elite 2026",
    price: "$189.990",
    originalPrice: "$229.990",
    image: productPaleta,
    category: "Palas",
    isNew: true,
    discount: "-17%",
    type: "Potencia",
    level: "Avanzado",
  },
  {
    name: "Tubo de Pelotas Championship x3",
    price: "$12.990",
    image: productPelotas,
    category: "Pelotas",
  },
  {
    name: "Mochila Paletero Tour Pro",
    price: "$89.990",
    originalPrice: "$109.990",
    image: productBolso,
    category: "Bolsos",
    discount: "-18%",
  },
  {
    name: "Remera Dry-Fit Performance",
    price: "$34.990",
    image: productIndumentaria,
    category: "Indumentaria",
    isNew: true,
  },
  {
    name: "Paleta Control Soft Touch",
    price: "$149.990",
    image: productPaleta,
    category: "Palas",
    type: "Control",
    level: "Intermedio",
  },
  {
    name: "Kit Pelotas Presión x4",
    price: "$15.990",
    originalPrice: "$18.990",
    image: productPelotas,
    category: "Pelotas",
    discount: "-16%",
  },
  {
    name: "Bolso Deportivo Weekend XL",
    price: "$74.990",
    image: productBolso,
    category: "Bolsos",
    isNew: true,
  },
  {
    name: "Short Pro Training Mesh",
    price: "$29.990",
    image: productIndumentaria,
    category: "Indumentaria",
    level: "Todos",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Subtle diagonal texture */}
      <div className="absolute inset-0 diagonal-accent" />
      <div className="absolute inset-0 bg-secondary/30" />

      <div className="relative container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tighter uppercase">
              Productos <span className="text-gradient">destacados</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Lo más vendido de la temporada
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex items-center gap-1 font-heading font-bold uppercase tracking-wider text-xs border-primary/30 text-primary hover:bg-primary/10 rounded-xl">
            Ver todo
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
