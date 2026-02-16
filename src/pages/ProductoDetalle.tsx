import { useParams, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    ShoppingCart,
    ArrowLeft,
    Zap,
    ShieldCheck,
    Truck,
    RotateCcw,
    Minus,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ProductoDetalle = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);

    const product = products.find((p) => p.slug === slug);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
                    <Button onClick={() => navigate("/productos")}>Volver a la tienda</Button>
                </div>
                <Footer />
            </div>
        );
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 md:py-16">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8 uppercase tracking-wider"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Gallery Placeholder */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-3xl overflow-hidden bg-secondary border border-border group relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                            {product.isOffer && (
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-1.5 text-xs font-black uppercase tracking-widest bg-destructive text-white rounded-full shadow-lg animate-pulse">
                                        Hot Deal {product.discount}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                                    {product.category}
                                </span>
                                {product.isNew && (
                                    <span className="px-3 py-1 bg-[hsl(145,80%,42%)]/10 text-[hsl(145,80%,42%)] text-[10px] font-black uppercase tracking-widest rounded-full border border-[hsl(145,80%,42%)]/20">
                                        Nuevo Lanzamiento
                                    </span>
                                )}
                            </div>
                            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-none">
                                {product.name}
                            </h1>
                            <div className="flex items-end gap-3 pt-2">
                                <span className="font-heading font-black text-4xl text-foreground">{product.priceFormatted}</span>
                                {product.originalPriceFormatted && (
                                    <span className="text-xl text-muted-foreground line-through mb-1">{product.originalPriceFormatted}</span>
                                )}
                            </div>
                        </div>

                        <div className="prose prose-sm text-muted-foreground max-w-none mb-10">
                            <p className="text-lg leading-relaxed">{product.description}</p>
                        </div>

                        {/* Attributes for Palas */}
                        {product.category === "Palas" && (
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="bg-secondary/50 rounded-2xl p-4 border border-border">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Tipo de Juego</p>
                                    <p className="font-heading font-bold text-lg">{product.type}</p>
                                </div>
                                <div className="bg-secondary/50 rounded-2xl p-4 border border-border">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Nivel</p>
                                    <p className="font-heading font-bold text-lg">{product.level}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6 mt-auto">
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center bg-secondary rounded-xl border border-border h-14">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-12 h-full flex items-center justify-center hover:text-primary transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-heading font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-12 h-full flex items-center justify-center hover:text-primary transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <Button
                                    onClick={handleAddToCart}
                                    size="lg"
                                    className="flex-1 h-14 font-heading font-black text-lg uppercase tracking-wider rounded-xl glow"
                                >
                                    <ShoppingCart className="mr-2 w-6 h-6" />
                                    Agregar al carrito
                                </Button>
                            </div>

                            {/* Shopping Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Truck className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest leading-tight">Envío Gratis<br /><span className="text-muted-foreground font-bold">En compras +$50k</span></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest leading-tight">Garantía<br /><span className="text-muted-foreground font-bold">Oficial 12 meses</span></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <RotateCcw className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest leading-tight">Cambios<br /><span className="text-muted-foreground font-bold">Hasta 30 días</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductoDetalle;
