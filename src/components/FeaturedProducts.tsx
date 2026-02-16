import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";

const FeaturedProducts = () => {
  const featured = products.slice(0, 8); // Just take the first 8 for home

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
          <Button asChild variant="outline" className="hidden md:flex items-center gap-1 font-heading font-bold uppercase tracking-wider text-xs border-primary/30 text-primary hover:bg-primary/10 rounded-xl">
            <Link to="/productos">
              Ver todo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product, i) => (
            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
