import { useState, useRef, useEffect } from "react";
import { ShoppingCart, Menu, X, ChevronDown, Search, Zap } from "lucide-react";

const categories = [
  {
    name: "Palas",
    subcategories: ["Control", "Potencia", "Polivalente", "Profesional", "Principiante"],
  },
  {
    name: "Bolsos",
    subcategories: ["Mochilas", "Bolsos paleteros", "Fundas"],
  },
  {
    name: "Indumentaria",
    subcategories: ["Remeras", "Shorts"],
  },
  {
    name: "Accesorios",
    subcategories: ["Pelotas", "Muñequeras", "Cubre grip", "Protectores", "Correas"],
  },
];

const allProducts = [
  "Paleta Pro Carbon Elite 2026",
  "Paleta Control Soft Touch",
  "Paleta Potencia Thunder X",
  "Tubo de Pelotas Championship x3",
  "Kit Pelotas Presión x4",
  "Mochila Paletero Tour Pro",
  "Bolso Deportivo Weekend XL",
  "Remera Dry-Fit Performance",
  "Short Pro Training Mesh",
  "Grip Overgrip Premium Pack x3",
  "Protector de Paleta Carbon Shield",
  "Muñequera Pro Absorb",
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = searchQuery.length > 1
    ? allProducts.filter((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      // Close dropdown when clicking outside nav
      const nav = document.querySelector('nav');
      if (nav && !nav.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      {/* Top ticker */}
      <div className="bg-foreground text-background overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap py-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="mx-8 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3 h-3" /> ENVÍO GRATIS EN COMPRAS +$50.000
              <span className="mx-4">•</span>
              🔥 HASTA 40% OFF EN PALAS SELECCIONADAS
              <span className="mx-4">•</span>
              ⚡ NUEVA COLECCIÓN 2026 DISPONIBLE
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="/" className="font-heading text-2xl md:text-3xl font-black tracking-tighter">
              <span className="text-primary">PUNTO</span>
              <span className="text-foreground"> PÁDEL</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="relative"
                >
                  <button
                    className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide"
                    onClick={() => setActiveDropdown(activeDropdown === cat.name ? null : cat.name)}
                  >
                    {cat.name}
                    <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === cat.name ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === cat.name && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-card border border-border rounded-lg shadow-xl py-2 z-50 animate-fade-in">
                      {cat.subcategories.map((sub) => (
                        <a
                          key={sub}
                          href="#"
                          className="block px-4 py-2.5 text-sm text-foreground/70 hover:text-primary hover:bg-secondary transition-colors font-medium"
                        >
                          {sub}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a href="#" className="px-3 py-2 text-sm font-bold text-destructive uppercase tracking-wide hover:text-destructive/80 transition-colors flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                Ofertas
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <button
                  className="p-2 text-foreground/70 hover:text-primary transition-colors"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <Search className="w-5 h-5" />
                </button>
                {searchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-popover border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-scale-in">
                    <div className="flex items-center border-b border-border px-4">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none py-3 px-3 text-sm text-foreground placeholder:text-muted-foreground"
                        autoFocus
                      />
                    </div>
                    {suggestions.length > 0 && (
                      <div className="py-2 max-h-64 overflow-y-auto">
                        {suggestions.map((s) => (
                          <a key={s} href="#" className="block px-4 py-2.5 text-sm text-popover-foreground/80 hover:text-primary hover:bg-secondary transition-colors">
                            {s}
                          </a>
                        ))}
                      </div>
                    )}
                    {searchQuery.length > 1 && suggestions.length === 0 && (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No se encontraron resultados
                      </div>
                    )}
                    {searchQuery.length <= 1 && (
                      <div className="p-4">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Populares</p>
                        <div className="flex flex-wrap gap-2">
                          {["Palas", "Pelotas", "Bolsos", "Ofertas"].map((tag) => (
                            <span key={tag} className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button className="relative p-2 text-foreground/70 hover:text-primary transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-black rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
              <button
                className="lg:hidden p-2 text-foreground/70"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border animate-fade-in">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {categories.map((cat) => (
                <div key={cat.name}>
                  <button
                    className="flex items-center justify-between w-full py-3 text-sm font-bold text-foreground/90 uppercase tracking-wide"
                    onClick={() => setActiveDropdown(activeDropdown === cat.name ? null : cat.name)}
                  >
                    {cat.name}
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === cat.name ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === cat.name && (
                    <div className="pl-4 space-y-1 pb-2">
                      {cat.subcategories.map((sub) => (
                        <a key={sub} href="#" className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                          {sub}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a href="#" className="flex items-center gap-1 py-3 text-sm font-bold text-accent uppercase tracking-wide">
                <Zap className="w-4 h-4" />
                Ofertas
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
