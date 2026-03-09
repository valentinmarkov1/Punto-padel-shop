import { useParams, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    ShoppingCart,
    ArrowLeft,
    Zap,
    Minus,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import ProductGallery from "@/components/ProductGallery";

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

            <main className="container mx-auto px-4 py-8 md:py-16 lg:py-24">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8 uppercase tracking-wider"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-12 lg:gap-24 items-start">
                    {/* Advanced Product Gallery */}
                    <div className="animate-fade-in">
                        <ProductGallery images={product.images} name={product.name} />
                        {product.isOffer && (
                            <div className="mt-6 flex justify-center lg:justify-start">
                                <span className="px-4 py-2 text-xs font-black uppercase tracking-[0.2em] bg-destructive text-white rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse flex items-center gap-2">
                                    <Zap className="w-4 h-4 fill-white" />
                                    Oferta Especial {product.discount}
                                </span>
                            </div>
                        )}
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
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductoDetalle;
