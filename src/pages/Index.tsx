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
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Tienda Online de Pádel"
        description="Equipamiento profesional de pádel en Argentina. Encontrá las mejores palas, pelotas, bolsos y accesorios con envío a todo el país."
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
