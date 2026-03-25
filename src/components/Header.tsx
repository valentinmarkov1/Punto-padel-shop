import { useState, useRef, useEffect } from "react";
import { ShoppingCart, Menu, X, ChevronDown, Search, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

const categories = [
  {
    name: "Palas",
    path: "/productos?categoria=palas",
    subcategories: [
      { name: "Control", path: "/productos?categoria=palas&tipo=Control" },
      { name: "Potencia", path: "/productos?categoria=palas&tipo=Potencia" },
      { name: "Polivalente", path: "/productos?categoria=palas&tipo=Polivalente" },
      { name: "Profesional", path: "/productos?categoria=palas&nivel=Profesional" },
      { name: "Principiante", path: "/productos?categoria=palas&nivel=Principiante" },
    ],
  },
  {
    name: "Bolsos",
    path: "/productos?categoria=bolsos",
    subcategories: [
      { name: "Mochilas", path: "/productos?categoria=bolsos" },
      { name: "Bolsos paleteros", path: "/productos?categoria=bolsos" },
      { name: "Fundas", path: "/productos?categoria=bolsos" },
    ],
  },
  {
    name: "Indumentaria",
    path: "/productos?categoria=indumentaria",
    subcategories: [
      { name: "Remeras", path: "/productos?categoria=indumentaria" },
      { name: "Shorts", path: "/productos?categoria=indumentaria" },
    ],
  },
  {
    name: "Accesorios",
    path: "/productos?categoria=accesorios",
    subcategories: [
      { name: "Pelotas", path: "/productos?categoria=pelotas" },
      { name: "Muñequeras", path: "/productos?categoria=accesorios" },
      { name: "Cubre grip", path: "/productos?categoria=accesorios" },
      { name: "Protectores", path: "/productos?categoria=accesorios" },
      { name: "Correas", path: "/productos?categoria=accesorios" },
    ],
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
  const [cartOpen, setCartOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const suggestions = searchQuery.length > 1
    ? allProducts.filter((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      const nav = document.querySelector('nav');
      if (nav && !nav.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top ticker */}
      <div className="bg-foreground text-background overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap py-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="mx-8 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3 h-3 text-primary" /> ENVÍO GRATIS EN COMPRAS +$50.000
              <span className="mx-4 text-primary">•</span>
              NUEVA COLECCIÓN 2026 DISPONIBLE
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5 md:gap-2 font-heading text-2xl md:text-3xl font-black tracking-tighter">
              <span className="text-black hidden md:block leading-none">PUNTO PADEL SHOP</span>
              <img src="/logo-corona.png" alt="Icono Punto Padel" className="w-9 h-9 md:w-12 md:h-12 object-contain mix-blend-multiply transition-all" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(cat.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={cat.path}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide"
                  >
                    {cat.name}
                    <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === cat.name ? 'rotate-180' : ''}`} />
                  </Link>
                  {activeDropdown === cat.name && (
                    <div className="absolute top-full left-0 mt-0 w-52 bg-card border border-border rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className="block px-4 py-2.5 text-sm text-foreground/70 hover:text-primary hover:bg-secondary transition-colors font-medium"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/productos?ofertas=true" className="px-3 py-2 text-sm font-bold text-destructive uppercase tracking-wide hover:text-destructive/80 transition-colors flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                Ofertas
              </Link>
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
                    <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-border px-4">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none py-3 px-3 text-sm text-foreground placeholder:text-muted-foreground"
                        autoFocus
                      />
                    </form>
                    {suggestions.length > 0 && (
                      <div className="py-2 max-h-64 overflow-y-auto">
                        {suggestions.map((s) => (
                          <Link
                            key={s}
                            to={`/productos?search=${encodeURIComponent(s)}`}
                            onClick={() => setSearchOpen(false)}
                            className="block px-4 py-2.5 text-sm text-popover-foreground/80 hover:text-primary hover:bg-secondary transition-colors"
                          >
                            {s}
                          </Link>
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
                            <Link
                              key={tag}
                              to={tag === "Ofertas" ? "/productos?ofertas=true" : `/productos?categoria=${tag.toLowerCase()}`}
                              onClick={() => setSearchOpen(false)}
                              className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                className="relative p-2 text-foreground/70 hover:text-primary transition-colors"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-black rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
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
                  <div className="flex items-center justify-between w-full py-3">
                    <Link
                      to={cat.path}
                      className="text-sm font-bold text-foreground/90 uppercase tracking-wide"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === cat.name ? null : cat.name)}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === cat.name ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {activeDropdown === cat.name && (
                    <div className="pl-4 space-y-1 pb-2">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/productos?ofertas=true"
                className="flex items-center gap-1 py-3 text-sm font-bold text-destructive uppercase tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Zap className="w-4 h-4" />
                Ofertas
              </Link>
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};

export default Header;
