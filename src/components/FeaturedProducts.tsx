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
    category: "Paletas",
    isNew: true,
    discount: "-17%",
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
    category: "Paletas",
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
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-heading text-3xl md:text-5xl font-black tracking-tight">
              Productos <span className="text-gradient">destacados</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Lo más vendido de la temporada
            </p>
          </div>
          <a href="#" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Ver todo
          </a>
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
