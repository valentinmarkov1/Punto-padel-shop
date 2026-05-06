// Marcas: confirmá con el cliente cuáles vende realmente y actualizá esta lista
const brands = [
  "NOX", "ADIDAS", "BABOLAT", "WILSON", "HEAD",
  "BULLPADEL", "STARVIE", "SIUX", "BLACK CROWN", "VARLION",
];

const BrandsCarousel = () => {
  // Duplicamos para que el marquee sea infinito sin corte
  const repeated = [...brands, ...brands];

  return (
    <section className="py-6 bg-white border-b border-border overflow-hidden">
      <div className="relative">
        {/* Fade lateral izquierdo */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-white to-transparent" />
        {/* Fade lateral derecho */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-white to-transparent" />

        <div className="flex animate-marquee whitespace-nowrap">
          {repeated.map((brand, i) => (
            <span
              key={i}
              className="inline-block mx-10 font-heading font-black text-xl uppercase tracking-wider text-zinc-300 hover:text-foreground transition-colors cursor-default select-none"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsCarousel;
