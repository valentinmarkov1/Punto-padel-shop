import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";

interface ProductCardProps extends Omit<Partial<Product>, "price"> {
  name: string;
  price: number | string;
  image: string;
  category: "Palas" | "Pelotas" | "Bolsos" | "Indumentaria" | "Accesorios";
}

const ProductCard = (props: ProductCardProps) => {
  const {
    id,
    slug,
    name,
    price,
    originalPrice,
    originalPriceFormatted,
    priceFormatted,
    image,
    category,
    isNew,
    isOffer,
    discount,
    discountPercentage,
    level,
    type,
    tag1
  } = props;

  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Reconstruct product object if needed or use props directly if it matches Product
    addItem(props as Product);
  };

  const displayPrice = typeof price === "number" ? `$${price.toLocaleString("es-AR")}` : price;
  const displayOriginalPrice = originalPriceFormatted || (originalPrice ? `$${originalPrice.toLocaleString("es-AR")}` : null);

  return (
    <div
      onClick={() => slug && navigate(`/producto/${slug}`)}
      className="group bg-card rounded-2xl border border-border overflow-hidden transition-all duration-500 hover:border-primary/60 hover:shadow-[0_8px_40px_rgba(74,222,128,0.2)] hover:-translate-y-2 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOffer && (
            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-destructive text-white rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
              OFERTA {discountPercentage ? `-${discountPercentage}%` : ""}
            </span>
          )}
          {tag1 && (
            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-[hsl(145,80%,42%)] text-white rounded-full shadow-[0_0_15px_hsl(145_80%_42%_/_0.4)]">
              {tag1}
            </span>
          )}
        </div>
        {/* Mobile Quick Add (Permanent on small screens) */}
        <Button
          size="icon"
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 rounded-full w-10 h-10 glow md:hidden z-10 shadow-lg"
        >
          <ShoppingCart className="w-4 h-4" />
        </Button>

        {/* Hover Actions (Desktop only) */}
        <div className="absolute inset-0 bg-foreground/70 opacity-0 md:group-hover:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center gap-4">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full w-12 h-12 border border-border"
            onClick={(e) => {
              e.stopPropagation();
              slug && navigate(`/producto/${slug}`);
            }}
          >
            <Eye className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            className="rounded-full w-12 h-12 glow"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
        {/* Neon glow on hover */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary via-[hsl(145,80%,42%)] to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

    {/* Info */}
    <div className="p-4 md:p-5 space-y-2">
      <p className="text-[11px] text-[hsl(145,80%,42%)] font-bold uppercase tracking-widest">{category}</p>
      <h3 className="font-heading font-bold text-foreground text-sm md:text-base leading-tight line-clamp-2">{name}</h3>
      <div className="flex items-center gap-2 pt-1">
        <span className="font-heading font-black text-lg md:text-xl text-foreground">{priceFormatted || displayPrice}</span>
          {isOffer && displayOriginalPrice && (
            <span className="text-sm text-muted-foreground line-through">{displayOriginalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
