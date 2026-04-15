import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Trash2, Plus, Minus, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
    const { items, removeItem, updateQuantity, subtotal, itemCount, shippingCost, total } = useCart();
    const navigate = useNavigate();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(price).replace("ARS", "$");
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-card border-l border-border">
                <SheetHeader className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="font-heading font-black text-2xl uppercase tracking-tighter flex items-center gap-2">
                            <ShoppingCart className="w-6 h-6 text-primary" />
                            Tu Carrito
                            {itemCount > 0 && <span className="text-sm font-bold text-muted-foreground ml-2">({itemCount} ítems)</span>}
                        </SheetTitle>
                    </div>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-2">
                            <ShoppingCart className="w-10 h-10 text-muted-foreground opacity-20" />
                        </div>
                        <h3 className="font-heading font-bold text-xl uppercase italic">Tu carrito está vacío</h3>
                        <p className="text-muted-foreground text-sm max-w-[250px]">
                            ¡Explorá nuestros productos y encontrá lo que necesitás para tu próximo partido!
                        </p>
                        <Button
                            onClick={() => {
                                onOpenChange(false);
                                navigate("/productos");
                            }}
                            className="mt-4 font-heading font-bold uppercase tracking-wider rounded-xl glow"
                        >
                            Ver productos
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 animate-fade-in">
                                        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-secondary border border-border flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-heading font-bold text-sm leading-tight line-clamp-2 pr-6">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">{item.category}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center bg-secondary rounded-lg border border-border">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 px-2 hover:text-primary transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 px-2 hover:text-primary transition-colors disabled:opacity-30"
                                                        disabled={item.quantity >= (item.stock ?? 0)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <span className="font-heading font-black text-base text-foreground">
                                                    {formatPrice(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="p-6 border-t border-border bg-secondary/30 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-bold">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Envío</span>
                                    {shippingCost === 0 ? (
                                        <span className="text-[hsl(145,80%,42%)] font-bold">GRATIS</span>
                                    ) : (
                                        <span className="font-bold">{formatPrice(shippingCost)}</span>
                                    )}
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between items-end">
                                    <span className="font-heading font-black text-lg uppercase">Total</span>
                                    <span className="font-heading font-black text-2xl text-primary">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button 
                                    onClick={() => {
                                        onOpenChange(false);
                                        navigate("/carrito");
                                    }}
                                    className="w-full h-14 font-heading font-black text-lg uppercase tracking-wider rounded-xl glow group"
                                >
                                    IR AL CARRITO
                                    <Plus className="ml-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
                                Pagos seguros con todas las tarjetas
                            </p>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;
