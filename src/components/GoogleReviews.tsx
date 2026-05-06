import { useEffect, useState, useCallback } from "react";
import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const GOOGLE_REVIEW_URL =
  "https://g.page/r/REEMPLAZAR_CON_TU_PLACE_ID/review";

const reviews = [
  {
    name: "Nikolai Czernuszka",
    avatar: "N",
    avatarBg: "#4285F4",
    time: "Hace 1 semana",
    rating: 5,
    text: "Súper recomendables. Yo estaba entre 4 paletas y me ayudaron a elegir, Gastón un 10!",
  },
  {
    name: "Fran Medina",
    avatar: "F",
    avatarBg: "#34A853",
    time: "Hace 3 semanas",
    rating: 5,
    text: "Muy buena tienda, excelente atención.",
  },
  {
    name: "Silvana Julieta Gonzalez",
    avatar: "S",
    avatarBg: "#EA4335",
    time: "Hace 3 semanas",
    rating: 5,
    text: "Excelente atención y productos de calidad. Muy recomendables.",
  },
  {
    name: "Paulina Estay",
    avatar: "P",
    avatarBg: "#FBBC05",
    time: "Hace 1 mes",
    rating: 5,
    text: "Excelente atención de principio a fin, fueron los únicos que pudieron resolver mi urgencia de comprar una pala específica. Muy recomendables.",
  },
  {
    name: "David Carusillo",
    avatar: "D",
    avatarBg: "#4285F4",
    time: "Hace 1 mes",
    rating: 5,
    text: "Excelente atención y mucha variedad de productos.",
  },
  {
    name: "Rebeca Ph2",
    avatar: "R",
    avatarBg: "#9E9E9E",
    time: "Hace 1 mes",
    rating: 5,
    text: "¡Tremendo servicio! ¡Éxitos!",
  },
  {
    name: "Lucas Fernández",
    avatar: "L",
    avatarBg: "#34A853",
    time: "Hace 2 meses",
    rating: 5,
    text: "Compré mi primera pala acá y la atención fue increíble. Me explicaron todo y encontré la pala perfecta para mi nivel.",
  },
  {
    name: "Mariana Torres",
    avatar: "M",
    avatarBg: "#EA4335",
    time: "Hace 2 meses",
    rating: 5,
    text: "Excelente stock y precios muy competitivos. El envío llegó rápido y bien embalado. Recomiendo 100%.",
  },
];

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-label="Google">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-[#FBBC05] text-[#FBBC05]" : "fill-zinc-600 text-zinc-600"}`}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: (typeof reviews)[0] }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 120;
  const displayText =
    isLong && !expanded ? review.text.slice(0, 120) + "..." : review.text;

  return (
    <div className="bg-white border border-border rounded-xl p-5 h-full flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
          style={{ backgroundColor: review.avatarBg }}
        >
          {review.avatar}
        </div>
        <div className="min-w-0">
          <p className="text-foreground font-semibold text-sm leading-tight truncate">
            {review.name}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <GoogleIcon />
            <span className="text-muted-foreground text-xs">{review.time}</span>
          </div>
        </div>
      </div>

      <StarRating rating={review.rating} />

      <p className="text-muted-foreground text-sm leading-relaxed flex-1">
        {displayText}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-blue-500 hover:text-blue-400 transition-colors"
          >
            {expanded ? "Ver menos" : "Leer más"}
          </button>
        )}
      </p>
    </div>
  );
};

const GoogleReviews = () => {
  const [api, setApi] = useState<CarouselApi>();

  const scrollNext = useCallback(() => {
    if (!api) return;
    if (api.canScrollNext()) {
      api.scrollNext();
    } else {
      api.scrollTo(0);
    }
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(scrollNext, 4000);
    return () => clearInterval(interval);
  }, [api, scrollNext]);

  return (
    <section className="bg-secondary/40 py-10 px-4 border-t border-border">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <GoogleIcon />
            <div>
              <p className="text-foreground font-bold text-base leading-tight">
                Reseñas de Google
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-foreground font-bold">4.6</span>
                <StarRating rating={5} />
                <span className="text-muted-foreground text-sm">(103)</span>
              </div>
            </div>
          </div>

          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm gap-2 shrink-0"
          >
            <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Déjanos una reseña
            </a>
          </Button>
        </div>

        {/* Carousel — 4 cards en desktop */}
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {reviews.map((review, i) => (
              <CarouselItem
                key={i}
                className="pl-3 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <ReviewCard review={review} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default GoogleReviews;
