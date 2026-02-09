import { Instagram, Facebook, Twitter, Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="font-heading text-2xl font-black tracking-tighter">
              <span className="text-gradient">PADEL</span>
              <span className="text-foreground">PRO</span>
            </a>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Tu tienda online de pádel. Equipamiento premium para jugadores que van por todo.
            </p>
            <div className="flex gap-3 mt-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-black text-sm mb-4 text-foreground uppercase tracking-wider">Categorías</h4>
            <ul className="space-y-2.5">
              {["Palas", "Pelotas", "Bolsos", "Indumentaria", "Accesorios"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-black text-sm mb-4 text-foreground uppercase tracking-wider">Ayuda</h4>
            <ul className="space-y-2.5">
              {["Envíos", "Devoluciones", "Métodos de pago", "Contacto"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-black text-sm mb-4 text-foreground uppercase tracking-wider">Empresa</h4>
            <ul className="space-y-2.5">
              {["Sobre nosotros", "Blog", "Términos", "Privacidad"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 PadelPro. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="w-3 h-3 text-primary" />
            Hecho con pasión por el pádel
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
