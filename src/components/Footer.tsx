import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="font-heading text-2xl font-extrabold tracking-tight">
              <span className="text-gradient">PADEL</span>
              <span className="text-foreground">PRO</span>
            </a>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Tu tienda online de pádel. Equipamiento premium para jugadores de todos los niveles.
            </p>
            <div className="flex gap-3 mt-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm mb-4 text-foreground">Categorías</h4>
            <ul className="space-y-2.5">
              {["Paletas", "Pelotas", "Bolsos", "Indumentaria"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm mb-4 text-foreground">Ayuda</h4>
            <ul className="space-y-2.5">
              {["Envíos", "Devoluciones", "Métodos de pago", "Contacto"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm mb-4 text-foreground">Empresa</h4>
            <ul className="space-y-2.5">
              {["Sobre nosotros", "Blog", "Términos", "Privacidad"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">© 2026 PadelPro. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
