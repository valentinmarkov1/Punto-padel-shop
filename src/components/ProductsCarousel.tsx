import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import ProductCard from "./ProductCard";

const ProductsCarousel = () => {
  const { publicProducts, loading } = useAdmin();
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const top = [...publicProducts]
    .sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0))
    .slice(0, 10);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api, onSelect]);

  if (loading || top.length === 0) return null;

  return (
    <section className="py-12 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading font-black text-2xl md:text-3xl uppercase tracking-tight text-foreground">
            Nuestros productos favoritos
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => api?.scrollPrev()}
              disabled={!canPrev}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              disabled={!canNext}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carrusel */}
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: false }}
        >
          <CarouselContent className="-ml-3">
            {top.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-3 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <ProductCard {...product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Ver todos */}
        <div className="text-center mt-8">
          <Link
            to="/productos"
            className="inline-block border border-border rounded-lg px-6 py-2 text-sm font-heading font-bold uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Ver todos los productos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsCarousel;
