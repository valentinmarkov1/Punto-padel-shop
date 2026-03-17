import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Trash2,
    Plus,
    Minus,
    ShoppingCart,
    ArrowLeft,
    ChevronRight,
    Zap,
    Trash
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Carrito = () => {
    const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();
    const navigate = useNavigate();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(price).replace("ARS", "$");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in pt-32">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground opacity-20" />
                </div>
                <h2 className="font-heading font-black text-3xl uppercase tracking-tighter mb-4 italic">Tu carrito está vacío</h2>
                <p className="text-muted-foreground text-lg max-w-[400px] mb-8">
                    ¡Explorá nuestra tienda y encontrá el mejor equipamiento para tu juego!
                </p>
                <Button
                    onClick={() => navigate("/productos")}
                    className="font-heading font-bold uppercase tracking-widest rounded-xl h-12 px-8 glow"
                >
                    Explorar productos
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary/30 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Breadcrumb */}
                <div className="flex items-center gap-2 mb-8 text-sm uppercase font-bold tracking-widest text-muted-foreground">
                    <span className="text-foreground">Carrito</span>
                    <ChevronRight className="w-4 h-4" />
                    <span>Checkout</span>
                    <ChevronRight className="w-4 h-4" />
                    <span>Confirmación</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <h1 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter italic">Mi Carrito</h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">
                        {itemCount} {itemCount === 1 ? 'producto' : 'productos'} seleccionado{itemCount === 1 ? '' : 's'}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de productos */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-card border border-border rounded-t-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <div className="col-span-6">Producto</div>
                            <div className="col-span-2 text-center">Cantidad</div>
                            <div className="col-span-2 text-right">Subtotal</div>
                            <div className="col-span-2"></div>
                        </div>

                        <div className="space-y-4">
                            {items.map((item) => (
                                <Card key={item.id} className="border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-card group">
                                    <CardContent className="p-4 md:p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                            {/* Info Producto */}
                                            <div className="col-span-1 md:col-span-6 flex gap-4">
                                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-secondary border border-border flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{item.category}</p>
                                                    <h3 className="font-heading font-bold text-base md:text-lg leading-tight uppercase line-clamp-2">{item.name}</h3>
                                                    <p className="text-sm font-bold mt-1">{formatPrice(item.price)} <span className="text-[10px] text-muted-foreground font-normal">c/u</span></p>
                                                </div>
                                            </div>

                                            {/* Selector Cantidad */}
                                            <div className="col-span-1 md:col-span-2 flex justify-center">
                                                <div className="flex items-center bg-secondary/50 rounded-xl border border-border p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors disabled:opacity-30"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-black w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Subtotal Item */}
                                            <div className="col-span-1 md:col-span-2 text-right">
                                                <p className="font-heading font-black text-lg md:text-xl text-foreground">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>

                                            {/* Acciones */}
                                            <div className="col-span-1 md:col-span-2 flex justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Button
                            variant="ghost"
                            onClick={() => navigate("/productos")}
                            className="text-muted-foreground hover:text-foreground text-xs uppercase font-bold tracking-widest gap-2 pl-0"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Seguir comprando
                        </Button>
                    </div>

                    {/* Resumen - Lateral */}
                    <div className="space-y-6">
                        <Card className="border-border shadow-xl overflow-hidden bg-card sticky top-24">
                            <div className="p-6 bg-secondary/30 border-b">
                                <h2 className="font-heading font-black text-xl uppercase italic">Resumen de Compra</h2>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground font-medium uppercase tracking-wider text-[11px]">Subtotal ({itemCount} ítems)</span>
                                        <span className="font-bold">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground font-medium uppercase tracking-wider text-[11px]">Envío estimado</span>
                                        <span className="text-[hsl(145,80%,42%)] font-black uppercase tracking-tighter italic">¡GRATIS!</span>
                                    </div>
                                    {subtotal > 100000 && (
                                        <div className="flex items-center gap-2 p-3 bg-destructive/5 text-destructive rounded-xl border border-destructive/10 animate-pulse">
                                            <Zap className="w-4 h-4 fill-current" />
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">¡Tenés un ahorro extra aplicado!</span>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="font-heading font-black text-xl uppercase italic">Total final</span>
                                        <div className="text-right">
                                            <p className="font-heading font-black text-4xl text-primary leading-none tracking-tighter">{formatPrice(subtotal)}</p>
                                            <p className="text-[10px] uppercase text-muted-foreground tracking-widest mt-1 italic font-bold">Iva incluido</p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => navigate("/checkout")}
                                        className="w-full h-16 font-heading font-black text-xl uppercase tracking-widest rounded-xl glow transform transition-all active:scale-95 shadow-lg shadow-primary/20 group"
                                    >
                                        Finalizar Compra
                                        <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carrito;
