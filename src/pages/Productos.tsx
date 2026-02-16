import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products, Product } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import {
    Search,
    SlidersHorizontal,
    ChevronDown,
    X,
    LayoutGrid,
    List,
    SortAsc,
    SortDesc,
    Zap,
    Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const categories = ["Palas", "Pelotas", "Bolsos", "Indumentaria", "Accesorios"];
const levels = ["Principiante", "Intermedio", "Avanzado", "Profesional"];
const types = ["Control", "Potencia", "Polivalente"];

const Productos = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Get filter values from URL
    const categoryFilter = searchParams.get("categoria");
    const offerFilter = searchParams.get("ofertas") === "true";
    const searchFilter = searchParams.get("search");
    const levelFilter = searchParams.get("nivel");
    const typeFilter = searchParams.get("tipo");
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
    const sortBy = searchParams.get("sort") || "featured";

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            if (categoryFilter && product.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
            if (offerFilter && !product.isOffer) return false;
            if (levelFilter && product.level !== levelFilter) return false;
            if (typeFilter && product.type !== typeFilter) return false;
            if (searchFilter && !product.name.toLowerCase().includes(searchFilter.toLowerCase())) return false;
            if (minPrice !== null && product.price < minPrice) return false;
            if (maxPrice !== null && product.price > maxPrice) return false;
            return true;
        }).sort((a, b) => {
            if (sortBy === "price-asc") return a.price - b.price;
            if (sortBy === "price-desc") return b.price - a.price;
            if (sortBy === "best-sellers") return b.salesCount - a.salesCount;
            return 0; // featured/default
        });
    }, [categoryFilter, offerFilter, searchFilter, levelFilter, typeFilter, minPrice, maxPrice, sortBy]);

    const updateFilters = (key: string, value: string | null) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams(new URLSearchParams());
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 md:py-12">
                {/* Banner / Title Section */}
                <div className="mb-12">
                    <h1 className="font-heading text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
                        {categoryFilter || (offerFilter ? "Ofertas Flash" : "Todos los productos")}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        {offerFilter
                            ? "Aprovechá nuestros precios exclusivos por tiempo limitado."
                            : "Encontrá el mejor equipamiento de padel con tecnología de punta y diseño premium."}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Filters Sidebar */}
                    <aside className="hidden lg:block w-64 space-y-8">
                        <div>
                            <h3 className="font-heading font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                <LayoutGrid className="w-3 h-3" /> Categorías
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => updateFilters("categoria", null)}
                                    className={`block text-sm font-medium transition-colors hover:text-primary ${!categoryFilter ? 'text-primary' : 'text-foreground/70'}`}
                                >
                                    Todas
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => updateFilters("categoria", cat.toLowerCase())}
                                        className={`block text-sm font-medium transition-colors hover:text-primary ${categoryFilter === cat.toLowerCase() ? 'text-primary' : 'text-foreground/70'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-heading font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Zap className="w-3 h-3 text-primary" /> Especiales
                            </h3>
                            <button
                                onClick={() => updateFilters("ofertas", offerFilter ? null : "true")}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-destructive ${offerFilter ? 'text-destructive' : 'text-foreground/70'}`}
                            >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${offerFilter ? 'bg-destructive border-destructive text-white' : 'border-border'}`}>
                                    {offerFilter && <X className="w-3 h-3" />}
                                </div>
                                Solo Ofertas
                            </button>
                        </div>

                        <div>
                            <h3 className="font-heading font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Tag className="w-3 h-3" /> Rango de precio
                            </h3>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice || ""}
                                    onChange={(e) => updateFilters("minPrice", e.target.value)}
                                    className="w-full bg-secondary border border-border rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none focus:border-primary transition-colors"
                                />
                                <span className="text-muted-foreground text-xs">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice || ""}
                                    onChange={(e) => updateFilters("maxPrice", e.target.value)}
                                    className="w-full bg-secondary border border-border rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        {categoryFilter === "palas" && (
                            <>
                                <div>
                                    <h3 className="font-heading font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                        Nivel
                                    </h3>
                                    <div className="space-y-2">
                                        {levels.map((lvl) => (
                                            <button
                                                key={lvl}
                                                onClick={() => updateFilters("nivel", levelFilter === lvl ? null : lvl)}
                                                className={`block text-sm font-medium transition-colors hover:text-primary ${levelFilter === lvl ? 'text-primary' : 'text-foreground/70'}`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-heading font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                        Tipo de juego
                                    </h3>
                                    <div className="space-y-2">
                                        {types.map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => updateFilters("tipo", typeFilter === t ? null : t)}
                                                className={`block text-sm font-medium transition-colors hover:text-primary ${typeFilter === t ? 'text-primary' : 'text-foreground/70'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {(categoryFilter || offerFilter || levelFilter || typeFilter || searchFilter) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="w-full justify-start text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground p-0"
                            >
                                <X className="w-3 h-3 mr-2" /> Limpiar filtros
                            </Button>
                        )}
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-card border border-border rounded-2xl p-4">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="lg:hidden rounded-xl h-10 border-border"
                                    onClick={() => setMobileFiltersOpen(true)}
                                >
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    Filtros
                                </Button>
                                <div className="text-sm text-muted-foreground font-medium">
                                    Mostrando <span className="text-foreground font-bold">{filteredProducts.length}</span> productos
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground hidden sm:inline-block">Ordenar:</span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="font-bold text-sm h-10 rounded-xl px-4 hover:bg-secondary">
                                            {sortBy === "price-asc" ? "Menor precio" :
                                                sortBy === "price-desc" ? "Mayor precio" :
                                                    sortBy === "best-sellers" ? "Más vendidos" : "Destacados"}
                                            <ChevronDown className="ml-2 w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl border-border bg-card">
                                        <DropdownMenuItem onClick={() => updateFilters("sort", "featured")} className="font-medium cursor-pointer">Destacados</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => updateFilters("sort", "best-sellers")} className="font-medium cursor-pointer">Más vendidos</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => updateFilters("sort", "price-asc")} className="font-medium cursor-pointer">Precio: Menor a Mayor</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => updateFilters("sort", "price-desc")} className="font-medium cursor-pointer">Precio: Mayor a Menor</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Active Tags */}
                        {(categoryFilter || searchFilter) && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {categoryFilter && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 capitalize">
                                        {categoryFilter}
                                        <button onClick={() => updateFilters("categoria", null)}><X className="w-3 h-3" /></button>
                                    </span>
                                )}
                                {searchFilter && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-foreground text-xs font-bold rounded-full border border-border">
                                        Busca: {searchFilter}
                                        <button onClick={() => updateFilters("search", null)}><X className="w-3 h-3" /></button>
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Product Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-10 h-10 text-muted-foreground opacity-20" />
                                </div>
                                <h3 className="font-heading font-black text-2xl uppercase italic mb-2">No se encontraron productos</h3>
                                <p className="text-muted-foreground mb-8">Intentá ajustando los filtros o buscando algo diferente.</p>
                                <Button onClick={clearFilters} variant="outline" className="rounded-xl border-primary/30 text-primary font-bold uppercase tracking-wider">
                                    Ver todo el catálogo
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />

            {/* Mobile Filters Modal placeholder - can be implemented with a Sheet if needed */}
        </div>
    );
};

export default Productos;
