import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  isNew?: boolean;
  discount?: string;
}

const ProductCard = ({ name, price, originalPrice, image, category, isNew, discount }: ProductCardProps) => {
  return (
    <div className="group card-gradient rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(142_72%_50%/0.1)]">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isNew && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full">
              Nuevo
            </span>
          )}
          {discount && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-destructive text-destructive-foreground rounded-full">
              {discount}
            </span>
          )}
        </div>
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button size="icon" variant="secondary" className="rounded-full w-11 h-11">
            <Eye className="w-5 h-5" />
          </Button>
          <Button size="icon" className="rounded-full w-11 h-11 glow">
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <p className="text-xs text-primary font-medium uppercase tracking-wider">{category}</p>
        <h3 className="font-heading font-semibold text-foreground text-sm leading-tight line-clamp-2">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-lg text-foreground">{price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
