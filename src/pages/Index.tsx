import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PromoBanner from "@/components/PromoBanner";
import CategorySection from "@/components/CategorySection";
import OffersSection from "@/components/OffersSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PromoBanner />
        <CategorySection />
        <OffersSection />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
