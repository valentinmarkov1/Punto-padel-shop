import { Instagram, Facebook, Zap, Lock as LockIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background border-t border-border pt-16 pb-8 relative overflow-hidden">
      {/* Textura de cancha */}
      <div className="absolute inset-0 court-lines opacity-5" />

      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-heading text-2xl font-black tracking-tighter mb-2">
              <span className="text-background">PUNTO PADEL SHOP</span>
              <img src="/logo-corona.png" alt="Icono Punto Padel" className="w-8 h-8 object-contain" />
            </Link>
            <p className="mt-3 text-sm text-background/60 leading-relaxed">
              Tu tienda online de pádel. Equipamiento premium para jugadores que van por todo.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://www.instagram.com/puntopadel.shop?igsh=YndpOGd3dHF2cGp6&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-background/10 border border-background/20 flex items-center justify-center text-background/60 hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-black text-sm mb-4 text-background uppercase tracking-wider">Categorías</h4>
            <ul className="space-y-2.5">
              {["Palas", "Pelotas", "Bolsos", "Indumentaria", "Accesorios"].map((item) => (
                <li key={item}>
                  <Link to={`/productos?categoria=${item.toLowerCase()}`} className="text-sm text-background/60 hover:text-primary transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-black text-sm mb-4 text-background uppercase tracking-wider">Ayuda</h4>
            <ul className="space-y-2.5">
              {[
                { name: "Envíos", path: "/envios" },
                { name: "Devoluciones", path: "/devoluciones" },
                { name: "Métodos de pago", path: "/metodos-de-pago" },
                { name: "Contacto", path: "/contacto" }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm text-background/60 hover:text-primary transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-black text-sm mb-4 text-background uppercase tracking-wider">Empresa</h4>
            <ul className="space-y-2.5">
              {[
                { name: "Sobre nosotros", path: "/sobre-nosotros" },
                { name: "Términos", path: "/terminos" }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm text-background/60 hover:text-primary transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-background/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/50">© 2026 Punto Pádel. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin-login" className="text-background/10 hover:text-primary/40 transition-colors">
              <LockIcon className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
