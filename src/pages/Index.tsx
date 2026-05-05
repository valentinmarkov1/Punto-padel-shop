import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PromoBanner from "@/components/PromoBanner";
import CategorySection from "@/components/CategorySection";
import OffersSection from "@/components/OffersSection";
import BrandSection from "@/components/BrandSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "SportsStore",
    "name": "Punto Pádel Shop",
    "image": "https://puntopadel.com.ar/logo.jpeg",
    "@id": "https://puntopadel.com.ar",
    "url": "https://puntopadel.com.ar",
    "telephone": "+5491100000000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Berazategui",
      "addressLocality": "Buenos Aires",
      "addressRegion": "Buenos Aires",
      "addressCountry": "AR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -34.7621,
      "longitude": -58.2106
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "20:00"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Tienda de Pádel"
        description="Punto Pádel: Tu tienda de confianza en Berazategui. Palas de pádel profesionales, pelotas, bolsos y accesorios con envío a toda Argentina."
        schema={storeSchema}
      />
      <Header />
      <main>
        <HeroSection />
        <PromoBanner />
        <CategorySection />
        <OffersSection />
        <BrandSection />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
