import { useState } from "react";
import { ShoppingCart, Menu, X, ChevronDown, Search } from "lucide-react";

const categories = [
  {
    name: "Paletas",
    subcategories: ["Control", "Potencia", "Polivalente", "Profesional"],
  },
  {
    name: "Pelotas",
    subcategories: ["Tubos x3", "Tubos x4", "Cajón x24"],
  },
  {
    name: "Bolsos",
    subcategories: ["Mochilas", "Paleteros", "Bolsos de viaje"],
  },
  {
    name: "Indumentaria",
    subcategories: ["Remeras", "Shorts", "Calzas", "Camperas"],
  },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="text-gradient">PADEL</span>
            <span className="text-foreground">PRO</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(cat.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  {cat.name}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === cat.name && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg py-2 z-50 animate-fade-in">
                    {cat.subcategories.map((sub) => (
                      <a
                        key={sub}
                        href="#"
                        className="block px-4 py-2.5 text-sm text-popover-foreground/80 hover:text-primary hover:bg-secondary transition-colors"
                      >
                        {sub}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a href="#" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Ofertas
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-foreground/70 hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="relative p-2 text-foreground/70 hover:text-primary transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
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
          <div className="container mx-auto px-4 py-4 space-y-2">
            {categories.map((cat) => (
              <div key={cat.name}>
                <button
                  className="flex items-center justify-between w-full py-3 text-sm font-medium text-foreground/90"
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
            <a href="#" className="block py-3 text-sm font-medium text-foreground/90">Ofertas</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
