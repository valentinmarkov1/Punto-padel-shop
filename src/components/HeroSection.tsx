import { Link } from "react-router-dom";
import imgPaleta from "@/assets/product-paleta.jpg";
import imgHero from "@/assets/hero-padel.jpg";
import imgBolso from "@/assets/product-bolso.jpg";
import imgIndu from "@/assets/product-indumentaria.jpg";

const VER = ({ to }: { to: string }) => (
  <Link
    to={to}
    className="inline-block mt-3 bg-white/10 hover:bg-white/20 text-white text-xs font-heading font-bold uppercase tracking-widest px-4 py-1.5 transition-colors duration-200 w-fit"
  >
    Ver
  </Link>
);

const HeroSection = () => {
  return (
    <section className="w-full bg-black">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-2 h-auto md:h-[520px]">

          {/* ── Banner principal izquierda ── */}
          <div className="relative overflow-hidden min-h-[320px]">
            <img
              src={imgHero}
              alt="Nueva colección de palas"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <p className="text-primary font-heading font-black text-3xl md:text-4xl uppercase leading-tight">
                Colección 2026
              </p>
              <p className="text-white/80 font-heading font-bold text-sm uppercase tracking-wider mt-1">
                Nueva colección de palas
              </p>
              <VER to="/productos?categoria=palas" />
            </div>
          </div>

          {/* ── 3 banners derecha ── */}
          <div className="grid grid-rows-3 gap-2 min-h-[400px] md:min-h-0">

            {/* Banner 1 — Palas */}
            <div className="relative overflow-hidden">
              <img
                src={imgPaleta}
                alt="Palas de élite"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/55" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                <p className="text-white font-heading font-black text-xl md:text-2xl uppercase leading-tight">
                  Palas de <span className="text-primary">élite</span>
                </p>
                <p className="text-white/70 text-xs mt-0.5">Para todos los niveles.</p>
                <VER to="/productos?categoria=palas" />
              </div>
            </div>

            {/* Banner 2 — Indumentaria próximamente */}
            <div className="relative overflow-hidden">
              <img
                src={imgIndu}
                alt="Indumentaria próximamente"
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-60"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                <p className="text-white font-heading font-black text-xl md:text-2xl uppercase leading-tight">
                  Indumentaria
                </p>
                <p className="text-white/50 text-xs mt-0.5 uppercase tracking-widest font-bold">Próximamente</p>
              </div>
            </div>

            {/* Banner 3 — Bolsos próximamente */}
            <div className="relative overflow-hidden">
              <img
                src={imgBolso}
                alt="Bolsos próximamente"
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-60"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                <p className="text-white font-heading font-black text-xl md:text-2xl uppercase leading-tight">
                  Bolsos
                </p>
                <p className="text-white/50 text-xs mt-0.5 uppercase tracking-widest font-bold">Próximamente</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
