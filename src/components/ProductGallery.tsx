import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

const ProductGallery = ({ images, name }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", transformOrigin: "0% 0%" });

  // Embla para Móvil
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = (index: number) => {
    setActiveIndex(index);
    if (emblaApi) emblaApi.scrollTo(index);
  };

  // Lógica de Zoom al pasar el mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: "block",
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", transformOrigin: "0% 0%" });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Miniaturas de escritorio (Izquierda) */}
      <div className="hidden lg:block w-24 flex-shrink-0">
        <ScrollArea className="h-[500px] pr-3">
          <div className="flex flex-col gap-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                  "relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300",
                  activeIndex === i 
                    ? "border-primary shadow-[0_0_15px_rgba(74,222,128,0.3)]" 
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt={`Vista miniatura ${i + 1} de ${name}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Contenedor de imagen principal */}
      <div className="flex-1 space-y-4">
        {/* Imagen principal de escritorio (con Zoom) */}
        <div className="hidden lg:block relative group aspect-[4/5] rounded-[32px] overflow-hidden bg-secondary border border-border cursor-crosshair">
          <div 
            className="w-full h-full overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsLightboxOpen(true)}
          >
             <img 
              src={images[activeIndex]} 
              alt={`Fotografía principal de ${name}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Superposición de Zoom */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10"
              style={{
                backgroundImage: `url(${images[activeIndex]})`,
                backgroundSize: '250%',
                backgroundPosition: zoomStyle.transformOrigin,
                display: zoomStyle.display === 'none' ? 'none' : 'block'
              }}
            />
          </div>
          
          <button 
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-6 right-6 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground transform translate-y-2 group-hover:translate-y-0"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>

        {/* Galería móvil (Embla) */}
        <div className="lg:hidden relative">
          <div className="overflow-hidden rounded-3xl bg-secondary border border-border" ref={emblaRef}>
            <div className="flex">
              {images.map((img, i) => (
                <div key={i} className="flex-[0_0_100%] min-w-0 aspect-square" onClick={() => setIsLightboxOpen(true)}>
                  <img src={img} alt={name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Indicadores de interfaz móvil */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  selectedIndex === i ? "w-8 bg-primary" : "w-1.5 bg-white/30"
                )}
              />
            ))}
          </div>
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white/80 border border-white/10">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Lightbox / Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center group/modal">
             {/* Botones de navegación */}
             {images.length > 1 && (
               <>
                <button 
                  onClick={() => scrollTo((activeIndex - 1 + images.length) % images.length)}
                  className="absolute left-4 z-50 p-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-primary transition-all"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button 
                  onClick={() => scrollTo((activeIndex + 1) % images.length)}
                  className="absolute right-4 z-50 p-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-primary transition-all"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
               </>
             )}
            
            <img 
              src={images[activeIndex]} 
              alt={name} 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" 
            />
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 px-6 py-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 overflow-x-auto max-w-[90vw]">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all",
                    activeIndex === i ? "border-primary" : "border-transparent opacity-50"
                  )}
                >
                  <img src={img} alt={`Miniatura ampliada ${i + 1} de ${name}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            <DialogTrigger asChild>
              <button className="absolute -top-12 right-0 text-white/70 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-sm transition-colors">
                Cerrar <X className="w-5 h-5" />
              </button>
            </DialogTrigger>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductGallery;
